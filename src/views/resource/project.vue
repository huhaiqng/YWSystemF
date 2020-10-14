<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="down-tree">
          <el-scrollbar>
            <el-tree
              :data="treeData"
              perf="tree"
              node-key="label"
              style="background-color: #f0f2f5;padding: 20px;"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="project-web">
          <el-scrollbar>
            <component
              :is="currentComponent"
              :env="env"
              :project="project"
              :software="software"
              :jar="jar"
              :envlist="envList"
              @getList="getList"
            />
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { getProjects, getEnv } from '@/api/resource'
export default {
  name: 'TreeProject',
  data() {
    return {
      treeData: [],
      currentComponent: '',
      env: null,
      project: null,
      software: null,
      jar: null,
      projects: null,
      envList: undefined,
      queryList: {
        name: '',
        sort: '',
        page: 0,
        limit: 10000
      }
    }
  },
  created() {
    this.setComponentIs('ProjectList')
    getEnv().then(response => {
      this.envList = response
      this.getList()
    })
  },
  methods: {
    getList() {
      this.treeData = []
      getProjects(this.queryList).then(response => {
        this.projects = response
        this.treeData.push({ id: 0, label: '项目管理', name: 'project_list' })
        for (var n = 0; n < this.envList.length; n++) {
          var project_list = []
          for (var i = 0; i < response.length; i++) {
            var software = response[i].software
            var software_list = []
            var project_env = response[i].env
            for (var j = 0; j < software.length; j++) {
              software_list.push({ id: software[j].id, label: software[j].name, name: this.envList[n].name_cn, type: 'software', project: response[i], children: [] })
            }
            for (var m = 0; m < project_env.length; m++) {
              if (project_env[m].name_cn === this.envList[n].name_cn) {
                project_list.push({ id: response[i].id, label: response[i].name, children: software_list })
              }
            }
          }
          this.treeData.push({ id: n, label: this.envList[n].name_cn, children: project_list })
        }
      })
    },
    handleNodeClick(data) {
      if (data.name === 'project_list') {
        this.setComponentIs('ProjectList')
      } else if (data.type === 'software') {
        this.env = data.name
        this.software = data.label
        this.project = data.project
        this.setComponentIs(this.software)
      }
    },
    setComponentIs(software) {
      if (software === 'nginx' || software === 'apache' || software === 'iis') {
        Vue.component(software, res => require(['./components/web'], res))
        this.currentComponent = software
      } else {
        Vue.component(software, res => require([`./components/${software}`], res))
        this.currentComponent = software
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.down-tree{
  flex: 1;
  border-right:1px solid rgba(211,219,222,1);
  background-color: #f0f2f5;
  /deep/.el-scrollbar{
    height: calc(100vh - 84px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}

.project-web{
  flex: 1;
  /deep/.el-scrollbar{
    height: calc(100vh - 84px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
