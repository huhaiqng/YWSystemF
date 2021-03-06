<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width:100%">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (listQuery.page - 1)*listQuery.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" align="center">
        <template slot-scope="{row}">
          <span v-for="(u, i) in row.user_set" :key="u.id">{{ i === 0?u.username:", " + u.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteData(row.id,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="组名" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName" tab-position="top" type="border-card" style="margin-left:30px;margin-right:30px;">
        <!-- 全局权限
        获取所有的模型，模型包含了可设置的权限。获取二级菜单，二级菜单绑定了需要设置全局权限的模型。
        通过二级菜单过滤出需要设置全局权限的模型，将二级菜单的标题添加到模型中，便于展示。 -->
        <el-tab-pane label="设置全局权限" name="first">
          <div class="tab-pane">
            <el-scrollbar>
              <div v-for="item in contentType" :key="item.model">
                <span>{{ item.title }}</span>
                <!-- 获取组中包含了该组拥有的模型权限 -->
                <el-checkbox-group v-model="temp.permissions" style="margin-top:10px;margin-bottom:20px;">
                  <el-checkbox v-for="perm in item.permission" :key="perm.id" :label="perm.id">{{ permName(perm.codename) }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <!-- 对象权限 -->
        <el-tab-pane v-if="dialogStatus === 'edit'" label="设置对象权限" name="second">
          <el-select v-model="permTemp.model" placeholder="请选择模型" @change="getObjects">
            <el-option v-for="item in contentType" :key="item.id" :label="item.title" :value="item.model" />
          </el-select>
          <el-select v-model="selectedObjects" value-key="id" clearable placeholder="请选择对象" multiple style="margin-left:20px;width:60%;" @change="getObjectPerms()">
            <el-option v-for="item in objects" :key="item.id" :label="getOptionLabel(item)" :value="item" />
          </el-select>
          <div v-for="item in selectedObjectsWithPerms" :key="item.id" style="margin-top:20px;">
            <span>{{ getOptionLabel(item) }}</span>
            <el-checkbox-group v-model="item.perms" style="margin-top:10px;margin-bottom:20px;">
              <el-checkbox v-for="perm in objectPermOptions " :key="perm.id" :label="perm.id">{{ permName(perm.codename) }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <!-- 菜单权限 -->
        <el-tab-pane v-if="dialogStatus === 'edit'" label="设置菜单权限" name="four">
          <div class="tab-pane">
            <el-scrollbar>
              <el-tree ref="tree" :data="menus" show-checkbox node-key="id" default-expand-all :props="defaultProps" :default-checked-keys="groupL2menu" @check-change="checkChange" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <!-- 查看对象权限 -->
        <el-tab-pane v-if="dialogStatus === 'edit'" label="查看对象权限" name="third">
          <div class="tab-pane">
            <el-scrollbar>
              <div v-for="item in checkedModels" :key="item.id">
                <el-row>
                  <el-col :span="4">
                    <span>{{ item.title }}</span>
                  </el-col>
                  <el-col :span="20">
                    <div v-for="obj in item.group_objects" :key="obj.object">
                      <span>{{ obj.object }}</span>
                      <el-checkbox-group v-model="obj.perms" style="margin-top:10px;margin-bottom:20px;" disabled>
                        <!-- 列出该模型可配置的权限 -->
                        <el-checkbox v-for="perm in getObjectPermOptions(item.model)" :key="perm.id" :label="perm.id">{{ permName(perm.codename) }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getContentType, getGroup, addGroup, updateGroup, deleteGroup, getGroupObjectPerms, setGroupObjectPerms, getGroupPerms, getL2Menu, getGroupL2menu } from '@/api/user'
import { getHosts } from '@/api/resource'
import { getMySQLInstance, getRedisInstance, getRabbitmqInstance, getZookeeperInstance, getActivemqInstance } from '@/api/instance'
import { getTask } from '@/api/task'
import { getAccounts } from '@/api/account'
import { getL1Menu } from '@/api/dashboard'

export default {
  name: 'Group',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      temp: {
        name: null,
        permissions: []
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      menus: [],
      groupL2menu: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      modelMenu: [],
      dialogVisible: false,
      dialogStatus: null,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      activeName: 'first',
      // 需要设置权限的模型
      contentType: [],
      allContentType: [],
      labelMap: {
        host: 'ip'
      },
      permTemp: {
        model: '',
        selectedObjectsId: [],
        permissions: []
      },
      objects: [],
      selectedObjects: [],
      selectedObjectsWithPerms: [],
      objectPermOptions: [],
      checkedModels: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      this.dialogStatus = 'create'
    },
    handleUpdate(row) {
      this.checkedModels = []
      this.permTemp.model = null
      this.selectedObjects = []
      this.selectedObjectsWithPerms = []
      this.activeName = 'first'
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      this.contentType = []
      var data = { groupname: this.temp.name }
      // 获取组的已有权限的二级菜单
      getGroupL2menu(data).then(response => {
        this.groupL2menu = response
      })
      // 获取所有模型，模型会带出该模型可设置的权限
      getContentType().then(response => {
        this.allContentType = response
        // 获取二级菜单，二级菜单定义了哪些模型需要设置全局权限
        getL2Menu().then(response => {
          this.modelMenu = response
          for (var i = 0; i < this.allContentType.length; i++) {
            for (var j = 0; j < this.modelMenu.length; j++) {
              // 如果模型和菜单绑定的模型相等，则该模型添加到需要设置全局权限列表中 contentType
              if (this.allContentType[i].id === this.modelMenu[j].name) {
                // 将模型的标题设置为菜单的标题
                this.allContentType[i].title = this.modelMenu[j].title
                this.contentType.push(this.allContentType[i])
              }
            }
          }
          // 获取组被授权的模型及对象
          getGroupPerms({ groupname: this.temp.name }).then(response => {
            this.checkedModels = response
            for (var x = 0; x < this.checkedModels.length; x++) {
              for (var y = 0; y < this.contentType.length; y++) {
                // 设置被授权模型的名称
                if (this.checkedModels[x].model === this.contentType[y].model) {
                  this.checkedModels[x].title = this.contentType[y].title
                }
              }
            }
          })
        })
      })
      getL1Menu().then(response => {
        this.menus = response
        for (var i = 0; i < this.menus.length; i++) {
          this.menus[i].id = 'l1' + this.menus[i].id
        }
      })
      console.log(this.menus)
    },
    getList() {
      getGroup(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    createData() {
      addGroup(this.temp).then(() => {
        this.dialogVisible = false
        this.getList()
        this.setObjectPerms()
        this.$notify({
          title: '成功',
          message: '用户组新增成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      updateGroup(this.temp).then(() => {
        this.dialogVisible = false
        this.setObjectPerms()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    deleteData(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
        name: null,
        permissions: []
      }
      this.permTemp.model = null
      this.selectedObjects = []
      this.selectedObjectsWithPerms = []
      this.activeName = 'first'
    },
    permName(codename) {
      var permType = codename.split('_')[0]
      if (permType === 'add') {
        return '新增'
      } else if (permType === 'view') {
        return '查看'
      } else if (permType === 'change') {
        return '编辑'
      } else if (permType === 'delete') {
        return '删除'
      } else {
        return permType
      }
    },
    getObjects() {
      var params = null
      this.selectedObjects = []
      this.selectedObjectsWithPerms = []
      this.objects = []
      if (this.permTemp.model === 'host') {
        params = { ip: '', type: '', env: '', limit: 10000 }
        getHosts(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'task') {
        params = { name: '', type: '', page: 0, limit: 10000 }
        getTask(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'account') {
        params = { use: '', page: 0, limit: 10000 }
        getAccounts(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'mysqlinstance') {
        params = { inside_addr: '', page: 0, limit: 10000 }
        getMySQLInstance(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'activemqinstance') {
        params = { inside_addr: '', page: 0, limit: 10000 }
        getActivemqInstance(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'rabbitmqinstance') {
        params = { inside_addr: '', page: 0, limit: 10000 }
        getRabbitmqInstance(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'redisinstance') {
        params = { inside_addr: '', page: 0, limit: 10000 }
        getRedisInstance(params).then(response => {
          this.objects = response
        })
      }
      if (this.permTemp.model === 'zookeeperinstance') {
        params = { inside_addr: '', page: 0, limit: 10000 }
        getZookeeperInstance(params).then(response => {
          this.objects = response
        })
      }
      this.objectPermOptions = this.contentType.filter(ct => { return ct.model === this.permTemp.model })[0].permission.filter(c => { return c.codename !== 'add_' + this.permTemp.model })
    },
    getOptionLabel(item) {
      if (this.permTemp.model === 'host') {
        return item.ip
      } else if (this.permTemp.model === 'mysqlinstance') {
        return item.inside_addr
      } else if (this.permTemp.model === 'activemqinstance') {
        return item.inside_addr
      } else if (this.permTemp.model === 'rabbitmqinstance') {
        return item.inside_addr
      } else if (this.permTemp.model === 'redisinstance') {
        return item.inside_addr
      } else if (this.permTemp.model === 'zookeeperinstance') {
        return item.inside_addr
      } else if (this.permTemp.model === 'account') {
        return item.use
      } else {
        return item.name
      }
    },
    getObjectPerms() {
      var data = { groupname: this.temp.name, model: this.permTemp.model, objects: this.selectedObjects }
      if (this.dialogStatus === 'edit') {
        getGroupObjectPerms(data).then(response => {
          this.selectedObjectsWithPerms = response
        })
      }
    },
    setObjectPerms() {
      // 更新对象权限
      if (this.permTemp.model) {
        var data = { groupname: this.temp.name, model: this.permTemp.model, objects: this.selectedObjectsWithPerms }
        setGroupObjectPerms(data)
      }
    },
    getObjectPermOptions(model) {
      return this.contentType.filter(ct => { return ct.model === model })[0].permission.filter(c => { return c.codename !== 'add_' + model })
    },
    checkChange(menu, isCheck) {
      if (!menu.children) {
        if (isCheck) {
          menu.perms = [176]
        } else {
          menu.perms = []
        }
        // 更新菜单权限
        var checkedL2Menus = []
        checkedL2Menus.push(menu)
        var menuData = { groupname: this.temp.name, model: 'l2menu', objects: checkedL2Menus }
        setGroupObjectPerms(menuData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-pane{
  flex: 1;
  /deep/.el-scrollbar{
    height: calc(100vh - 600px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
