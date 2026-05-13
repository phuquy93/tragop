<template>
  <div>
    <el-form ref="role" :model="role" :rules="rules" label-position="left">
      <el-container>
        <el-header><i class="el-icon-s-custom" /> Thông tin khách hàng</el-header>
        <el-main>
          <el-row :gutter="20">
            <el-col :xs="24" :lg="12">
              <el-form-item label="Tên" prop="name">
                <el-input v-model="role.name" placeholder="Nhập tên" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Số điện thoại" prop="phone">
                <el-input
                  v-model="role.phone"
                  v-mask="'###-###-####'"
                  placeholder="Nhập số điện thoại"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Nhà tài chính" prop="cid_type_payment">
                <el-select
                  v-model="role.cid_type_payment"
                  v-loading="is_loading_payment"
                  placeholder="Chọn tài chính"
                  filterable
                >
                  <el-option
                    v-for="rule in payments"
                    :key="rule.id"
                    :value="rule.id"
                    :label="rule.code"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Ngày lên hồ sơ" prop="date_cre">
                <el-date-picker
                  v-model="role.date_cre"
                  type="date"
                  placeholder="Ngày sinh"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :xs="24" :lg="12">
              <el-form-item label="CMND/CCCD" prop="cmnd">
                <el-input
                  v-model="role.cmnd"
                  placeholder="Nhập CMND/CCCD"
                  v-mask="'###-###-###-###'"
                />
              </el-form-item>
            </el-col> -->
            <el-col :xs="24" :lg="12">
              <el-form-item label="Ngày giờ giao hàng" prop="date_delivery">
                <el-date-picker
                  v-model="role.date_delivery"
                  type="datetime"
                  placeholder="Chọn ngày giờ giao hàng"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Giao hàng tại" prop="type_delivery">
                <el-select v-model="role.type_delivery" placeholder="Tùy chọn">
                  <el-option
                    v-for="item in [
                      {
                        value: '1',
                        label: 'Quầy',
                      },
                      {
                        value: '2',
                        label: 'Tại nhà',
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
              <el-form-item label="Địa chỉ" prop="address">
                <el-input v-model="role.address" placeholder="Địa chỉ" />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item label="Tỉnh/Thành phố" prop="cid_city">
                <el-select
                  v-model="role.cid_city"
                  v-loading="is_loading_district"
                  placeholder="Chọn Tỉnh/Thành phố"
                  filterable
                  @change="handleCity"
                >
                  <el-option
                    v-for="rule in cid_city"
                    :key="rule.value"
                    :value="rule.value"
                    :label="rule.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Quận/huyện" prop="cid_district">
                <el-select
                  v-model="role.cid_district"
                  v-loading="is_loading_district"
                  placeholder="Chọn Quận/huyện"
                  filterable
                  @change="handleDis"
                >
                  <el-option
                    v-for="rule in cid_district"
                    :key="rule.value"
                    :value="rule.value"
                    :label="rule.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Phường/xã" prop="cid_wards">
                <el-select
                  v-model="role.cid_wards"
                  v-loading="is_loading_district"
                  placeholder="Chọn Phường/xã"
                  filterable
                >
                  <el-option
                    v-for="rule in cid_wards"
                    :key="rule.value"
                    :value="rule.value"
                    :label="rule.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Kho lấy hàng" prop="warehouse_get">
                <el-select
                  v-model="role.warehouse_get"
                  v-loading="is_loading_store"
                  placeholder="Chọn kho"
                  filterable
                >
                  <el-option
                    v-for="rule in stores.data"
                    :key="rule.sapCode"
                    :value="rule.sapCode"
                    :label="rule.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Kho giao hàng" prop="warehouse_delivery">
                <el-select
                  v-model="role.warehouse_delivery"
                  v-loading="is_loading_store"
                  placeholder="Chọn kho"
                  filterable
                >
                  <el-option
                    v-for="rule in stores.data"
                    :key="rule.sapCode"
                    :value="rule.sapCode"
                    :label="rule.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Ghi chú" prop="note">
                <el-input
                  v-model="role.note"
                  type="textarea"
                  :rows="4"
                  placeholder="Nhập ghi chú"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-container>
        <el-header><i class="el-icon-goods" /> Thông tin sản phẩm</el-header>
        <el-main>
          <el-row
            v-for="(product, index) in role.products"
            :key="product.id"
            style="
              border: 1px solid #999;
              padding-bottom: 20px;
              margin-bottom: 20px;
            "
            :gutter="20"
          >
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Mã hàng"
                :prop="'products.' + index + '.sap_code'"
                :rules="{
                  required: true,
                  message: 'Mã hàng không để trống',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="product.sap_code"
                  placeholder="Nhập mã hàng"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Tên hàng"
                :prop="'products.' + index + '.name_product'"
                :rules="{
                  required: true,
                  message: 'Tên hàng không để trống',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="product.name_product"
                  placeholder="Nhập tên hàng"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Loại hàng"
                :prop="'products.' + index + '.model'"
                :rules="{
                  required: true,
                  message: 'Loại hàng không để trống',
                  trigger: 'blur',
                }"
              >
                <el-input
                  v-model="product.model"
                  placeholder="Nhập loại hàng"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Số lượng sản phẩm"
                :prop="'products.' + index + '.quantity'"
              >
                <el-input-number
                  v-model="product.quantity"
                  :min="1"
                  @change="changeTotalProduct($event, product)"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Giá" :prop="'products.' + index + '.price'">
                <money
                  v-model="product.price"
                  v-bind="{
                    decimal: '.',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false,
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Phần trăm giảm"
                :prop="'products.' + index + '.percent_discount'"
              >
                <el-input
                  v-model="product.percent_discount"
                  placeholder="Nhập phần trăm giảm"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Tổng tiền sản phẩm"
                :prop="'products.' + index + '.total_price_product '"
              >
                <money
                  v-model="product.total_price_product"
                  v-bind="{
                    decimal: '.',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false,
                  }"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="24">
              <el-button
                type="warning"
                :loading="is_loading_product"
                round
                @click="loadProduct(product.sap_code)"
              >Load</el-button>
              <el-button
                v-if="role.products.length > 1"
                type="danger"
                round
                :loading="is_loading_product"
                @click="deleteProduct(product.id)"
              >Xóa</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :lg="24">
              <el-button
                style="width: 100%"
                type="primary"
                :loading="is_loading_product"
                @click="addProduct"
              >Add</el-button>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Tổng thành tiền" prop="total_price">
                <money
                  v-model="role.total_price"
                  v-bind="{
                    decimal: '.',
                    thousands: '.',
                    prefix: '',
                    suffix: '',
                    precision: 0,
                    masked: false,
                  }"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-container>
        <el-header><i class="el-icon-s-data" /> Thông tin khác</el-header>
        <el-main>
          <el-row
            :gutter="20"
            style="
              border: 1px solid #999;
              padding-bottom: 20px;
              margin-bottom: 20px;
            "
          >
            <el-col :xs="24" :lg="12">
              <el-form-item label="Mã nhân viên tài chính" prop="msnv">
                <el-input
                  v-model="role.msnv"
                  placeholder="Nhập mã nhân viên tài chính"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Số tiền giảm giftcard" prop="discount_price">
                <el-input
                  v-model="role.discount_price"
                  placeholder="Nhập số tiền giảm giftcard"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
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
import { Message } from 'element-ui'

