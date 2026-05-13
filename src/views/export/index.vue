<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="4">
        <el-select
          v-model="financier"
          placeholder="Chọn tài chính"
          clearable
          filterable
          :loading="loadingFinanciers"
          style="width: 100%"
          @visible-change="handleFinancierVisible"
        >
          <el-option
            v-for="item in financiers"
            :key="item.id"
            :label="item.shortName"
            :value="item.id"
          />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="12" :md="4">
        <el-date-picker
          v-model="dateStart"
          type="date"
          placeholder="Ngày bắt đầu"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :md="4">
        <el-date-picker
          v-model="dateEnd"
          type="date"
          placeholder="Ngày kết thúc"
          value-format="yyyy-MM-dd"
          style="width: 100%"
        />
      </el-col>

      <el-col :xs="24" :sm="12" :md="4">
        <el-select
          v-model="status"
          placeholder="Tình trạng"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="12" :md="4">
        <el-select
          v-model="site"
          placeholder="Chọn chi nhánh"
          clearable
          filterable
          :loading="loadingSites"
          style="width: 100%"
          @visible-change="handleSiteVisible"
        >
          <el-option
            v-for="item in sites"
            :key="item.sapCode || item.id"
            :label="item.name + ' - ' + item.sapCode"
            :value="item.sapCode || item.id"
          />
        </el-select>
      </el-col>

      <el-col :xs="24" :sm="12" :md="4">
        <el-button
          type="primary"
          icon="el-icon-download"
          :loading="exporting"
          style="width: 100%"
          @click="handleExport"
        >
          Export
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getPayments } from '@/api/payment'
import { getSites } from '@/api/store'
import { getUser } from '@/utils/auth'

export default {
  data() {
    return {
      financier: '',
      dateStart: '',
      dateEnd: '',
      status: '',
      site: '',

      financiers: [],
      sites: [],

      loadingFinanciers: false,
      loadingSites: false,
      exporting: false,

      financiersLoaded: false,
      sitesLoaded: false,

      statusOptions: [
        { value: 0, label: 'Chờ xử lý' },
        { value: 1, label: 'Hồ sơ đang xử lý' },
        { value: 2, label: 'Hồ sơ bị hủy/từ chối' },
        { value: 3, label: 'Hồ sơ đã ký' },
        { value: 4, label: 'Hồ sơ đã hoàn thành' }
      ]
    }
  },
  methods: {
    async handleFinancierVisible(visible) {
      if (!visible || this.financiersLoaded || this.loadingFinanciers) return
      this.loadingFinanciers = true
      try {
        const response = await getPayments()
        if (response.status === 200) {
          const res = await response.json()
          this.financiers = res.data || []
          this.financiersLoaded = true
        }
      } finally {
        this.loadingFinanciers = false
      }
    },
    async handleSiteVisible(visible) {
      if (!visible || this.sitesLoaded || this.loadingSites) return
      this.loadingSites = true
      try {
        const response = await getSites()
        if (response.status === 200) {
          const res = await response.json()
          this.sites = res.data || []
          this.sitesLoaded = true
        }
      } finally {
        this.loadingSites = false
      }
    },
    async handleExport() {
      const missing = []
      if (!this.financier) missing.push('tài chính')
      if (!this.dateStart) missing.push('ngày bắt đầu')
      if (!this.dateEnd) missing.push('ngày kết thúc')
      if (missing.length) {
        this.$message.warning('Vui lòng chọn: ' + missing.join(', '))
        return
      }
      if (this.dateStart > this.dateEnd) {
        this.$message.warning('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc')
        return
      }

      const user = getUser()
      if (!user) {
        this.$message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại')
        return
      }
      const tokenEntry = JSON.parse(user).find(
        (a) => a.split('=')[0] === 'token'
      )
      if (!tokenEntry) {
        this.$message.error('Không tìm thấy token')
        return
      }
      const token = tokenEntry.split('=')[1]

      this.exporting = true
      try {
        const params = new URLSearchParams({
          cid_type_payment: this.financier,
          date_cre: this.dateStart,
          date_end: this.dateEnd,
          approved: this.status === '' || this.status === null ? '' : this.status,
          cid_store: this.site || '',
          token
        })
        const url = `${process.env.VUE_APP_BASE_API}/order/exportorder?${params.toString()}`
        window.open(url, '_blank')
        this.$message.success('Đang xuất báo cáo...')
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>
