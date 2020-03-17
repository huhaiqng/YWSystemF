<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" icon="el-icon-edit" type="primary" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="0" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      temp: {
        ip: undefined,
        pakage: undefined,
        port: undefined,
        dir: undefined,
        user: undefined,
        project: undefined,
        configFile: undefined,
        created: new Date()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCreate() {
      console.log('created')
    },
    getList() {
      this.listLoading = false
    }
  }
}
</script>
