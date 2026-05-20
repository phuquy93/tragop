<template>
  <div>
    <el-form ref="role" :model="role" :rules="rules" label-position="left">
      <el-container>
        <el-header><i class="el-icon-s-custom" /> Thông tin khách hàng</el-header>
        <el-main>
          <el-row :gutter="20">
            <el-col :xs="24" :lg="12">
              <el-form-item label="Tên" prop="name">
                <el-input
                  v-model="role.name"
                  placeholder="Nhập tên"
                  :disabled="disabled()"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Số điện thoại" prop="phone">
                <el-input
                  v-model="role.phone"
                  v-mask="'###-###-####'"
                  :disabled="disabled()"
                  placeholder="Nhập số điện thoại"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Nhà tài chính" prop="cid_type_payment">
                <el-select
                  v-model="role.cid_type_payment"
                  v-loading="is_loading_payment"
                  :disabled="disabled()"
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
                  :disabled="disabled()"
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
                  :disabled="disabled()"
                  type="datetime"
                  placeholder="Chọn ngày giờ giao hàng"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Giao hàng tại" prop="type_delivery">
                <el-select
                  v-model="role.type_delivery"
                  placeholder="Tùy chọn"
                  :disabled="disabled()"
                >
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
                <el-input
                  v-model="role.address"
                  placeholder="Địa chỉ"
                  :disabled="disabled()"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item label="Tỉnh/Thành phố" prop="cid_city">
                <el-select
                  v-model="role.cid_city"
                  v-loading="is_loading_district"
                  :disabled="disabled()"
                  placeholder="Chọn Tỉnh/Thành phố"
                  filterable
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
                  :disabled="disabled()"
                  placeholder="Chọn Quận/huyện"
                  filterable
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
                  :disabled="disabled()"
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
                  :disabled="disabled()"
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
                  :disabled="disabled()"
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
                  :disabled="disabled()"
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
              >
                <el-input
                  v-model="product.sap_code"
                  :disabled="disabled(1)"
                  placeholder="Nhập mã hàng"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Tên hàng"
                :prop="'products.' + index + '.name_product'"
              >
                <el-input
                  v-model="product.name_product"
                  :disabled="disabled(1)"
                  placeholder="Nhập tên hàng"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Loại hàng"
                :prop="'products.' + index + '.model'"
              >
                <el-input
                  v-model="product.model"
                  :disabled="disabled(1)"
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
                  :disabled="disabled(1)"
                  :min="1"
                  @change="changeTotalProduct($event, product)"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Giá"
                :prop="'products.' + index + '.price'"
                :class="{ disabled: disabled(1) }"
              >
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
                  :disabled="disabled(1)"
                  placeholder="Nhập phần trăm giảm"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                :class="{ disabled: disabled(1) }"
                label="Tổng tiền sản phẩm"
                :prop="'products.' + index + '.total_price_product'"
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
            <el-col v-if="!disabled(1)" :xs="24" :lg="24">
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
            <el-col v-if="!disabled(1)" :xs="24" :lg="24">
              <el-button
                style="width: 100%"
                type="primary"
                :loading="is_loading_product"
              >Add</el-button>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Tổng thành tiền"
                prop="total_price"
                :class="{ disabled: disabled(1) }"
              >
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
                  :disabled="disabled()"
                  placeholder="Nhập mã nhân viên tài chính"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Số tiền giảm giftcard" prop="discount_price">
                <el-input
                  v-model="role.discount_price"
                  :disabled="disabled()"
                  placeholder="Nhập số tiền giảm giftcard"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="24">
              <el-form-item label="Tên chương trình" prop="name_program">
                <el-input
                  v-model="role.name_program"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập tên chương trình"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Phí bảo hiểm"
                prop="insurance_fees"
                :class="{ disabled: disabledId(edit.cid_type_payment) }"
              >
                <money
                  v-model="role.insurance_fees"
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
                label="Phí hồ sơ"
                prop="application_fee"
                :class="{ disabled: disabledId(edit.cid_type_payment) }"
              >
                <money
                  v-model="role.application_fee"
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
              <el-form-item label="Kỳ hạn vay" prop="time_ins">
                <el-input
                  v-model="role.time_ins"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập kỳ hạn vay"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Lãi xuất" prop="interest_rate">
                <el-input
                  v-model="role.interest_rate"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập lãi xuất"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item
                label="Số tiền trả trước"
                prop="prepaid"
                :class="{ disabled: disabledId(edit.cid_type_payment) }"
              >
                <money
                  v-model="role.prepaid"
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
                label="Khoản vay"
                prop="loan"
                :class="{ disabled: disabledId(edit.cid_type_payment) }"
              >
                <money
                  v-model="role.loan"
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
              <el-form-item label="ID đối tác" prop="id_payment">
                <el-input
                  v-model="role.id_payment"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập id"
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :lg="12">
              <el-form-item label="Số hợp đồng" prop="sohopdong">
                <el-input
                  v-model="role.sohopdong"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập số hợp đồng"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :lg="12">
              <el-form-item label="Ghi chú" prop="note_payment">
                <el-input
                  v-model="role.note_payment"
                  :disabled="disabledId(edit.cid_type_payment)"
                  type="textarea"
                  rows="4"
                  placeholder="Nhập ghi chú"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showHsFields" :xs="24" :lg="12">
              <el-form-item label="Tên khách hàng trên hồ sơ" prop="name_hs">
                <el-input
                  v-model="role.name_hs"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập tên khách hàng trên hồ sơ"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showHsFields" :xs="24" :lg="12">
              <el-form-item
                label="Tên nhân viên làm HS"
                prop="name_employee_hs"
              >
                <el-input
                  v-model="role.name_employee_hs"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập tên nhân viên làm HS"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showHsFields" :xs="24" :lg="12">
              <el-form-item label="Địa chỉ trên hồ sơ" prop="address_hs">
                <el-input
                  v-model="role.address_hs"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập địa chỉ trên hồ sơ"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showHsFields" :xs="24" :lg="12">
              <el-form-item label="Số điện thoại trên hồ sơ" prop="phone_hs">
                <el-input
                  v-model="role.phone_hs"
                  :disabled="disabledId(edit.cid_type_payment)"
                  placeholder="Nhập số điện thoại trên hồ sơ"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="showHsFields" :xs="24" :lg="24">
              <el-form-item label="Upload PDF" prop="pdf_file">
                <el-upload
                  drag
                  action=""
                  :auto-upload="false"
                  :on-change="handlePdfChange"
                  :on-remove="handlePdfRemove"
                  :file-list="pdfFileList"
                  accept="application/pdf"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">
                    Drop file here or <em>click to upload</em>
                  </div>
                </el-upload>
              </el-form-item>
              <el-button
                type="primary"
                icon="el-icon-upload2"
                :loading="is_loading_pdf"
                :disabled="!role.pdf_file"
                @click="uploadPdf"
              >Upload</el-button>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </el-form>

    <div style="text-align: right">
      <div style="display: flex; justify-content: end">
        <!-- <el-button
          type="success"
          icon="el-icon-check"
          @click="submitForm('role')"
          :loading="is_loading"
          >Xác nhận</el-button
        > -->
        <el-button
          v-if="edit.flag_pdf && edit.flag_pdf.length > 0"
          type="danger"
          icon="el-icon-view"
          @click="pdfDialogVisible = true"
        >Xem file PDF</el-button>
        <el-button
          v-if="contract_available"
          type="primary"
          icon="el-icon-download"
          :loading="is_loading_contract"
          @click="downloadContract"
        >Download hợp đồng</el-button>
        <el-button
          icon="el-icon-close"
          :loading="is_loading"
          @click="statusDialogpopup(false)"
        >Đóng</el-button>
      </div>
    </div>

    <el-dialog
      title="PDF"
      :visible.sync="pdfDialogVisible"
      width="500px"
      append-to-body
    >
      <div>
        <div style="font-weight: bold; margin-bottom: 10px">Link</div>

        <div v-if="edit.flag_pdf && !!edit.flag_pdf.length">
          <div
            v-for="(pdf, idx) in edit.flag_pdf"
            :key="idx"
            class="box"
            style="margin-bottom: 8px"
          >
            <a
              :href="pdf.link"
              target="_blank"
              rel="noopener"
              style="color: #409eff; text-decoration: underline"
            >
              {{ pdf.file_name }}
            </a>
          </div>
        </div>
           <div v-else style="color: #909399">
          Chưa có file PDF
        </div>
      </div>
      <span slot="footer">
        <el-button
          icon="el-icon-close"
          @click="pdfDialogVisible = false"
        >Đóng</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadFileShdAdmin } from '@/api/new'

