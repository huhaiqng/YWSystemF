<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <span class="right-menu-item">{{ userTemp.username }}</span>
        <el-dropdown class="right-menu-item">
          <div class="right-menu-item hover-effect el-dropdown-link" style="padding-right: 20px;">
            <svg-icon icon-class="user" />
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="handleChangeMyPassword">更改密码</el-dropdown-item>
            <el-dropdown-item @click.native="gotoAdmin">Django 管理</el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
      <el-form ref="userTemp" :model="userTemp" :rules="formRules" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input ref="old_password" v-model="userTemp.old_password" type="password" placeholder="******" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input ref="password" v-model="userTemp.password" type="password" placeholder="******" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input ref="confirm_password" v-model="userTemp.confirm_password" type="password" placeholder="******" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handelCancel('userTemp')">
          取消
        </el-button>
        <el-button type="primary" @click="updateData('userTemp')">
          确定
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { getUserName } from '@/utils/auth'
import { validPassword } from '@/utils/validate'
import { changeMyPassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!validPassword(value)) {
        callback(new Error('密码必须是6到12位，包含数字和大小写字母'))
      } else if (this.userTemp.old_password === value) {
        callback(new Error('新旧密码不能一样'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.userTemp.password) {
        callback(new Error('2次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      userTemp: {
        username: getUserName(),
        old_password: null,
        password: null,
        confirm_password: null
      },
      dialogVisible: false,
      formRules: {
        password: [{ trigger: 'blur', validator: validatePassword }],
        confirm_password: [{ trigger: 'blur', validator: validateConfirmPassword }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    gotoAdmin() {
      window.open(process.env.VUE_APP_ADMIN_URL, '_blank')
    },
    handleChangeMyPassword() {
      this.dialogVisible = true
      this.resetUserTemp()
    },
    handelCancel(form) {
      this.$refs[form].resetFields()
      this.dialogVisible = false
    },
    resetUserTemp() {
      this.userTemp = {
        username: getUserName(),
        old_password: null,
        password: null,
        confirm_password: null
      }
    },
    updateData(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          changeMyPassword(this.userTemp).then(() => {
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '密码修改完成！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
      console.log(this.userTemp)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
