<template>
  <div class="login-container">
    <el-row type="flex" justify="center" class="login-form">
      <el-col :xs="22" :sm="12" :md="10" :lg="6" :xl="6">
        <el-card class="box-card">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form-body" auto-complete="on" label-position="left">

            <div class="title-container">
              <h3 class="title">登入</h3>
            </div>

            <el-form-item prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
            </el-form-item>

            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                auto-complete="on"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登入</el-button>

          <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin1</span>
        <span> password: any</span>
      </div> -->

          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" class="login-form" style="text-align: center;">
      <el-col :xs="22" :sm="12" :md="10" :lg="6" :xl="6">
        <p>
          <span>©2020  东莞市博晨塑料科技有限公司</span><br>
          <span>build v1.0.102</span>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (this.loginForm.username.trim() === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.trim() === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 2) {
        callback(new Error('请输入正确的密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
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
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#fff;
$light_gray:#333;
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#fff;
$dark_gray:#000;
$light_gray:#333;
.tips{
  text-align: right;
}
.login-container {
  height: 100%;
  width: 100%;
  background-color: rgb(140, 212, 233);
  .login-form{
    padding-top: 180px;
    right: 5%;
    margin-left: 10px;
  }
  .login-form-body{
    background: #fff;
  }
  .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .left {
    float: left;
  }
  .right{
    float: right;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
