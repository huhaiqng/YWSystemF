<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row>
      <el-table-column label="地址" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleRabbitmqInfo(row.instance)">{{ row.instance.inside_addr }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="外网地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.outside_addr }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.dir }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="版本号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.version }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="部署方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.origin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集群" align="center">
        <template slot-scope="{row}">
          <span>{{ row.instance.cluster }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="密码" align="center">
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-dropdown type="primary">
            <el-button size="mini" split-buttion type="primary">操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="150px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="Rabbitmq 实例" prop="instance">
          <el-select v-model="temp.instance" style="width:60%">
            <el-option v-for="item in instanceList" :key="item.id" :label="item.inside_addr" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="outside_addr">
          <el-input v-model="temp.username" style="width:60%" />
        </el-form-item>
        <el-form-item label="密码" prop="outside_addr">
          <el-input v-model="temp.password" style="width:60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="rabbitmqDrawerVisible" :with-header="false">
      <rabbitmq-drawer-content :instance="instance" />
    </el-drawer>
  </div>
</template>
<script>
import { getProjectRabbitmq, addProjectRabbitmq, updateProjectRabbitmq, deleteProjectRabbitmq } from '@/api/resource'
import RabbitmqDrawerContent from '@/components/Drawer/RabbitmqInstance'
import { getRabbitmqInstance } from '@/api/instance'
export default {
  components: { RabbitmqDrawerContent },
  props: {
    env: { type: String, default: null },
    project: { type: Object, default: null },
    software: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      tableKey: 0,
      instance: undefined,
      instanceList: [],
      dialogVisible: false,
      rabbitmqDrawerVisible: false,
      temp: {
        instance: undefined,
        env: this.env,
        project: this.project.id,
        username: undefined,
        password: undefined,
        created: new Date()
      },
      queryList: {
        env: this.env,
        project: this.project.id
      },
      instanceQueryList: {
        inside_addr: '',
        page: 0,
        limit: 10000
      },
      dialogStatus: 'create',
      textMap: {
        create: '新增',
        edit: '编辑'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectRabbitmq(this.queryList).then(response => {
        this.list = response
      })
    },
    getInstanceList() {
      getRabbitmqInstance(this.instanceQueryList).then(response => {
        this.instanceList = response
      })
    },
    resetTemp() {
      this.temp = {
        instance: undefined,
        env: this.env,
        project: this.project.id,
        username: undefined,
        password: undefined,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.resetTemp()
      this.getInstanceList()
    },
    createData() {
      addProjectRabbitmq(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '新增成功！',
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.getList()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.instance = this.temp.instance.id
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.getInstanceList()
    },
    updateData() {
      updateProjectRabbitmq(this.temp).then(() => {
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleRabbitmqInfo(rabbitmq) {
      this.instance = Object.assign({}, rabbitmq)
      this.rabbitmqDrawerVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectRabbitmq(id).then(() => {
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
    }
  }
}
</script>
