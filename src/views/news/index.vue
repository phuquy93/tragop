<template>
  <div v-loading="loading" class="app-container">
    <el-button
      v-if="news != null"
      type="primary"
      icon="el-icon-plus"
      @click="handleAddRole(true)"
    >Thêm mới</el-button>

    <el-row :gutter="10" style="margin-top: 30px">
      <el-col :xs="12" :lg="4">
        <el-input v-model="name" placeholder="Nhập tên user" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="phone" placeholder="Số điện thoại" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="id_payment" placeholder="Id đối tác" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="id_app" placeholder="Id-app" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="shd" placeholder="Shd" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-select
          v-model="cid_type_payment"
          v-loading="loadingPayments"
          placeholder="Chọn tài chính"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in payments"
            :key="item.id"
            :value="item.id"
            :label="item.code"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="10" style="margin-top: 10px">
      <el-col :xs="12" :lg="4">
        <el-select
          v-model="approved"
          placeholder="Tình trạng"
          clearable
          style="width: 100%"
        >
          <el-option :value="0" label="Chờ xử lý" />
          <el-option :value="1" label="Hồ sơ đang xử lý" />
          <el-option :value="2" label="Hồ sơ bị hủy/từ chối" />
          <el-option :value="3" label="Hồ sơ đã ký" />
          <el-option :value="4" label="Hồ sơ đã hoàn thành" />
        </el-select>
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-date-picker
          v-model="date_cre"
          type="date"
          placeholder="Ngày bắt đầu"
        />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-date-picker
          v-model="date_end"
          type="date"
          placeholder="Ngày kết thúc"
        />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-select
          v-model="cid_store"
          v-loading="loadingStores"
          placeholder="Chọn chi nhánh"
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in sites"
            :key="item.sapCode"
            :value="item.sapCode"
            :label="item.name"
          />
        </el-select>
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-button
          type="primary"
          icon="el-icon-search"
          :loading="loading"
          :disabled="loading"
          @click="handleSearch"
        >
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table :data="news.data" style="width: 100%; margin-top: 30px" border>
      <el-table-column label="ID app">
        <template slot-scope="scope">
          {{ scope.row.id_app }}
        </template>
      </el-table-column>
      <el-table-column label="Tên">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Số điện thoại">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column label="Nhà tài chính">
        <template slot-scope="scope">
          <span v-if="payments.find((a) => a.id == scope.row.cid_type_payment)">
            {{ payments.find((a) => a.id == scope.row.cid_type_payment).code }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Chi nhánh">
        <template slot-scope="scope">
          <span v-if="sites.find((a) => a.sapCode == scope.row.cid_store)">
            {{ sites.find((a) => a.sapCode == scope.row.cid_store).name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Số hợp đồng">
        <template slot-scope="scope">
          {{ scope.row.sohopdong }}
        </template>
      </el-table-column>
      <el-table-column label="Ngày lên hồ sơ">
        <template slot-scope="scope">
          {{ scope.row.date_cre && scope.row.date_cre.date }}
        </template>
      </el-table-column>
      <el-table-column label="Tổng tiền">
        <template slot-scope="scope">
          {{
            String(scope.row.total_price)
              .toString()
              .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.")
          }}Đ
        </template>
      </el-table-column>
      <el-table-column label="Tình trạng">
        <template slot-scope="scope">
          <span
            v-if="scope.row.approved == 0"
            style="color: #03a9f4"
          >Chờ xử lý</span>
          <span
            v-if="scope.row.approved == 1"
            style="color: blue"
          >Hồ sơ đang xử lý</span>
          <span
            v-if="scope.row.approved == 2"
            style="color: green"
          >Hồ sơ bị hủy/từ chối
          </span>
          <span
            v-if="scope.row.approved == 3"
            style="color: #795548"
          >Hồ sơ đã ký</span>
          <span
            v-if="scope.row.approved == 4"
            style="color: red"
          >Hồ sơ đã hoàn thành</span>
        </template>
      </el-table-column>
      <el-table-column label="Tình trạng đối tác">
        <template slot-scope="scope">
          <span
            v-if="
              scope.row.flag_index &&
                scope.row.flag_index.is_send_api == 0
            "
            style="color: red"
          >Chưa gửi thành công</span>
          <span
            v-else-if="
              scope.row.flag_index &&
                scope.row.flag_index.is_send_api == 1
            "
            style="color: rgb(3, 169, 244)"
          >Gửi thành công</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tùy chọn" width="220">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit-outline"
            @click="handleEdit(scope.row)"
          >Sửa</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Popup -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title="statusPopup"
    >
      <Add
        :payments="payments"
        :stores="sites"
        :status-popup="statusPopup"
        @statusDialog="statusDialog"
      />
    </el-dialog>
    <el-dialog
      v-if="dialogVisible_edit"
      :visible.sync="dialogVisible_edit"
      :title="statusPopup"
    >
      <Edit
        :payments="payments"
        :stores="sites"
        :edit="edit"
        :status-popup="statusPopup"
        @statusDialog="statusDialog"
      />
    </el-dialog>

    <!-- Pagination -->
    <el-pagination
      :page-size="10"
      layout="total, prev, pager, next"
      :total="news.TotalItem"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import Add from './add.vue'
import Edit from './edit.vue'
import { getSites } from '@/api/store'
export default {
  components: { Add, Edit },
  data() {
    return {
      dialogVisible: false,
      dialogVisible_edit: false,

      statusPopup: '',

      name: '',

      phone: '',

      id_payment: '',

      id_app: '',

      shd: '',

      cid_type_payment: '',

      cid_store: '',

      approved: '',

      date_cre: '',

      date_end: '',

      lists: [],

      page: 1,

      edit: null,

      sites: [],
      loading: false,
      loadingPayments: false,
      loadingStores: false
    }
  },
  computed: {
    news() {
      const n = this.$store.state.new.news
      if (!n || Array.isArray(n)) {
        return { data: [], TotalItem: 0 }
      }
      let data = Array.isArray(n.data) ? n.data : []
      if (Array.isArray(data[0])) {
        data = data[0]
      }
      return { ...n, data }
    },
    is_loading() {
      return this.$store.state.new.is_loading
    },
    payments() {
      return this.$store.state.payment.payments
    }
  },
  async created() {
    this.loading = true
    try {
      await Promise.all([
        this.loadPayments(),
        this.loadSites(),
        this.fetchNews(this.page)
      ])
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatDate(d) {
      return d ? d.toLocaleString('sv-SE').split(' ')[0] : ''
    },
    buildParams(page) {
      return {
        page,
        name: this.name,
        phone: this.phone,
        id_payment: this.id_payment,
        id_app: this.id_app,
        shd: this.shd,
        cid_type_payment: this.cid_type_payment,
        cid_store: this.cid_store,
        approved: this.approved,
        date_cre: this.formatDate(this.date_cre),
        date_end: this.formatDate(this.date_end),
        limit: 10
      }
    },
    fetchNews(page) {
      return this.$store.dispatch('new/getNews', this.buildParams(page))
    },
    async loadPayments() {
      this.loadingPayments = true
      try {
        await this.$store.dispatch('payment/getPayments')
      } finally {
        this.loadingPayments = false
      }
    },
    async loadSites() {
      this.loadingStores = true
      try {
        const response = await getSites()
        if (response.status === 200) {
          const res = await response.json()
          this.sites = res.data || []
        }
      } finally {
        this.loadingStores = false
      }
    },
    handleAddRole(status) {
      this.edit = null
      this.dialogVisible = status
      this.statusPopup = 'Thêm mới'
    },
    handleEdit(data) {
      this.edit = Object.assign({}, data)
      this.dialogVisible_edit = true
      this.statusPopup = 'Sửa'
    },
    statusDialog(status) {
      this.dialogVisible = status
      this.dialogVisible_edit = status
    },
    async handleCurrentChange(e) {
      if (this.loading) return
      this.page = e
      this.loading = true
      try {
        await this.fetchNews(this.page)
      } finally {
        this.loading = false
      }
    },
    async handleSearch() {
      if (this.loading) return
      this.page = 1
      this.loading = true
      try {
        await this.fetchNews(1)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style>
.el-table .cell {
  max-height: none;
  display: block;
}
</style>
