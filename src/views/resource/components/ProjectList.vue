<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>资源管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目</el-breadcrumb-item>
        <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-select v-model="queryList.sort" placeholder="类别" clearable class="filter-item" style="width: 250px" @change="getList">
        <el-option label="全部" value="">全部</el-option>
        <el-option label="佳峰珠宝" value="jpark">佳峰珠宝</el-option>
        <el-option label="零烦恼" value="lfn">零烦恼</el-option>
        <el-option label="其它" value="other">其它</el-option>
      </el-select>
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="0" :data="projects" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          {{ $index + 1 + (queryList.page - 1)*queryList.limit }}
        </template>
      </el-table-column>
      <el-table-column label="项目名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="软件" align="center">
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.software" :key="item.id">{{ index===0?item.name:", " + item.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center">
        <template slot-scope="{row}">
          <span v-for="(item, index) in row.env" :key="item.id">{{ index===0?item.name_cn:", " + item.name_cn }}</span>
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
    <pagination v-show="total>0" :total="total" :page.sync="queryList.page" :limit.sync="queryList.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-form-item label="项目名" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
        <el-form-item label="软件" prop="software">
          <el-select v-model="temp.software" class="filter-item" multiple style="width:60%">
            <el-option v-for="item in softwareList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="env">
          <el-select v-model="temp.env" class="filter-item" multiple style="width:60%">
            <el-option v-for="item in envlist" :key="item.id" :label="item.name_cn" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="类别" prop="sort">
          <el-select v-model="temp.sort" style="width:60%">
            <el-option label="佳峰珠宝" value="jpark">佳峰珠宝</el-option>
            <el-option label="零烦恼" value="lfn">零烦恼</el-option>
            <el-option label="其它" value="other">其它</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProjects, getSoftware, addProjects, deleteProjects, updateProjects } from '@/api/resource'
import Pagination from '@/components/Pagination'
export default {
  name: 'ProjectList',
  components: { Pagination },
  props: {
    envlist: { type: Array, default: null }
  },
  data() {
    return {
      list: null,
      softwareList: null,
      temp: {
        name: '',
        software: undefined,
        env: undefined,
        sort: undefined
      },
      dialogStatus: 'create',
      dialogVisible: false,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      queryList: {
        sort: '',
        page: 1,
        limit: 10
      },
      projects: undefined,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjects(this.queryList).then(response => {
        this.projects = response.results
        this.total = response.count
      })
    },
    restTemp() {
      this.temp = {
        name: '',
        software: undefined,
        env: undefined
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.restTemp()
      getSoftware().then(response => {
        this.softwareList = response
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.temp.software = row.software.map(s => { return s.id })
      this.temp.env = row.env.map(e => { return e.id })
      getSoftware().then(response => {
        this.softwareList = response
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjects(id).then(() => {
          this.$emit('getList')
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
    createData() {
      addProjects(this.temp).then(response => {
        this.$emit('getList')
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '包新增成功！',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    updateData() {
      updateProjects(this.temp).then(() => {
        this.$emit('getList')
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>
