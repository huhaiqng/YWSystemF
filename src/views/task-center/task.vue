<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryList.name" placeholder="任务名" style="width:200px" class="filter-item" @keyup.enter.native="getList" />
      <el-select v-model="queryList.type" placeholder="类别" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in typeOptins" :key="item" :label="item" :value="item" />
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
      <el-table-column label="任务名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="脚本路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.script_dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="脚本名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.script_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arg }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
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
      <el-form ref="temp" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-form-item label="任务名" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
        <el-form-item label="脚本路径" prop="script_dir">
          <el-input v-model="temp.script_dir" style="width:60%" />
        </el-form-item>
        <el-form-item label="脚本名" prop="script_name">
          <el-input v-model="temp.script_name" style="width:60%" />
        </el-form-item>
        <el-form-item label="参数" prop="arg">
          <el-input v-model="temp.arg" style="width:60%" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" style="width:60%">
            <el-option v-for="item in typeOptins" :key="item" :label="item" :value="item" />
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
import { getTask, addTask, deleteTask, updateTask } from '@/api/task'
import Pagination from '@/components/Pagination'
export default {
  name: 'Task',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      temp: {
        name: 'aaa',
        script_dir: '/data/scripts',
        script_name: '',
        arg: '',
        type: '',
        created: new Date()
      },
      queryList: {
        name: '',
        type: '',
        page: 0,
        limit: 10
      },
      typeOptins: ['install', 'uninstall', 'check', 'control', 'update'],
      dialogStatus: 'create',
      dialogVisible: false,
      textMap: {
        create: '新增',
        edit: '编辑'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getTask(this.queryList).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    restTemp() {
      this.temp = {
        name: '',
        script_dir: '/data/scripts',
        script_name: '',
        arg: '',
        type: '',
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
      this.dialogStatus = 'edit'
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteTask(id).then(() => {
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
      addTask(this.temp).then(response => {
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
      updateTask(this.temp).then(() => {
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
