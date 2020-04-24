<template>
  <div class="app-container">
    <el-dialog title="新增" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="服务器" prop="host">
          <el-select v-model="temp.host" multiple placeholder="选择服务器" style="width:60%">
            <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="resultTitle" :visible.sync="resultDialogVisible" width="80%">
      <div class="exec-result">
        <el-scrollbar>
          <pre>{{ $store.state.websocket.controlJarResult }}</pre>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="btnDisabled" @click="resultDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ jar }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
      <el-button type="success" :disabled="btnDisabled" plain @click="handleJarControl('start')">启动</el-button>
      <el-button type="success" :disabled="btnDisabled" plain @click="handleJarControl('stop')">停止</el-button>
      <el-button type="success" :disabled="btnDisabled" plain @click="handleJarControl('restart')">重启</el-button>
      <el-button type="success" :disabled="btnDisabled" plain @click="handleJarControl('check')">检查</el-button>
      <el-select v-model="packageFile" placeholder="选择包" style="margin-left:10px">
        <el-option value="a.jar.01" label="a.jar.01">a.jar.01</el-option>
      </el-select>
      <el-button type="success" :disabled="btnDisabled" plain @click="handleJarControl('deploy')">发布</el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="包名" align="center">
        <template>
          <span>{{ jar }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleHostInfo(row.host)">{{ row.host.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center">
        <template>
          <span>{{ project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host.position }}</span>
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
      <el-table-column label="操作" align="center" width="160px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="handleSSHConnectHost(row.host)">SSH</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer title="详情" :visible.sync="hostDrawerVisible" :with-header="false">
      <host-drawer-content :host="hostTemp" />
    </el-drawer>
  </div>
</template>
<script>
import { getHosts, getProjectTomcat, addProjectTomcat, deleteProjectTomcat } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
import { sshConnectHost } from '@/utils/webssh'
import { controlJar } from '@/api/websocket'
export default {
  components: { HostDrawerContent },
  props: {
    env: { type: String, default: null },
    project: { type: Object, default: null },
    software: { type: String, default: null },
    jar: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      packageFile: '',
      tableKey: 0,
      hostList: [],
      dialogVisible: false,
      temp: {
        package_name: this.jar,
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
        type: 'tomcat',
        env: '测试环境',
        ins_num: 0,
        status: true,
        created: new Date()
      },
      hostDrawerVisible: false,
      queryList: {
        env: this.env,
        project: this.project.id,
        package_name: this.jar
      },
      hostQuery: {
        ip: '',
        type: this.software,
        env: this.env,
        limit: 10000
      },
      selectedHosts: [],
      btnDisabled: false,
      resultDialogVisible: false,
      resultTitle: '',
      titleMap: {
        start: '启动 ' + this.jar,
        stop: '停止 ' + this.jar,
        check: '检查 ' + this.jar,
        restart: '重启 ' + this.jar,
        deploy: '发布 ' + this.jar
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectTomcat(this.queryList).then(response => {
        this.list = response
      })
    },
    resetTemp() {
      this.temp = {
        package_name: this.jar,
        env: this.env,
        project: this.project.id,
        host: null,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    createData() {
      addProjectTomcat(this.temp).then(() => {
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
        deleteProjectTomcat(id).then(() => {
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
    },
    handleJarControl(cmd) {
      this.resultTitle = this.titleMap[cmd]
      this.btnDisabled = true
      this.resultDialogVisible = true
      var promise = new Promise((resolve, reject) => {
        controlJar(this.jar, this.selectedHosts, cmd, this.$store, resolve)
      })
      promise.then(() => {
        this.btnDisabled = false
      })
    },
    handleSelectionChange(val) {
      this.selectedHosts = val.map(pt => pt.host)
    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  color: white;
  padding-left: 15px;
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
}
.exec-result{
  flex: 1;
  background-color: black;
  border-radius: 4px;
  /deep/.el-scrollbar{
    height: calc(100vh - 300px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
