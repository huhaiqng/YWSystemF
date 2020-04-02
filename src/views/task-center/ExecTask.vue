<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="filterForm" :model="filterForm" status-icon :rules="rules" label-width="100px" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="taskType" value-key="id" placeholder="任务类别" clearable @change="filterTask" @clear="filterTaskList = taskList">
            <el-option v-for="item in taskTypeOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item prop="task">
          <el-select v-model="filterForm.task" value-key="id" placeholder="选择任务" clearable>
            <el-option v-for="item in filterTaskList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="software" placeholder="主机类别" clearable @change="filterHost" @clear="filterHostList = hostList">
            <el-option v-for="item in softwareList" :key="item.id" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item prop="hosts">
          <el-select v-model="filterForm.hosts" value-key="id" placeholder="选择主机" multiple style="width: 450px">
            <el-option v-for="h in filterHostList" :key="h.id" :label="h.ip" :value="h" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-video-play" :loading="buttionLoading" @click="execTask('filterForm')">执行</el-button>
        </el-form-item>
      </el-form>
      <div class="exec-result">
        <el-scrollbar>
          <pre id="result" />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getTask } from '@/api/task'
import { getSoftware, getHosts } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
export default {
  name: 'Task',
  data() {
    return {
      filterForm: {
        hosts: [],
        task: null
      },
      rules: {
        task: [{ required: true, message: '请选择任务', trigger: 'change' }],
        hosts: [{ required: true, message: '请选择服务器', trigger: 'change' }]
      },
      filterTaskList: null,
      filterHostList: null,
      softwareList: null,
      hostList: null,
      software: '',
      taskType: '',
      taskTypeOptions: ['install', 'uninstall', 'check', 'control', 'update'],
      taskList: null,
      hostQueryList: {
        page: 1,
        ip: '',
        type: '',
        env: '',
        limit: 10000
      },
      taskQueryList: {
        name: '',
        type: '',
        limit: 10000,
        page: 1
      },
      buttionLoading: false
    }
  },
  created() {
    this.getSoftwareList()
    this.getHostList()
    this.getTaskList()
  },
  methods: {
    getSoftwareList() {
      getSoftware().then(response => {
        this.softwareList = response
      })
    },
    getHostList() {
      getHosts(this.hostQueryList).then(response => {
        this.hostList = response
        this.filterHostList = response
      })
    },
    getTaskList() {
      getTask(this.taskQueryList).then(response => {
        this.taskList = response
        this.filterTaskList = response
      })
    },
    filterHost() {
      this.filterHostList = this.hostList.filter(h => h.type === this.software)
      this.hosts = ''
    },
    filterTask() {
      this.filterTaskList = this.taskList.filter(t => t.type === this.taskType)
      this.task = ''
    },
    execTask(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          document.getElementById('result').innerHTML = ''
          var websock = new WebSocket('ws://' + window.location.host + '/api/task/')
          this.buttionLoading = true
          websock.onopen = () => {
            var toMessage = { 'task': this.filterForm.task, 'hosts': this.getDecodePasswordHost() }
            websock.send(JSON.stringify(toMessage))
          }
          websock.onmessage = (e) => {
            if (e.data !== 'closed') {
              document.getElementById('result').append(e.data)
            } else {
              websock.close(1000, 'closed by server')
              this.buttionLoading = false
            }
          }
        } else {
          return false
        }
      })
    },
    getDecodePasswordHost() {
      var sendHosts = []
      for (var i = 0; i < this.filterForm.hosts.length; i++) {
        sendHosts[i] = Object.assign({}, this.filterForm.hosts[i])
        sendHosts[i].password = decodeStr(sendHosts[i].password)
      }
      return sendHosts
    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  color: white;
  padding-left: 19px;
  font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
}
.exec-result{
  flex: 1;
  background-color: black;
  border-radius: 4px;
  /deep/.el-scrollbar{
    height: calc(100vh - 192px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
