<template>
  <!-- Giao diện theo Kiemke2026 (DMCL design kit: .auth-*) -->
  <div class="auth-shell">
    <div class="auth-card">
      <div class="auth-side">
        <div>
          <img class="auth-logo" :src="logo" alt="Điện Máy Chợ Lớn">
          <span class="portal-pill"><span class="dot" /> Cổng trả góp</span>
          <h2>Hệ thống trả góp<br>Điện Máy Chợ Lớn</h2>
          <p>
            Quản lý hồ sơ trả góp, theo dõi kết quả thẩm định và trao đổi dữ
            liệu với các nhà tài chính.
          </p>
          <div class="chips">
            <span>Tài chính</span><span>Thẩm định</span><span>Nhận đơn</span><span>Báo cáo</span>
          </div>
        </div>
        <div class="copyright">
          © {{ year }} Siêu thị Điện Máy — Nội Thất Chợ Lớn
        </div>
      </div>

      <div class="auth-form">
        <h1>Đăng nhập</h1>
        <p class="sub">Dùng tài khoản đã được cấp.</p>

        <form
          :class="{ is_loading: loading }"
          novalidate
          @submit.prevent="submitForm"
        >
          <div class="field" :class="{ 'has-error': errors.username }">
            <label for="username">Tài khoản</label>
            <input
              id="username"
              ref="username"
              v-model="ruleForm.username"
              type="text"
              autocomplete="username"
              name="username"
              class="form-control"
              @input="errors.username = ''"
            >
            <p v-if="errors.username" class="field-error">
              {{ errors.username }}
            </p>
          </div>

          <div class="field" :class="{ 'has-error': errors.password }">
            <label for="password">Mật khẩu</label>
            <div class="field-input">
              <input
                id="password"
                ref="password"
                v-model="ruleForm.password"
                :type="passwordType"
                name="password"
                autocomplete="current-password"
                class="form-control has-eye"
                @input="errors.password = ''"
              >
              <span
                class="show-pwd fa fa-fw"
                :class="passwordType === 'password' ? 'fa-eye' : 'fa-eye-slash'"
                :title="passwordType === 'password' ? 'Hiện mật khẩu' : 'Ẩn mật khẩu'"
                @click="showPwd"
              />
            </div>
            <p v-if="errors.password" class="field-error">
              {{ errors.password }}
            </p>
          </div>

          <div v-if="error" class="login-error">
            <i class="fa fa-exclamation-circle" /> {{ error }}
          </div>

          <button type="submit" class="btn-login" :disabled="loading">
            <span v-if="loading" class="btn-spinner" />
            <i v-else class="fa fa-sign-in-alt" aria-hidden="true" />
            {{ loading ? "Đang đăng nhập..." : "Đăng nhập" }}
          </button>
        </form>

        <p class="muted">Quên mật khẩu? Liên hệ quản trị viên hệ thống.</p>
      </div>
    </div>
  </div>
</template>
<script>
import { removeData } from '../../utils/auth'
import logo from '@/assets/logo.png'

