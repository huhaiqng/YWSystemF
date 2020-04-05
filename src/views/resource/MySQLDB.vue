<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryList.name" placeholder="数据库名" style="width:200px" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-model="queryList.project" placeholder="项目名" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getList">
        搜索
      </el-button>
      <el-button class="filter-item" icon="el-icon-edit" type="primary" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="0" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (queryList.page - 1)*queryList.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库名" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center">
        <template slot-scope="{row}">
          <span>{{ row.project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
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
        <el-form-item label="数据库名" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
        <el-form-item label="项目名" prop="project">
          <el-select v-model="temp.project" class="filter-item" style="width:60%">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" style="width:60%" />
        </el-form-item>
        <el-form-item label="生产环境密码" prop="pro_password">
          <el-input v-model="temp.pro_password" style="width:60%" />
        </el-form-item>
        <el-form-item label="测试环境密码" prop="test_password">
          <el-input v-model="temp.test_password" style="width:60%" />
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
    <el-drawer title="详情" :visible.sync="drawerVisible" :with-header="false">
      <mysqldb :mysqldb="mysqldb" />
    </el-drawer>
  </div>
</template>

<script>
import { getProjects, addMySQLDB, deleteMySQLDB, updateMySQLDB, getMySQLDB } from '@/api/resource'
import Pagination from '@/components/Pagination'
import { encodeStr, decodeStr } from '@/utils/base64'
import Mysqldb from '@/components/Drawer/mysqldb'
export default {
  name: 'MySQLDB',
  components: { Pagination, Mysqldb },
  data() {
    return {
      list: null,
      projectList: null,
      total: 0,
      temp: {
        name: '',
        project: '',
        username: '',
        pro_password: '',
        test_password: '',
        created: new Date()
      },
      queryList: {
        name: '',
        project: '',
        page: 0,
        limit: 10
      },
      dialogStatus: 'create',
      dialogVisible: false,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      drawerVisible: false,
      mysqldb: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getMySQLDB(this.queryList).then(response => {
        this.list = response.results
        this.total = response.count
        this.getProjectList()
      })
    },
    getProjectList() {
      getProjects().then(response => {
        this.projectList = response
      })
    },
    restTemp() {
      this.temp = {
        name: '',
        project: '',
        username: '',
        pro_password: '',
        test_password: '',
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.restTemp()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.pro_password = decodeStr(this.temp.pro_password)
      this.temp.test_password = decodeStr(this.temp.test_password)
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.temp.project = row.project.id
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMySQLDB(id).then(() => {
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
      this.temp.pro_password = encodeStr(this.temp.pro_password)
      this.temp.test_password = encodeStr(this.temp.test_password)
      addMySQLDB(this.temp).then(response => {
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '包新增成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      this.temp.pro_password = encodeStr(this.temp.pro_password)
      this.temp.test_password = encodeStr(this.temp.test_password)
      updateMySQLDB(this.temp).then(() => {
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
    showDetail(row) {
      this.mysqldb = Object.assign({}, row)
      this.mysqldb.pro_password = decodeStr(this.mysqldb.pro_password)
      this.mysqldb.test_password = decodeStr(this.mysqldb.test_password)
      this.drawerVisible = true
    }
  }
}
</script>