export default {
  props: ['payments', 'stores', 'statusPopup'],
  data() {
    return {
      is_loading_product: false,

      cid_city: [],
      cid_district: [],
      cid_wards: [],

      role: {
        name: '',
        phone: '',
        date_cre: new Date(),
        address: '',
        // cmnd: "",
        cid_city: '',
        cid_district: '',
        cid_wards: '',
        total_price: '',
        type_delivery: '',
        date_delivery: '',
        note: '',
        warehouse_get: '',
        warehouse_delivery: '',
        cid_type_payment: '',
        msnv: '',
        discount_price: '',

        products: [
          {
            id: new Date().getTime(),
            sap_code: '',
            model: '',
            name_product: '',
            quantity: 1,
            total_or: '',
            price: '',
            percent_discount: 0,
            total_price_product: 0
          }
        ]
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Tên không để trống',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: 'Tên không để trống',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: 'Số điện thoại không để trống',
            trigger: 'blur'
          }
        ],
        birthday: [
          {
            type: 'date',
            required: true,
            message: 'Ngày sinh không để trống',
            trigger: 'change'
          }
        ],
        address: [
          {
            required: true,
            message: 'Địa chỉ không để trống',
            trigger: 'blur'
          }
        ],
        // cmnd: [
        //   {
        //     required: true,
        //     message: "Cmnd không để trống",
        //     trigger: "blur",
        //   },
        // ],
        cid_city: [
          {
            required: true,
            message: 'Chọn tỉnh/thành',
            trigger: 'change'
          }
        ],
        warehouse_get: [
          {
            required: true,
            message: 'Chọn kho',
            trigger: 'change'
          }
        ],
        warehouse_delivery: [
          {
            required: true,
            message: 'Chọn kho',
            trigger: 'change'
          }
        ],
        type_delivery: [
          {
            required: true,
            message: 'Chọn hình thức giao hàng',
            trigger: 'change'
          }
        ],
        cid_district: [
          {
            required: true,
            message: 'Chọn quận/huyện',
            trigger: 'change'
          }
        ],
        cid_wards: [
          {
            required: true,
            message: 'Chọn phường/xã',
            trigger: 'change'
          }
        ],
        cid_type_payment: [
          {
            required: true,
            message: 'Chọn tài chính',
            trigger: 'change'
          }
        ],
        total_price: [
          {
            required: true,
            message: 'Tổng thành tiền không để trống',
            trigger: 'blur'
          }
        ],
        date_delivery: [
          {
            required: true,
            message: 'Chọn ngày giờ giao hàng',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    is_loading_payment() {
      return this.$store.state.payment.is_loading
    },
    is_loading_store() {
      return this.$store.state.store.is_loading
    },
    is_loading_district() {
      return this.$store.state.district.is_loading
    },
    is_loading() {
      return this.$store.state.new.is_loading
    },
    districts() {
      const value = this.stores.filter(
        (o) => o.cid_parent == this.role.cid_city && o.status == 1
      )
      if (value.length > 0) {
        this.role.cid_district = value[0].id
      }
      return value
    },
    user() {
      return this.$store.state.user.user
    }
  },
  watch: {
    role: {
      handler(newVal, oldVal) {
        let sum = 0

        newVal.products.forEach((a, i) => {
          sum = sum + Number(a.total_or)
          this.role.products[i].total_price_product =
            Number(this.role.products[i].price) *
            Number(this.role.products[i].quantity)
        })
        this.role.total_price = sum
      },
      deep: true
    }
  },
  created() {
    const param = {
      provinceCode: this.role.cid_city,
      districtCode: this.role.cid_district
    }

    this.$store.dispatch('district/getDistricts', param).then((res) => {
      res.data.provinces.forEach((a) => {
        this.cid_city.push({
          value: a.code,
          label: a.name
        })
      })
    })
  },
  methods: {
    addProduct() {
      this.role.products.push({
        id: new Date().getTime(),
        sap_code: '',
        model: '',
        name_product: '',
        quantity: 1,
        total_or: '',
        price: '',
        percent_discount: 0,
        cid_type_payment: '',
        total_price_product: 0
      })
    },
    deleteProduct(id) {
      this.role.products = this.role.products.filter((a) => a.id !== id)
    },
    statusDialogpopup(status) {
      this.$emit('statusDialog', status)
    },
    async loadProduct(code) {
      if (code === '') {
        Message({
          message: 'Vui lòng nhập mã hàng!!',
          type: 'error',
          duration: 5 * 1000
        })
        return false
      }
      this.is_loading_product = true
      const response = await fetch(
        'https://dienmaycholon.vn/api/product/portaltragopsanphamtheosapcode?sapcode=' +
          code
      )
      const product = await response.json()
      if (product.status == 200 && product.data.id) {
        const index = this.role.products.findIndex((a) => a.sap_code == code)
        this.role.products[index].model = product.data.cate_name
        this.role.products[index].name_product = product.data.name
        this.role.products[index].total_or = product.data.price
        this.role.products[index].quantity = 1
        this.role.products[index].price = product.data.price
      }
      this.is_loading_product = false
    },
    changeTotalProduct(e, product) {
      const index = this.role.products.findIndex((a) => a.id == product.id)
      this.role.products[index].total_or =
        Number(this.role.products[index].price) * e
    },
    handleCity() {
      this.$store
        .dispatch('district/getDistricts', {
          provinceCode: this.role.cid_city,
          districtCode: ''
        })
        .then((res) => {
          this.role.cid_district = ''
          this.role.cid_wards = ''
          this.cid_district = []
          this.cid_wards = []
          res.data.districts.forEach((a) => {
            this.cid_district.push({
              value: a.code,
              label: a.name
            })
          })
        })
    },
    handleDis() {
      this.$store
        .dispatch('district/getDistricts', {
          provinceCode: this.role.cid_city,
          districtCode: this.role.cid_district
        })
        .then((res) => {
          this.role.cid_wards = ''
          this.cid_wards = []
          res.data.wards.forEach((a) => {
            this.cid_wards.push({
              value: a.code,
              label: a.name
            })
          })
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('Kiểm tra thông tin trước khi bấm ok').then(() => {
            const formData = new FormData()

            formData.append('name', this.role.name)
            formData.append('phone', this.role.phone)
            formData.append(
              'date_cre',
              this.role.date_cre.toLocaleString('sv-SE')
            )
            formData.append(
              'username',
              this.user.find((a) => a.split('=')[0] == 'username').split('=')[1]
            )
            formData.append(
              'name_user',
              this.user.find((a) => a.split('=')[0] == 'name').split('=')[1]
            )
            formData.append('total_price', this.role.total_price)
            formData.append('note', this.role.note)
            formData.append('warehouse_get', this.role.warehouse_get)
            formData.append('warehouse_delivery', this.role.warehouse_delivery)
            formData.append('cid_type_payment', this.role.cid_type_payment)
            formData.append('msnv', this.role.msnv)
            formData.append('discount_price', this.role.discount_price)

            formData.append(
              'cid_store',
              this.user
                .find((a) => a.split('=')[0] == 'code_store')
                .split('=')[1]
            )
            formData.append(
              'cid_user',
              this.user.find((a) => a.split('=')[0] == 'dataid').split('=')[1]
            )
            formData.append('address', this.role.address)
            formData.append('cid_city', this.role.cid_city)
            formData.append('cid_district', this.role.cid_district)
            formData.append(
              'date_delivery',
              this.role.date_delivery.toLocaleString('sv-SE')
            )
            formData.append('type_delivery', this.role.type_delivery)
            formData.append('cid_wards', this.role.cid_wards)
            this.role.products.forEach((a) => {
              formData.append('sap_code[]', a.sap_code)
              formData.append('name_product[]', a.name_product)
              formData.append('quantity[]', a.quantity)
              formData.append('price[]', a.price)
              formData.append('percent_discount[]', a.percent_discount)
              formData.append('model[]', a.model)
              formData.append('total_price_product[]', a.total_price_product)
            })
            formData.append(
              'total_product',
              this.role.products.reduce((n, { quantity }) => n + quantity, 0)
            )

            this.$store.dispatch('new/handleNew', formData).then((res) => {
              if (res.status == 200) {
                this.$emit('statusDialog', false)
                this.$refs['role'].resetFields()
                this.$store.dispatch('new/getNews', {
                  page: 1,
                  name: '',
                  limit: 10
                })
              }
            })
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

