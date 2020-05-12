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
              :default-expanded-keys="['生产环境', '测试环境']"
              style="background-color: #f0f2f5;padding: 20px;"
              @node-click="handleNodeClick"
            />
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20">
        <component
          :is="currentComponent"
          :env="env"
          :project="project"
          :software="software"
          :jar="jar"
          :projects="projects"
          @getList="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { getProjects } from '@/api/resource'
// import abc from '@/views/resource/components/ProjectList'
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
      projects: null
    }
  },
  created() {
    this.getList()
    this.setComponentIs('ProjectList', 'special')
  },
  methods: {
    getList() {
      this.treeData = []
      getProjects().then(response => {
        var results = response
        this.projects = response
        var pro_project_children = []
        var test_project_children = []
        for (var i = 0; i < results.length; i++) {
          var id = results[i].id
          var label = results[i].name
          var project = results[i]
          var software = results[i].software
          var java_package = results[i].java_package
          var pro_software_children = []
          var pro_java_children = []
          var test_software_children = []
          var test_java_children = []
          for (var x = 0; x < software.length; x++) {
            if (software[x].name === 'tomcat') {
              for (var j = 0; j < java_package.length; j++) {
                pro_java_children.push({ id: java_package[j].id, name: 'ppst', project: project, label: java_package[j].name })
                test_java_children.push({ id: java_package[j].id, name: 'tpst', project: project, label: java_package[j].name })
              }
              pro_software_children.push({ id: software[x].id, name: 'pps', project: project, label: software[x].name, children: pro_java_children })
              test_software_children.push({ id: software[x].id, name: 'tps', project: project, label: software[x].name, children: test_java_children })
            } else {
              pro_software_children.push({ id: software[x].id, type: software[x].type, name: 'pps', project: project, label: software[x].name })
              test_software_children.push({ id: software[x].id, type: software[x].type, name: 'tps', project: project, label: software[x].name })
            }
          }
          pro_project_children.push({ id: id, label: label, children: pro_software_children })
          test_project_children.push({ id: id, label: label, children: test_software_children })
        }
        this.treeData.push({ id: 0, label: '项目管理', name: 'project_list' })
        this.treeData.push({ id: 1, label: '生产环境', children: pro_project_children })
        this.treeData.push({ id: 2, label: '测试环境', children: test_project_children })
      })
    },
    handleNodeClick(data) {
      if (data.name === 'project_list') {
        this.setComponentIs('ProjectList', 'special')
      }
      if (data.name === 'pps' && data.label !== 'tomcat') {
        this.env = '生产环境'
        this.project = data.project
        this.software = data.label
        this.setComponentIs(this.software, data.type)
      } else if (data.name === 'ppst') {
        this.env = '生产环境'
        this.project = data.project
        this.software = 'tomcat'
        this.jar = data.label
        this.setComponentIs(this.software, 'special')
      } else if (data.name === 'tps' && data.label !== 'tomcat') {
        this.env = '测试环境'
        this.project = data.project
        this.software = data.label
        this.setComponentIs(this.software, data.type)
      } else if (data.name === 'tpst') {
        this.env = '测试环境'
        this.project = data.project
        this.software = 'tomcat'
        this.jar = data.label
        this.setComponentIs(this.software, 'special')
      }
    },
    setComponentIs(software, type) {
      if (type === 'special') {
        Vue.component(software, res => require([`./components/${software}`], res))
        this.currentComponent = software
      } else if (type === 'general') {
        Vue.component(software, () => import('./components/general'))
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
</style>
