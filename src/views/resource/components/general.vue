<template>
  <div class="app-container">
    <div class="filter-container">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding-bottom: 20px">
        <el-breadcrumb-item>{{ env }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ software }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleHostInfo(row.host)">{{ row.host.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" align="center">
        <template>
          <span>{{ project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center">
        <template slot-scope="{row}">
          <span>{{ row.host.env }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span v-if="row.host.status">正常</span>
          <span v-else>故障</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click.native="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新增" :visible.sync="dialogVisible">
      <el-form ref="formData" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="服务器" prop="host">
          <el-select v-model="temp.host" multiple placeholder="选择服务器" style="width:60%">
            <el-option v-for="item in hostList" :key="item.id" :label="item.ip" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">保存</el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="hostDrawerVisible" :with-header="false">
      <host-drawer-content :host="hostTemp" />
    </el-drawer>
  </div>
</template>
<script>
import { getHosts, getProjectGeneralSoftware, addProjectGeneralSoftware, deleteProjectGeneralSoftware } from '@/api/resource'
import { decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
export default {
  components: { HostDrawerContent },
  props: {
    env: { type: String, default: null },
    project: { type: Object, default: null },
    software: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      tableKey: 0,
      hostList: [],
      dialogVisible: false,
      temp: {
        env: this.env,
        project: this.project.id,
        software: this.software,
        host: null,
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
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getProjectGeneralSoftware(this.queryList).then(response => {
        this.list = response
      })
    },
    resetTemp() {
      this.temp = {
        env: this.env,
        project: this.project.id,
        software: this.software,
        host: null,
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      getHosts(this.hostQuery).then(response => {
        this.hostList = response
      })
    },
    createData() {
      addProjectGeneralSoftware(this.temp).then(() => {
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
    handleHostInfo(h) {
      this.hostTemp = Object.assign({}, h)
      this.hostTemp.password = decodeStr(this.hostTemp.password)
      this.hostDrawerVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProjectGeneralSoftware(id).then(() => {
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
    }
  }
}
</script>