export default {
  data() {
    return {
      logo,
      year: new Date().getFullYear(),
      passwordType: 'password',
      loading: false,
      error: '',
      errors: { username: '', password: '' },
      ruleForm: {
        username: '',
        password: ''
      }
    }
  },
  created() {
    removeData('Admin-Tabs-Ticket')
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    submitForm() {
      // Kiểm tra đủ tên đăng nhập + mật khẩu rồi mới gọi api
      this.errors.username = this.ruleForm.username.trim()
        ? ''
        : 'Tên đăng nhập không để trống'
      this.errors.password = this.ruleForm.password
        ? ''
        : 'Password không để trống'
      if (this.errors.username || this.errors.password) {
        this.error = ''
        return
      }

      this.loading = true
      this.error = ''
      const formData = new FormData()
      formData.append('username', this.ruleForm.username)
      formData.append('password', this.ruleForm.password)
      this.$store
        .dispatch('user/login', formData)
        .then((res) => {
          if (Number(res.status) === 200) {
            window.location.href = '/'
            return
          }
          this.showServerError(res)
          this.loading = false
        })
        .catch(() => {
          this.error = 'Đăng nhập không thành công!'
          this.loading = false
        })
    },
    // Lỗi từ api: { username: { isEmpty }, password: { isEmpty } } hoặc message
    showServerError(res) {
      const data = res.data || {}
      if (data.username && data.username.isEmpty) {
        this.errors.username = data.username.isEmpty
      }
      if (data.password && data.password.isEmpty) {
        this.errors.password = data.password.isEmpty
      }
      if (!this.errors.username && !this.errors.password) {
        this.error =
          (typeof data === 'string' && data) ||
          res.message ||
          'Đăng nhập không thành công!'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* Theo Kiemke2026 (layouts/Login.vue) — DMCL design kit .auth-* */
$brand: #2f6da4;
$brand-dark: mix(#000, $brand, 27%);
$brand-tint: mix($brand, #fff, 9%);
$ink: #181b1f;
$muted: #666e78;
$bg: #f4f5f7;
$border: #e3e6ea;
$danger: #c62828;

.auth-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 15% 10%, $brand-tint 0%, $bg 45%);
  color: $ink;
  font-family: "Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 14.5px;
  line-height: 1.55;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

.auth-card {
  width: 100%;
  max-width: 920px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(20, 20, 30, 0.04), 0 8px 20px rgba(20, 20, 30, 0.06);
  display: flex;
  overflow: hidden;
  border: 1px solid $border;
}

.auth-side {
  flex: 1;
  background: linear-gradient(160deg, $brand, $brand-dark);
  color: #fff;
  padding: 40px 34px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 260px;

  .auth-logo {
    display: block;
    height: 46px;
    width: auto;
    margin-bottom: 22px;
    border-radius: 9px;
    background: #fff;
    padding: 5px 11px;
  }

  .portal-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    padding: 4px 11px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 14px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  }

  h2 {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 10px;
    line-height: 1.35;
    color: #fff;
  }

  p {
    opacity: 0.92;
    font-size: 13.5px;
    margin: 0;
  }

  .chips {
    margin-top: 26px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    span {
      background: rgba(255, 255, 255, 0.18);
      border-radius: 999px;
      padding: 4px 11px;
      font-size: 12px;
    }
  }

  .copyright {
    margin-top: 26px;
    font-size: 11.5px;
    opacity: 0.85;
  }
}

.auth-form {
  flex: 1.15;
  padding: 40px 38px;
  min-width: 300px;

  h1 {
    font-size: 21px;
    font-weight: 600;
    margin: 0 0 4px;
    color: $ink;
  }

  .sub {
    color: $muted;
    font-size: 13.5px;
    margin: 0 0 22px;
  }

  .muted {
    color: $muted;
    font-size: 12.5px;
    margin: 20px 0 0;
  }
}

/* Form đang gửi: mờ nhẹ, chặn bấm lặp */
form.is_loading {
  opacity: 0.7;
}

.field {
  margin-bottom: 16px;

  > label {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: $muted;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    margin-bottom: 6px;
  }

  .field-input {
    position: relative;
  }

  .form-control {
    display: block;
    width: 100%;
    line-height: 1.55;
    padding: 10px 12px;
    border: 1px solid $border;
    border-radius: 9px;
    background: $bg;
    color: $ink;
    font-family: inherit;
    font-size: 14.5px;
    outline: none;
    box-shadow: none;
    transition: border-color 0.15s, background 0.15s;

    &:focus {
      border-color: $brand;
      background: #fff;
    }

    &.has-eye {
      padding-right: 40px;
    }
  }

  &.has-error .form-control {
    border-color: $danger;
  }

  .field-error {
    margin: 0;
    padding-top: 4px;
    font-size: 12px;
    color: $danger;
  }

  .show-pwd {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    font-size: 16px;
    color: $muted;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: $brand;
    }
  }
}

.login-error {
  margin-bottom: 16px;
  padding: 10px 12px;
  border: 1px solid mix($danger, #fff, 25%);
  border-radius: 9px;
  background: mix($danger, #fff, 6%);
  color: $danger;
  font-size: 13.5px;
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  border: none;
  border-radius: 9px;
  padding: 10px 18px;
  font-weight: 700;
  font-size: 13.6px;
  font-family: inherit;
  cursor: pointer;
  background: $brand;
  color: #fff;
  transition: transform 0.05s, background 0.15s;

  &:hover {
    background: $brand-dark;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: logout-spin 0.8s linear infinite;
}

@media (max-width: 900px) {
  .auth-card {
    flex-direction: column;
  }

  .auth-side {
    padding: 26px;
  }
}

@media (max-width: 480px) {
  .auth-shell {
    padding: 16px;
  }

  .auth-side,
  .auth-form {
    min-width: 0;
  }

  .auth-form {
    padding: 28px 22px;
  }
}
</style>
