<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="taskType" value-key="id" placeholder="任务类别" clearable class="filter-item" style="width: 150px" @change="filterTask" @clear="filterTaskList = taskList">
        <el-option v-for="item in taskTypeOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="task" value-key="id" placeholder="选择任务" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in filterTaskList" :key="item.id" :label="item.name" :value="item" />
      </el-select>
      <el-select v-model="software" placeholder="主机类别" clearable class="filter-item" style="width: 150px" @change="filterHost" @clear="filterHostList = hostList">
        <el-option v-for="item in softwareList" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-select v-model="hosts" value-key="id" placeholder="选择主机" multiple class="filter-item" style="width: 400px">
        <el-option v-for="h in filterHostList" :key="h.id" :label="h.ip" :value="h" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="execTask">
        执行
      </el-button>
      <pre id="result" />
    </div>
  </div>
</template>

<script>
import { getTask } from '@/api/task'
import { getSoftware, getHosts } from '@/api/resource'
export default {
  name: 'Task',
  data() {
    return {
      hosts: '',
      task: '',
      softwareList: null,
      hostList: null,
      software: '',
      taskType: '',
      filterHostList: null,
      taskTypeOptions: ['install', 'uninstall', 'check', 'control', 'update'],
      taskList: null,
      filterTaskList: null,
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
      }
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
    },
    filterTask() {
      this.filterTaskList = this.taskList.filter(t => t.type === this.taskType)
    },
    execTask() {
      console.log(this.task)
      console.log(this.hosts)
      document.getElementById('result').innerHTML = ''
      var websock = new WebSocket('ws://' + window.location.host + '/api/task/')
      websock.onopen = function() {
        const actions = { 'test': 'abc' }
        websock.send(JSON.stringify(actions))
      }
      websock.onmessage = function(e) {
        if (e.data !== 'closed') {
          document.getElementById('result').append(e.data)
        } else {
          websock.close(1000, 'closed by server')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
pre {
  background-color: black;
  color: white;
  min-height: calc(100vh - 212px);
  padding: 19px;
  border-radius: 4px;
   font-family: "Microsoft YaHei";
}
</style>
