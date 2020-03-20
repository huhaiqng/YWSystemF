<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate()">
        添加
      </el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column label="域名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.domain }}</span>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getHosts, addProjectWeb, getProjectWeb, deleteProjectWeb } from '@/api/resource'
export default {
  props: {
    env: { type: String, default: null },
    project: { type: String, default: null },
    software: { type: String, default: null }
  },
  data() {
    return {
      list: [],
      tableKey: 0,
      listLoading: true,
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
        project: this.project,
        software: this.software,
        use: '',
        created: new Date()
      },
      queryList: {
        env: this.env,
        project: this.project,
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
      getProjectWeb(this.queryList).then(response => {
        this.list = response
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    resetTemp() {
      this.temp = {
        host: [],
        public_ip: '10.10.10.10',
        domain: 'www.abc.com',
        url: 'https://www.abc.com',
        env: this.env,
        project: this.project,
        software: this.software,
        use: 'xxx 访问地址',
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      this.dialogTitle = 'create'
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
        // this.dialogVisible = false
      })
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
    },
    updateData() {
      console.log(this.temp)
    }
  }
}
</script>
