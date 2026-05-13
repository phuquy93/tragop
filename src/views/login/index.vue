<template>
  <div class="login-container">
    <div class="login-image">
      <img src="./logologin.png" alt="login backgound">
    </div>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="login-form">
      <p>
        <img src="/static/img/logo.png" alt="logo" style="width: 250px">
      </p>
      <div class="title-container">
        <h3 class="title">Đăng nhập hệ thống</h3>
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="ruleForm.username"
          placeholder="Username"
          name="username"
        />
        <span
          v-if="error != null && error.username && error.username.isEmpty"
          class="error"
        >{{ error.username.isEmpty }}</span>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          ref="password"
          v-model="ruleForm.password"
          autocomplete="off"
          name="password"
          placeholder="Password"
          :type="passwordType"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span>
        <span
          v-if="error != null && error.password && error.password.isEmpty"
          class="error"
        >{{ error.password.isEmpty }}</span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="submitForm('ruleForm')"
        >Đăng nhập</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { removeData } from '../../utils/auth'
export default {
  data() {
    return {
      passwordType: 'password',
      loading: false,
      error: null,
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: 'Tên đăng nhập không để trống',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: 'Password không để trống',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    removeData('Admin-Tabs-Ticket')
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const formData = new FormData()
          formData.append('username', this.ruleForm.username)
          formData.append('password', this.ruleForm.password)
          this.$store
            .dispatch('user/login', formData)
            .then((res) => {
              if (Number(res.status) === 200) {
                window.location.href = '/'
              } else {
                this.error = res.data
              }
              this.loading = false
            })
            .catch(() => {
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