export default {
  props: ['payments', 'stores', 'edit', 'statusPopup'],
  data() {
    return {
      is_loading_product: false,
      is_loading_pdf: false,
      is_loading_contract: false,
      contract_available: false,
      pdfDialogVisible: false,

      pdfFileList: [],

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
        sohopdong: '',
        id_payment: '',

        name_hs: '',
        name_employee_hs: '',
        address_hs: '',
        phone_hs: '',
        pdf_file: null,

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
        ],

        // edit
        name_program: '',
        insurance_fees: 0,
        application_fee: 0,
        time_ins: 0,
        interest_rate: 0,
        note_payment: '',
        prepaid: 0,
        loan: 0
      },

      rules: {}
    }
  },
  // watch: {
  //   role: {
  //     handler(newVal, oldVal) {
  //       if (newVal.total_price - newVal.prepaid >= 0) {
  //         this.role.loan = newVal.total_price - newVal.prepaid;
  //       } else {
  //         this.role.prepaid = 0;
  //         this.$notify.error({
  //           title: "Error",
  //           message: "Số tiền không vượt quá tổng tiền",
  //         });
  //       }
  //     },
  //     deep: true,
  //   },
  // },
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
    },
    showHsFields() {
      const approved = Number(this.edit && this.edit.approved)
      return approved === 3 || approved === 4
    },
  },
  created() {
    this.role.products = []

    this.role.id = this.edit.id
    this.role.name = this.edit.name
    this.role.phone = this.edit.phone
    this.role.date_cre = this.edit.date_cre.date
    this.role.address = this.edit.orderaddress.address

    this.role.total_price = this.edit.total_price ?? 0
    this.role.type_delivery = this.edit.orderaddress.type_delivery
    this.role.date_delivery = this.edit.orderaddress.date_delivery.date
    this.role.note = this.edit.note
    this.role.warehouse_get = this.edit.warehouse_get
    this.role.warehouse_delivery = this.edit.warehouse_delivery
    this.role.cid_type_payment = this.edit.cid_type_payment
    this.role.sohopdong = this.edit.sohopdong
    this.role.id_payment =
      this.edit.orderpayment !== null
        ? this.edit.orderpayment.id_payment
        : this.edit.orderpayment

    if (this.edit.orderpayment) {
      this.role.name_hs = this.edit.orderpayment.name || ''
      this.role.name_employee_hs = this.edit.orderpayment.name_hs || ''
      this.role.address_hs = this.edit.orderpayment.address || ''
      this.role.phone_hs = this.edit.orderpayment.phone || ''
    }

    this.edit.orderproduct.forEach((e) => {
      this.role.products.push({
        id: e.id,
        sap_code: e.sap_code,
        model: e.model,
        name_product: e.name_product,
        quantity: e.quantity,
        total_or: e.price,
        price: e.price ?? 0,
        percent_discount: e.percent_discount,
        total_price_product: e.total_price_product ?? 0
      })
    })

    this.role.name_program = this.edit.name_program
    if (this.edit.insurance_fees !== null) { this.role.insurance_fees = this.edit.insurance_fees }
    if (this.edit.application_fee !== null) { this.role.application_fee = this.edit.application_fee }
    if (this.edit.time_ins !== null) this.role.time_ins = this.edit.time_ins

    this.role.interest_rate = this.edit.interest_rate
    this.role.note_payment = this.edit.note_payment
    if (this.edit.prepaid !== null) {
      this.role.prepaid = this.edit.prepaid
    }
    this.role.msnv = this.edit.orderpayment.msnv
    this.role.discount_price = this.edit.discount_price
    this.role.loan = this.edit.loan ?? 0

    this.role.cid_city = Number(this.edit.orderaddress.cid_city)
    this.role.cid_district = Number(this.edit.orderaddress.cid_district)
    this.role.cid_wards = Number(this.edit.orderaddress.cid_wards)

    this.checkContractAvailable()

    this.$store
      .dispatch('district/getDistricts', {
        provinceCode: '',
        districtCode: ''
      })
      .then((res) => {
        res.data.provinces.forEach((a) => {
          this.cid_city.push({
            value: a.code,
            label: a.name
          })
        })
        this.$store
          .dispatch('district/getDistricts', {
            provinceCode: this.role.cid_city,
            districtCode: ''
          })
          .then((res2) => {
            res2.data.districts.forEach((a) => {
              this.cid_district.push({
                value: a.code,
                label: a.name
              })
            })
            this.$store
              .dispatch('district/getDistricts', {
                provinceCode: this.role.cid_city,
                districtCode: this.role.cid_district
              })
              .then((res3) => {
                res3.data.wards.forEach((a) => {
                  this.cid_wards.push({
                    value: a.code,
                    label: a.name
                  })
                })
              })
          })
      })
  },
  methods: {
    disabled(number) {
      if (this.statusPopup == 'Sửa') {
        if (
          this.edit.flag_index !== null &&
          this.edit.flag_index.is_send_payment_success == 0 &&
          !number
        ) {
          return false
        }
        return true
      } else {
        return false
      }
    },
    disabledId(id) {
      if (this.statusPopup == 'Sửa') {
        if (
          this.edit.cid_type_payment !=
            '50afa56e-cc37-46f1-8c5a-9d65b8a4b643' &&
          !id
        ) {
          return false
        }
        return true
      } else {
        return false
      }
    },
    statusDialogpopup(status) {
      this.$emit('statusDialog', status)
    },
    handlePdfChange(file) {
      this.role.pdf_file = file.raw
      this.pdfFileList = [file]
    },
    handlePdfRemove() {
      this.role.pdf_file = null
      this.pdfFileList = []
    },
    checkContractAvailable() {
      const id = this.role.id_payment
      if (!id) {
        this.contract_available = false
        return
      }
      const url = process.env.VUE_APP_API + `/public/${id}.pdf`
      fetch(url, { method: 'GET' })
        .then((res) => {
          this.contract_available = res.ok
        })
        .catch(() => {
          this.contract_available = true
        })
    },
    downloadContract() {
      const id = this.role.id_payment
      if (!id) {
        this.$message({
          message: 'Lỗi: Không tìm thấy ID hợp đồng',
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
      const url = process.env.VUE_APP_API + `/public/${id}.pdf`
      window.open(url, '_blank')
    },
    uploadPdf() {
      this.is_loading_pdf = true
      const loadingInstance = this.$loading({
        lock: true,
        text: 'Đang upload file...',
        background: 'rgba(0, 0, 0, 0.5)'
      })
      const formData = new FormData()
      formData.append('id', this.role.id)
      formData.append('file', this.role.pdf_file)
      uploadFileShdAdmin(formData)
        .then((res) => {
          if (res && res.status == 200) {
            this.$message({
              message: res.message || 'Upload file thành công',
              type: 'success',
              duration: 5 * 1000
            })
            this.role.pdf_file = null
            this.pdfFileList = []
          } else {
            this.$message({
              message: (res && res.message) || JSON.stringify(res && res.data),
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
        .catch((error) => {
          this.$message({
            message: error.message || String(error),
            type: 'error',
            duration: 5 * 1000
          })
        })
        .finally(() => {
          this.is_loading_pdf = false
          loadingInstance.close()
        })
    }
    // submitForm(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.$confirm("Kiểm tra thông tin trước khi bấm ok").then(() => {
    //         const formData = new FormData();

    //         formData.append("id", this.role.id);
    //         formData.append("name_program", this.role.name_program);
    //         formData.append("insurance_fees", this.role.insurance_fees);
    //         formData.append("application_fee", this.role.application_fee);
    //         formData.append("time_ins", this.role.time_ins);
    //         formData.append("interest_rate", this.role.interest_rate);
    //         formData.append("note_payment", this.role.note_payment);
    //         formData.append("prepaid", this.role.prepaid);
    //         formData.append("loan", this.role.loan);

    //         formData.append("name", this.role.name);
    //         formData.append("phone", this.role.phone);
    //         formData.append(
    //           "date_cre",
    //           this.role.date_cre.toLocaleString("sv-SE")
    //         );
    //         formData.append(
    //           "username",
    //           this.user.find((a) => a.split("=")[0] == "username").split("=")[1]
    //         );
    //         formData.append(
    //           "name_user",
    //           this.user.find((a) => a.split("=")[0] == "name").split("=")[1]
    //         );
    //         formData.append("total_price", this.role.total_price);
    //         formData.append("note", this.role.note);
    //         formData.append("warehouse_get", this.role.warehouse_get);
    //         formData.append("warehouse_delivery", this.role.warehouse_delivery);
    //         formData.append("cid_type_payment", this.role.cid_type_payment);
    //         formData.append("msnv", this.role.msnv);
    //         formData.append("discount_price", this.role.discount_price);

    //         formData.append(
    //           "cid_store",
    //           this.user
    //             .find((a) => a.split("=")[0] == "code_store")
    //             .split("=")[1]
    //         );
    //         formData.append(
    //           "cid_user",
    //           this.user.find((a) => a.split("=")[0] == "dataid").split("=")[1]
    //         );
    //         formData.append("address", this.role.address);
    //         formData.append("cid_city", this.role.cid_city);
    //         formData.append("cid_district", this.role.cid_district);
    //         formData.append(
    //           "date_delivery",
    //           this.role.date_delivery.toLocaleString("sv-SE")
    //         );
    //         formData.append("type_delivery", this.role.type_delivery);
    //         formData.append("cid_wards", this.role.cid_wards);

    //         formData.append("id_payment", this.role.id_payment || "");
    //         formData.append("sohopdong", this.role.sohopdong || "");
    //         formData.append("name_hs", this.role.name_hs || "");
    //         formData.append(
    //           "name_employee_hs",
    //           this.role.name_employee_hs || ""
    //         );
    //         formData.append("address_hs", this.role.address_hs || "");
    //         formData.append("phone_hs", this.role.phone_hs || "");
    //         this.role.products.forEach((a) => {
    //           formData.append("sap_code[]", a.sap_code);
    //           formData.append("name_product[]", a.name_product);
    //           formData.append("quantity[]", a.quantity);
    //           formData.append("price[]", a.price);
    //           formData.append("percent_discount[]", a.percent_discount);
    //           formData.append("model[]", a.model);
    //           formData.append("total_price_product[]", a.total_price_product);
    //         });
    //         formData.append(
    //           "total_product",
    //           this.role.products.reduce((n, { quantity }) => n + quantity, 0)
    //         );

    //         this.$store.dispatch("new/handleNew", formData).then((res) => {
    //           if (res.status == 200) {
    //             this.$emit("statusDialog", false);
    //             this.$refs["role"].resetFields();
    //             this.$store.dispatch("new/getNews", {
    //               page: 1,
    //               name: "",
    //               limit: 10,
    //             });
    //           }
    //         });
    //       });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
  }
}
</script>

<style scoped>
.disabled input {
  background-color: #f5f7fa;
  border-color: #dfe4ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>
