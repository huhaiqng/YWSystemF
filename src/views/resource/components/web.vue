<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="域名" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleWebInfo(row)">{{ row.domain }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <div v-for="h in row.host" :key="h.id"><span class="link-type" @click="handleHostInfo(h)">{{ h.ip }}</span></div>
        </template>
      </el-table-column>
      <el-table-column label="公网 IP" align="center">
        <template slot-scope="{row}">
          <span>{{ row.public_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="访问地址" align="center" width="240px">
        <template slot-scope="{row}">
          <span class="link-type"><a :href="row.url" target="blank">{{ row.url }}</a></span>
        </template>
      </el-table-column>
      <el-table-column label="用途" align="center">
        <template slot-scope="{row}">
          <span>{{ row.use }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安装路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.file_dir }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="域名" prop="domain">
          <el-input v-model="temp.domain" style="width:60%" placeholder="域名" />
        </el-form-item>
        <el-form-item label="服务器" prop="host">
          <el-select v-model="temp.host" multiple placeholder="选择服务器" style="width:60%">
            <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="外网 IP" prop="public_ip">
          <el-input v-model="temp.public_ip" style="width:60%" placeholder="外网 IP" />
        </el-form-item>
        <el-form-item label="访问地址" prop="url">
          <el-input v-model="temp.url" style="width:60%" placeholder="访问地址" />
        </el-form-item>
        <el-form-item label="用途" prop="use">
          <el-input v-model="temp.use" style="width:60%" placeholder="用途" />
        </el-form-item>
        <el-form-item label="安装路径" prop="dir">
          <el-input v-model="temp.dir" style="width:60%" placeholder="路径" />
        </el-form-item>
        <el-form-item label="文件路径" prop="dir">
          <el-input v-model="temp.file_dir" style="width:60%" placeholder="路径" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" style="width:60%" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" style="width:60%" placeholder="密码" />
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
    <el-drawer title="详情" :visible.sync="webDrawerVisible" :with-header="false">
      <web-drawer-content :web="webInfo" />
    </el-drawer>
  </div>
</template>
<script>
import { getHosts, addProjectWeb, updateProjectWeb, getProjectWeb, deleteProjectWeb } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
import WebDrawerContent from '@/components/Drawer/web'
export default {
  components: { HostDrawerContent, WebDrawerContent },
  props: {
    env: { type: String, default: null },
    project: { type: Object, default: null },
    software: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      tableKey: 0,
      listLoading: true,
      webInfo: undefined,
      hostList: [],
      dialogVisible: false,
      dialogStatus: 'create',
      textMap: {
        create: '添加',
        edit: '编辑'
      },
      temp: {
        host: [],
        public_ip: '',
        domain: '',
        url: '',
        env: this.env,
        project: this.project.id,
        software: this.software,
        use: '',
        dir: undefined,
        username: undefined,
        password: undefined,
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
      webDrawerVisible: false,
      queryList: {
        env: this.env,
        project: this.project.id,
        software: this.software
      },
      hostQuery: {
        ip: '',
        type: this.software,
        env: this.env,
        limit: 10000
      }
    }
  },
  computed: {
    domain() {
      return this.temp.domain
    }
  },
  watch: {
    domain() {
      this.temp.url = 'https://' + this.temp.domain
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectWeb(this.queryList).then(response => {
        this.list = response
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        host: [],
        public_ip: '',
        domain: '',
        url: '',
        env: this.env,
        project: this.project.id,
        software: this.software,
        use: '',
        dir: undefined,
        username: undefined,
        password: undefined,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      this.dialogStatus = 'create'
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    createData() {
      addProjectWeb(this.temp).then(() => {
        this.$notify({
          title: '成功',
          message: '新增成功！',
          type: 'success',
          duration: 2000
        })
        this.dialogVisible = false
        this.getList()
      })
    },
    handleUpdate(row) {
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
        this.temp = Object.assign({}, row)
        this.temp.host = row.host.map(h => { return h.id })
      })
    },
    updateData() {
      updateProjectWeb(this.temp).then(() => {
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
    handleHostInfo(h) {
      this.hostTemp = Object.assign({}, h)
      this.hostTemp.password = decodeStr(this.hostTemp.password)
      this.hostDrawerVisible = true
    },
    handleWebInfo(web) {
      this.webInfo = Object.assign({}, web)
      this.webDrawerVisible = true
    },
    handleDelete(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectWeb(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
