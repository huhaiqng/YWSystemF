<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.ip" placeholder="IP 地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="类别" clearable style="width: 150px" class="filter-item">
        <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-select v-model="listQuery.env" placeholder="环境" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in envOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="dialogUploadVisible=true">
        导入
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="60px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (listQuery.page - 1)*listQuery.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP 地址" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row)">{{ row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="系统版本" align="center">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" align="center">
        <template slot-scope="{row}">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" align="center">
        <template slot-scope="{row}">
          <span>{{ row.env }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span v-if="row.status">正常</span>
          <span v-else>故障</span>
        </template>
      </el-table-column>
      <el-table-column label="使用情况" align="center">
        <template slot-scope="{row}">
          <span v-if="row.ins_num===0">空闲</span>
          <span v-else>使用中</span>
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
              <el-dropdown-item @click.native="handleSSHConnectHost(row)">SSH 主机</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row.id, $index)">删除</el-dropdown-item>
              <el-dropdown-item v-if="row.status" @click.native="hostProblem(row, false)">标记故障</el-dropdown-item>
              <el-dropdown-item v-else @click.native="hostProblem(row, true)">恢复正常</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-form-item label="主机名" prop="name">
          <el-input v-model="temp.name" style="width:60%" placeholder="主机名" />
        </el-form-item>
        <el-form-item label="IP 地址" prop="ip">
          <el-input v-model="temp.ip" style="width:60%" placeholder="IP 地址" />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境" prop="env">
              <el-select v-model="temp.env" class="filter-item" placeholder="选择环境">
                <el-option v-for="item in envOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统版本" prop="version">
              <el-select v-model="temp.version" class="filter-item" placeholder="选择版本">
                <el-option v-for="item in versionOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="CPU 核数" prop="cpu">
              <el-select v-model="temp.cpu" class="filter-item" placeholder="选择核数">
                <el-option v-for="item in cpuOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="内存大小" prop="memory">
              <el-select v-model="temp.memory" class="filter-item" placeholder="选择内存大小">
                <el-option v-for="item in cpuOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="硬盘大小" prop="disk">
              <el-select v-model="temp.disk" class="filter-item" placeholder="选择硬盘大小">
                <el-option v-for="item in diskOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="position">
              <el-select v-model="temp.position" class="filter-item" placeholder="选择位置">
                <el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="系统管理员" prop="admin">
              <el-select v-model="temp.admin" class="filter-item" placeholder="选择系统管理员">
                <el-option v-for="item in adminOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类别" prop="type">
              <el-select v-model="temp.type" class="filter-item" placeholder="选择类别">
                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="管理员密码" prop="password">
          <el-input ref="password" v-model="temp.password" style="width:60%" :type="passwordType" placeholder="密码" />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogUploadVisible" title="导入" width="60%">
      <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
      <span><h3>导入成功数量：{{ uploadSuccessCount }} 导入失败数量：{{ uploadFailCount }}</h3></span>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="afterUpload">关闭</el-button>
      </div>
    </el-dialog>

    <el-drawer title="详情" :visible.sync="drawerVisible" :with-header="false">
      <host-drawer-content :host="temp" />
    </el-drawer>
  </div>
</template>

<script>
import { getHosts, addHost, updateHost, deleteHost, getSoftware } from '@/api/resource'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { encodeStr, decodeStr } from '@/utils/base64'
import HostDrawerContent from '@/components/Drawer/HostDrawerContent'
import { sshConnectHost } from '@/utils/webssh'

export default {
  name: 'ComplexTable',
  components: { Pagination, UploadExcelComponent, HostDrawerContent },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        ip: '',
        type: '',
        env: '',
        limit: 10
      },
      versionOptions: ['CentOS 6', 'CentOS 7', 'Windows Server 2008 R2'],
      cpuOptions: [4, 8, 16],
      memoryOptions: ['4G', '8G', '16G', '32G'],
      diskOptions: ['40G', '80G', '12G'],
      positionOptions: ['阿里云', '电信机房', '公司机房'],
      adminOptions: ['root', 'administrator'],
      typeOptions: '',
      envOptions: ['测试环境', '生产环境'],
      dialogUploadVisible: false,
      temp: {
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        detail: '详情'
      },
      downloadLoading: false,
      passwordType: 'password',
      drawerVisible: false,
      tableHeader: [],
      uploadSuccessCount: 0,
      uploadFailCount: 0
    }
  },
  created() {
    this.getList()
    getSoftware().then(response => {
      this.typeOptions = response
    })
  },
  methods: {
    getList() {
      getHosts(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
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
      }
      this.passwordType = 'password'
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = encodeStr(this.temp.password)
          addHost(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '主机新增成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.password = decodeStr(this.temp.password)
      this.dialogStatus = 'update'
      this.passwordType = 'password'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.password = encodeStr(this.temp.password)
          updateHost(this.temp).then(() => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    hostProblem(row, status) {
      row.status = status
      const tempData = Object.assign({}, row)
      updateHost(tempData).then(() => {
        const index = this.list.findIndex(v => v.id === tempData.id)
        this.list.splice(index, 1, tempData)
        this.$notify({
          title: '成功',
          message: '变更成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteHost(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          // this.list.splice(index, 1)
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['name', 'ip', 'version', 'cpu', 'memory', 'disk', 'position', 'admin', 'type', 'env', 'status']
        const filterVal = ['name', 'ip', 'version', 'cpu', 'memory', 'disk', 'position', 'admin', 'type', 'env', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    showDetail(row) {
      this.temp = Object.assign({}, row)
      this.temp.password = decodeStr(this.temp.password)
      this.drawerVisible = true
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.uploadSuccessCount = 0
      this.uploadFailCount = 0
      this.failTableData = []
      const tableData = results
      for (var i = 0; i < tableData.length; i++) {
        tableData[i].password = encodeStr(tableData[i].password)
        addHost(tableData[i]).then(() => {
          this.uploadSuccessCount += 1
        }).catch(() => {
          this.uploadFailCount += 1
        })
      }
      this.tableHeader = header
    },
    afterUpload() {
      this.dialogUploadVisible = false
      this.tableHeader = []
      this.tableData = []
      this.uploadSuccessCount = 0
      this.uploadFailCount = 0
      this.getList()
    },
    handleSSHConnectHost(row) {
      sshConnectHost(row)
    }
  }
}
</script>
