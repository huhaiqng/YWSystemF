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
        <el-tab-pane label="全局权限" name="first">
          <div v-for="item in contentType" :key="item.model">
            <span>{{ modelMap[item.model] }}</span>
            <el-checkbox-group v-model="temp.permissions" style="margin-top:10px;margin-bottom:20px;">
              <el-checkbox v-for="perm in item.permission" :key="perm.id" :label="perm.id">{{ permName(perm.codename) }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="对象权限" name="second">
          <el-select v-model="permTemp.model" clearable placeholder="请选择模型" @change="getObjects">
            <el-option v-for="item in contentType" :key="item.id" :label="modelMap[item.model]" :value="item.model" />
          </el-select>
          <el-select v-model="permTemp.objects" value-key="id" clearable placeholder="请选择对象" multiple style="margin-left:20px;width:60%;" @change="getObjectPerms()">
            <el-option v-for="item in objects" :key="item.id" :label="getOptionLabel(item)" :value="item" />
          </el-select>
          <div v-for="item in permTemp.objects" :key="item.id" style="margin-top:20px;">
            <span>{{ getOptionLabel(item) }}</span>
            <el-checkbox-group v-model="permTemp.permissions" style="margin-top:10px;margin-bottom:20px;">
              <el-checkbox v-for="perm in objectPermOptions " :key="perm.id" :label="perm.id">{{ permName(perm.codename) }}</el-checkbox>
            </el-checkbox-group>
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
import { getContentType, getGroup, addGroup, updateGroup, deleteGroup, getUserObjectPerms } from '@/api/user'
import { getHosts } from '@/api/resource'

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
      dialogVisible: false,
      dialogStatus: null,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      activeName: 'first',
      contentType: [],
      modelMap: {
        host: '主机',
        javapackage: 'JAR 包',
        project: '项目',
        task: '任务',
        mysqldb: 'MySQL DB'
      },
      labelMap: {
        host: 'ip'
      },
      permTemp: {
        model: '',
        objects: null,
        permissions: []
      },
      objects: [],
      objectPermOptions: []
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
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogStatus = 'edit'
    },
    getList() {
      getGroup(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
      getContentType().then(response => {
        this.contentType = []
        for (var i = 0; i < response.length; i++) {
          if (this.modelMap[response[i].model]) {
            this.contentType.push(response[i])
          }
        }
      })
    },
    createData() {
      addGroup(this.temp).then(() => {
        this.dialogVisible = false
        this.getList()
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
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
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
        name: null
      }
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
      if (this.permTemp.model === 'host') {
        var params = { ip: '', type: '', env: '', limit: 10000 }
        getHosts(params).then(response => {
          this.objects = response
        })
        this.objectPermOptions = this.contentType.filter(ct => { return ct.model === 'host' })[0].permission.filter(c => { return c.codename !== 'add_host' })
      }
    },
    getOptionLabel(item) {
      if (this.permTemp.model === 'host') {
        return item.ip
      }
    },
    getObjectPerms() {
      if (this.permTemp.objects.length > 0) {
        getUserObjectPerms(this.permTemp).then(response => {
          console.log(response)
        })
      }
    }
  }
}
</script>
