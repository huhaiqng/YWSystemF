<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleHostInfo(row.host)">{{ row.host.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实例类别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分片" align="center">
        <template slot-scope="{row}">
          <span>{{ row.shard }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host.env }}</span>
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
              <el-dropdown-item @click.native="handleSSHConnectHost(row.host)">SSH</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="服务器" prop="host">
          <el-select v-model="temp.host" style="width:60%">
            <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="type">
          <el-select v-model="temp.type" style="width:60%">
            <el-option value="mongos">mongos</el-option>
            <el-option value="monogd">mongod</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分片名" prop="shard">
          <el-input v-model="temp.shard" style="width:60%" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" style="width:60%">
            <el-option value="primary">primary</el-option>
            <el-option value="secondary">secondary</el-option>
            <el-option value="arbiter">arbiter</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="temp.port" style="width:60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="hostDrawerVisible" :with-header="false">
      <host-drawer-content :host="hostTemp" />
    </el-drawer>
  </div>
</template>
<script>
import { getHosts, getProjectJar, addProjectJar, updateProjectJar, deleteProjectJar } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
import { sshConnectHost } from '@/utils/webssh'
export default {
  components: { HostDrawerContent },
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
      temp: {
        name: undefined,
        dir: '',
        port: undefined,
        env: this.env,
        project: this.project.id,
        host: null,
        created: new Date()
      },
      hostTemp: {
        name: undefined,
        ip: undefined,
        version: 'CentOS 7',
        cpu: 4,
        memory: '8G',
        disk: '80G',
        position: '阿里云',
        admin: 'root',
        password: '',
        type: 'mongodb',
        env: '测试环境',
        ins_num: 0,
        status: true,
        created: new Date()
      },
      hostDrawerVisible: false,
      queryList: {
        env: this.env,
        project: this.project.id
      },
      dialogStatus: 'create',
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      hostQuery: {
        ip: '',
        type: this.software,
        env: this.env,
        limit: 10000
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectJar(this.queryList).then(response => {
        this.list = response
      })
    },
    resetTemp() {
      this.temp = {
        env: this.env,
        project: this.project.id,
        host: null,
        type: null,
        shard: '',
        role: '',
        port: 27017,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.dialogStatus = 'create'
      this.resetTemp()
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    createData() {
      addProjectJar(this.temp).then(() => {
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
      this.temp.host = row.host.id
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    updateData() {
      updateProjectJar(this.temp).then(() => {
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
    handleHostInfo(h) {
      this.hostTemp = Object.assign({}, h)
      this.hostTemp.password = decodeStr(this.hostTemp.password)
      this.hostDrawerVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectJar(id).then(() => {
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
    handleSSHConnectHost(row) {
      sshConnectHost(row)
    }
  }
}
</script>
