<template>
  <div>
    <div class="drawer-container">
      <div>
        <h3 class="drawer-title">详情</h3>
        <div class="drawer-item">
          <el-row>
            <el-col :span="12">数据库名：</el-col>
            <el-col :span="12">{{ sqlserver.name }}</el-col>
          </el-row>
        </div>

        <div class="drawer-item">
          <el-row>
            <el-col :span="12">地址：</el-col>
            <el-col :span="12">{{ sqlserver.addr }}</el-col>
          </el-row>
        </div>

        <div class="drawer-item">
          <el-row>
            <el-col :span="12">用户名：</el-col>
            <el-col :span="12">{{ sqlserver.username }}</el-col>
          </el-row>
        </div>

        <div class="drawer-item">
          <el-row>
            <el-col :span="12">密码：</el-col>
            <el-col :span="12">{{ sqlserver.password }}</el-col>
          </el-row>
        </div>

        <div class="drawer-item">
          <el-row>
            <el-col :span="12">来源：</el-col>
            <el-col :span="12">{{ sqlserver.origin }}</el-col>
          </el-row>
        </div>

        <div class="drawer-item">
          <el-row>
            <el-col :span="12">创建时间：</el-col>
            <el-col :span="12">{{ sqlserver.created | parseTime('{y}-{m}-{d} {h}:{m}') }}</el-col>
          </el-row>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sqlserver',
  props: {
    sqlserver: { type: Object, default: null }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.show-pwd {
  position: absolute;
  right: 41%;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.drawer-container {
  padding: 60px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }
}
</style>
