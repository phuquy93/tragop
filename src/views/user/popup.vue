<template>
  <div>
    <el-form ref="role" :model="role" :rules="rules" label-position="left">
      <el-row :gutter="20">
        <el-col :xs="24" :lg="12">
          <el-form-item label="Tên" prop="name">
            <el-input v-model="role.name" placeholder="Nhập tên" class="name" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-form-item label="Tên đăng nhập" prop="username">
            <el-input
              v-model="role.username"
              placeholder="Nhập tên đăng nhập"
              class="username"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="statusPopup === 'Thêm mới'" :xs="24" :lg="12">
          <el-form-item label="Mật khẩu" prop="password">
            <el-input
              v-model="role.password"
              type="password"
              placeholder="Nhập mật khẩu"
              class="password"
            />
          </el-form-item>
        </el-col>
        <el-col v-else :xs="24" :lg="12">
          <el-form-item label="Mật khẩu" prop="passwordedit">
            <el-input
              v-model="role.passwordedit"
              type="password"
              placeholder="Nhập mật khẩu"
              class="passwordedit"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="statusPopup === 'Thêm mới'" :xs="24" :lg="12">
          <el-form-item label="Nhập lại mật khẩu" prop="password2">
            <el-input
              v-model="role.password2"
              type="password"
              autocomplete="off"
              class="password2"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-form-item label="Loại user" prop="rule">
            <el-select v-model="role.rule" class="rule">
              <el-option
                v-for="item in [
                  {
                    value: '1',
                    label: 'Admin',
                  },
                  {
                    value: '2',
                    label: 'Quản lý chi nhánh',
                  },
                  {
                    value: '3',
                    label: 'Tài chính',
                  },
                  {
                    value: '4',
                    label: 'Quản lý user tài chính',
                  },
                  {
                    value: '5',
                    label: 'Nhân viên bán hàng',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-form-item label="Trạng thái" prop="status">
            <el-select
              v-model="role.status"
              placeholder="Tùy chọn"
              class="status"
            >
              <el-option
                v-for="item in [
                  {
                    value: '0',
                    label: 'Ẩn',
                  },
                  {
                    value: '1',
                    label: 'Hiện',
                  },
                ]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-form-item label="Chi nhánh" prop="cid_store">
            <el-select
              v-model="role.cid_store"
              placeholder="Tùy chọn chi nhánh"
              clearable
              filterable
              style="width: 100%"
              :loading="loadingSites"
              @visible-change="handleSiteVisible"
            >
              <el-option
                v-for="item in sites"
                :key="item.sapCode || item.id"
                :label="item.name + ' - ' + item.sapCode"
                :value="item.sapCode || item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :lg="12">
          <el-form-item
            v-loading="is_loading_payment"
            label="Nhà tài chính"
            prop="cid_type_payment"
          >
            <el-select v-model="role.cid_type_payment">
              <el-option value="0" label="Tùy chọn" />
              <el-option
                v-for="rule in payments"
                :key="rule.id"
                :value="rule.id"
                :label="rule.name"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div style="text-align: right">
      <div style="display: flex; justify-content: space-between">
        <el-button
          type="success"
          icon="el-icon-check"
          :loading="is_loading"
          @click="submitForm('role')"
        >Xác nhận</el-button>

        <el-button
          icon="el-icon-close"
          :loading="is_loading"
          @click="statusDialogpopup(false)"
        >Đóng</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getSites } from '@/api/store'
export default {
  props: ['statusPopup', 'edit'],
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Vui lòng nhập lại password'))
      } else if (value !== this.role.password) {
        callback(new Error('Password nhập lại không đúng!'))
      } else {
        callback()
      }
    }
    return {
      role: {
        name: '',
        username: '',
        code: '',
        status: '1',
        rule: '1',
        password: '',
        password2: '',
        cid_store: '0',
        cid_type_payment: '0'
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Tên không để trống',
            trigger: 'blur'
          }
        ],
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
            message: 'Mật khẩu không để trống',
            trigger: 'blur'
          }
        ],
        password2: [{ validator: validatePass2, trigger: 'blur' }]
      },

      sites: [],
      loadingSites: false
    }
  },
  computed: {
    payments() {
      return this.$store.state.payment.payments
    },
    is_loading() {
      return this.$store.state.user.is_loading
    },
    is_loading_store() {
      return this.$store.state.store.is_loading
    },
    is_loading_payment() {
      return this.$store.state.payment.is_loading
    },
    stores() {
      return this.$store.state.store.stores
    }
  },
  created() {
    this.getsites()
    if (this.payments.length == 0) {
      this.$store
        .dispatch('payment/getPayments', {
          limit: 999
        })
        .then(() => {
          if (this.edit !== null) {
            this.role = this.edit
          }
        })
    } else {
      if (this.edit !== null) {
        this.role = this.edit
      }
    }
  },
  methods: {
    async getsites() {
      this.loadingSites = true
      try {
        const response = await getSites()
        if (response.status === 200) {
          const res = await response.json()
          this.sites = res.data || []
        }
      } finally {
        this.loadingSites = false
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const formData = new FormData()

          formData.append('name', this.role.name)
          formData.append('username', this.role.username)
          formData.append('rule', this.role.rule)
          formData.append('status', this.role.status)
          formData.append('cid_store', this.role.cid_store)
          formData.append('cid_type_payment', this.role.cid_type_payment)
          if (this.role.id) {
            if (this.role.passwordedit !== '') {
              formData.append('password', this.role.passwordedit)
            }
            formData.append('id', this.role.id)
          } else {
            this.page = 1
            formData.append('password', this.role.password)
            formData.append('password2', this.role.password2)
          }

          this.$store.dispatch('user/handleUser', formData).then((res) => {
            if (res.status == 200) {
              this.$emit('statusDialog', false)
              this.$refs['role'].resetFields()
              this.$store.dispatch('user/getUsers', {
                page: 1,
                name: '',
                status: '',
                limit: 10
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    statusDialogpopup(status) {
      this.$emit('statusDialog', status)
    }
  }
}
</script>
