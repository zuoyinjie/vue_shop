<template>
  <div class='login_container'>
    <div class='login_box'>

      <!-- 头像区域 -->
      <div class='avatar_box'>
        <img src="../assets/logo.png" alt="">
      </div>

      <!-- 表单区域 -->
      <el-form label-width="80px" class='form_box' :model="loginForm" :rules="loginRules" ref='loginFormRef'>
        <el-form-item label="" class='input_box' prop="username">
          <el-input prefix-icon='el-icon-user' placeholder="请输入用户名" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="" class='input_box' prop="password">
          <el-input prefix-icon='el-icon-lock' placeholder="请输入密码" v-model="loginForm.password" type='password'></el-input>
        </el-form-item>
        <el-form-item label="" class=' btn_box'>
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button @click='reset'>重置</el-button>
        </el-form-item>

      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      //   验证
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login: function () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败')
        }
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login_container {
  height: 100%;
  background-color: aquamarine;
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .avatar_box {
      height: 120px;
      width: 120px;
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        height: 100%;
        width: 100%;
        border: 1px solid #eee;
        border-radius: 50%;
      }
    }
    .form_box {
      position: absolute;
      top: 50%;
      transform: translate(-7%, -30%);
      .input_box {
        width: 430px;
      }
      .btn_box {
        display: flex;
        justify-content: end;
      }
    }
  }
}
</style>