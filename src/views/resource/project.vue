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
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import { getProjects } from '@/api/resource'
export default {
  name: 'TreeProject',
  data() {
    return {
      treeData: [],
      currentComponent: '',
      env: null,
      project: null,
      software: null,
      jar: null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjects().then(response => {
        var results = response
        var pro_project_children = []
        var test_project_children = []
        for (var i = 0; i < results.length; i++) {
          var id = results[i].id
          var label = results[i].name
          var software = results[i].software
          // var java_package = results[i].java_package
          var java_package = []
          var pro_software_children = []
          var pro_java_children = []
          var test_software_children = []
          var test_java_children = []
          for (var x = 0; x < software.length; x++) {
            if (software[x].name === 'tomcat') {
              for (var j = 0; j < java_package.length; j++) {
                pro_java_children.push({ id: java_package[j].id, name: 'ppst', project: label, label: java_package[j].name })
                test_java_children.push({ id: java_package[j].id, name: 'tpst', project: label, label: java_package[j].name })
              }
              pro_software_children.push({ id: software[x].id, name: 'pps', project: label, label: software[x].name, children: pro_java_children })
              test_software_children.push({ id: software[x].id, name: 'tps', project: label, label: software[x].name, children: test_java_children })
            } else {
              pro_software_children.push({ id: software[x].id, name: 'pps', project: label, label: software[x].name })
              test_software_children.push({ id: software[x].id, name: 'tps', project: label, label: software[x].name })
            }
          }
          pro_project_children.push({ id: id, label: label, children: pro_software_children })
          test_project_children.push({ id: id, label: label, children: test_software_children })
        }
        this.treeData.push({ id: 1, label: '生产环境', children: pro_project_children })
        this.treeData.push({ id: 2, label: '测试环境', children: test_project_children })
      })
    },
    handleNodeClick(data) {
      if (data.name === 'pps') {
        this.env = '生产环境'
        this.project = data.project
        this.software = data.label
        this.setComponentIs(this.software)
      } else if (data.name === 'ppst') {
        this.env = '生产环境'
        this.project = data.project
        this.software = 'tomcat'
        this.jar = data.label
        this.setComponentIs(this.software)
      } else if (data.name === 'tps') {
        this.env = '测试环境'
        this.project = data.project
        this.software = data.label
        this.setComponentIs(this.software)
      } else if (data.name === 'tpst') {
        this.env = '测试环境'
        this.project = data.project
        this.software = 'tomcat'
        this.jar = data.label
        this.setComponentIs(this.software)
      }
    },
    setComponentIs(software) {
      var dir = `./components/${software}`
      Vue.component(software, () => import(dir))
      this.currentComponent = software
    }
  }
}
</script>
<style lang="scss" scoped>
.down-tree{
  flex: 1;
  border-right:1px solid rgba(211,219,222,1);
  min-width: 200px;
  max-width: 220px;
  background-color: #f0f2f5;
  /deep/.el-scrollbar{
    height: calc(100vh - 84px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>
