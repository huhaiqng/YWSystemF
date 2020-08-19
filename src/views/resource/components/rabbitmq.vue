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
          <span class="link-type" @click="handleRabbitmqInfo(row)">{{ row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center">
        <template>
          <span>{{ temp.env }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署方式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来源" align="center">
        <template slot-scope="{row}">
          <span>{{ row.origin }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
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
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="地址" prop="name">
          <el-input v-model="temp.addr" style="width:60%" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="temp.port" style="width:60%" />
        </el-form-item>
        <el-form-item label="路径" prop="dir">
          <el-input v-model="temp.dir" style="width:60%" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" style="width:60%" />
        </el-form-item>
        <el-form-item label="密码" prop="dir">
          <el-input v-model="temp.password" style="width:60%" />
        </el-form-item>
        <el-form-item label="部署方式" prop="method">
          <el-select v-model="temp.method" class="filter-item" style="width:60%">
            <el-option value="normal">normal</el-option>
            <el-option value="docker">docker</el-option>
            <el-option value="docker-compose">docker-compose</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来源" prop="origin">
          <el-select v-model="temp.origin" class="filter-item" style="width:60%">
            <el-option value="自建">自建</el-option>
            <el-option value="阿里云">阿里云</el-option>
            <el-option value="华为云">华为云</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="rabbitmqDrawerVisible" :with-header="false">
      <rabbitmq-drawer-content :rabbitmq="temp" />
    </el-drawer>
  </div>
</template>
<script>
import { getProjectRabbitmq, addProjectRabbitmq, updateProjectRabbitmq, deleteProjectRabbitmq } from '@/api/resource'
import RabbitmqDrawerContent from '@/components/Drawer/rabbitmq'
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
      hostList: [],
      dialogVisible: false,
      rabbitmqDrawerVisible: false,
      temp: {
        addr: undefined,
        port: undefined,
        dir: undefined,
        username: undefined,
        password: undefined,
        env: this.env,
        project: this.project.id,
        method: undefined,
        origin: undefined,
        created: new Date()
      },
      queryList: {
        env: this.env,
        project: this.project.id
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
    resetTemp() {
      this.temp = {
        addr: undefined,
        port: undefined,
        dir: undefined,
        username: undefined,
        password: undefined,
        env: this.env,
        project: this.project.id,
        method: undefined,
        origin: undefined,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.resetTemp()
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
      this.dialogStatus = 'edit'
      this.dialogVisible = true
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
      this.temp = Object.assign({}, rabbitmq)
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
