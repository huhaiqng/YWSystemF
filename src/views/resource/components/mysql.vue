<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div v-for="db in mysqldbList" :key="db.id" style="padding-bottom: 40px;">
        数据库名: <span class="link-type" @click="showMySQLDBDetail(db)">{{ db.name }}</span>
        <el-button type="primary" size="mini" class="filter-item" icon="el-icon-edit" style="margin-left:40px" @click="handleCreate(db)">
          添加
        </el-button>
        <el-table :key="db.name" :data="db.project_mysql" border fit highlight-current-row>
          <el-table-column label="IP 地址" align="center">
            <template slot-scope="{row}">
              <span class="link-type" @click="handleHostInfo(row.host)">{{ row.host.ip }}</span>
            </template>
          </el-table-column>
          <el-table-column label="版本" align="center">
            <template slot-scope="{row}">
              <span>{{ row.version }}</span>
            </template>
          </el-table-column>
          <el-table-column label="端口号" align="center">
            <template slot-scope="{row}">
              <span>{{ row.port }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="{row}">
              <span>{{ row.role }}</span>
            </template>
          </el-table-column>
          <el-table-column label="数据目录" align="center" width="200px">
            <template slot-scope="{row}">
              <span>{{ row.data_dir }}</span>
            </template>
          </el-table-column>
          <el-table-column label="环境" align="center">
            <template slot-scope="{row}">
              <span>{{ row.env }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="{row}">
              <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
            <template slot-scope="{row, $index}">
              <el-dropdown type="primary">
                <el-button size="mini" split-buttion type="primary">操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
                  <el-dropdown-item @click.native="handleDelete(row.id, $index)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="服务器" prop="host">
          <el-select v-model="temp.host" style="width:60%">
            <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-select v-model="temp.version" style="width:60%">
            <el-option label="MySQL5.6" value="MySQL5.6" />
            <el-option label="MySQL5.7" value="MySQL5.7" />
            <el-option label="MySQL8.0" value="MySQL8.0" />
          </el-select>
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="temp.port" style="width:60%" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" style="width:60%">
            <el-option label="master" value="master" />
            <el-option label="slave" value="slave" />
          </el-select>
        </el-form-item>
        <el-form-item label="Root 密码" prop="root_password">
          <el-input v-model="temp.root_password" style="width:60%" />
        </el-form-item>
        <el-form-item label="数据目录" prop="data_dir">
          <el-input v-model="temp.data_dir" style="width:60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="hostDrawerVisible" :with-header="false">
      <host-drawer-content :host="hostTemp" />
    </el-drawer>
    <el-drawer title="详情" :visible.sync="mysqldbDrawerVisible" :with-header="false">
      <mysqldb :mysqldb="mysqldb" />
    </el-drawer>
  </div>
</template>
<script>
import { getHosts, getMySQLDB, addProjectMySQLDB, updateProjectMySQLDB, deleteProjectMySQLDB } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
import Mysqldb from '@/components/Drawer/mysqldb'
export default {
  components: { HostDrawerContent, Mysqldb },
  props: {
    env: { type: String, default: null },
    project: { type: String, default: null },
    software: { type: String, default: null }
  },
  data() {
    return {
      hostList: [],
      mysqldbList: [],
      dialogVisible: false,
      dialogStatus: 'create',
      textMap: {
        create: '添加',
        edit: '编辑'
      },
      temp: {
        mysqldb: '',
        env: this.env,
        host: '',
        version: 'MySQL5.7',
        port: 3306,
        role: 'master',
        root_password: '',
        data_dir: '/usr/local/mysql/data',
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
      mysqldb: '',
      mysqldbDrawerVisible: false,
      hostQuery: {
        ip: '',
        type: this.software,
        env: this.env,
        limit: 10000
      },
      mysqldbQuery: {
        name: '',
        project: this.project,
        limit: 10000
      }
    }
  },
  created() {
    this.getMysqldbList()
  },
  methods: {
    getMysqldbList() {
      getMySQLDB(this.mysqldbQuery).then(response => {
        this.mysqldbList = response
        for (var i = 0; i < response.length; i++) {
          var pms = response[i].project_mysql.filter(pj => pj.env === this.env)
          response[i].project_mysql = pms
        }
      })
    },
    resetTemp() {
      this.temp = {
        mysqldb: '',
        env: this.env,
        host: '',
        version: 'MySQL5.7',
        port: 3306,
        role: 'master',
        root_password: '',
        data_dir: '/usr/local/mysql/data',
        created: new Date()
      }
    },
    handleCreate(db) {
      this.dialogVisible = true
      this.resetTemp()
      this.temp.mysqldb = db.id
      this.dialogStatus = 'create'
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    createData() {
      addProjectMySQLDB(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '新增成功！',
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.getMysqldbList()
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
        this.temp = Object.assign({}, row)
        this.temp.host = row.host.id
      })
    },
    updateData() {
      updateProjectMySQLDB(this.temp).then(() => {
        this.getMysqldbList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleHostInfo(h) {
      this.hostTemp = Object.assign({}, h)
      this.hostTemp.password = decodeStr(this.hostTemp.password)
      this.hostDrawerVisible = true
    },
    handleDelete(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectMySQLDB(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.getMysqldbList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showMySQLDBDetail(db) {
      this.mysqldb = Object.assign({}, db)
      this.mysqldb.pro_password = decodeStr(this.mysqldb.pro_password)
      this.mysqldb.test_password = decodeStr(this.mysqldb.test_password)
      this.mysqldbDrawerVisible = true
    }
  }
}
</script>
