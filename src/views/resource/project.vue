<template>
  <div class="app-container">
    <div style="overflow:auto">
      <el-row>
        <el-col :span="4">
          <el-scrollbar><el-tree :data="treeData" props="defaultProps" /></el-scrollbar>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getProjects } from '@/api/resource'
export default {
  data() {
    return {
      treeData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjects().then(response => {
        var results = response.results
        var project_children = []
        for (var i = 0; i < results.length; i++) {
          var id = results[i].id
          var label = results[i].name
          var software = results[i].software
          var java_package = results[i].java_package
          var software_children = []
          var java_children = []
          for (var x = 0; x < software.length; x++) {
            if (software[x].name === 'java') {
              for (var j = 0; j < java_package.length; j++) {
                java_children.push({ id: java_package[j].id, label: java_package[j].name })
              }
              software_children.push({ id: software[x].id, label: software[x].name, children: java_children })
            } else {
              software_children.push({ id: software[x].id, label: software[x].name })
            }
          }
          project_children.push({ id: id, label: label, children: software_children })
        }
        this.treeData.push({ id: 1, label: '生产环境', children: project_children })
        this.treeData.push({ id: 1, label: '测试环境', children: project_children })
      })
    }
  }
}
</script>
