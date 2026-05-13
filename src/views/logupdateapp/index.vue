<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :xs="12" :lg="4">
        <el-input v-model="id_payment" placeholder="Id đối tác" clearable />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="id_app" placeholder="Id app" clearable />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-input v-model="id_order" placeholder="Id đơn hàng" clearable />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-select
          v-model="error"
          placeholder="Tình trạng"
          clearable
          style="width: 100%"
        >
          <el-option label="Thành công" :value="0" />
          <el-option label="Lỗi đối tác" :value="1" />
          <el-option label="Lỗi serve" :value="2" />
        </el-select>
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="is_loading"
      :data="rows"
      style="width: 100%; margin-top: 20px"
      border
    >
      <el-table-column label="Id" prop="_id" width="240">
        <template slot-scope="scope">
          {{ scope.row._id || scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Content">
        <template slot-scope="scope">
          <span class="content-cell">{{ formatContent(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Error" width="140">
        <template slot-scope="scope">
          {{ scope.row.error }}
        </template>
      </el-table-column>
      <el-table-column label="Http code" width="120">
        <template slot-scope="scope">
          {{
            scope.row.http_code || scope.row.httpCode || scope.row.status_code
          }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tùy chọn" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleDetail(scope.row)"
          >
            Chi tiết
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="logs.TotalItem || logs.totalItem || logs.Totalpage || 0"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="Chi tiết"
      width="60%"
    >
      <div class="detail-grid">
        <div v-for="f in detailFields" :key="f.key" class="detail-item">
          <span class="detail-label">{{ f.label }}:</span>
          <span class="detail-value">{{ formatValue(detail[f.key]) }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'

export default {
  data() {
    return {
      id_payment: '',
      id_app: '',
      id_order: '',
      error: '',
      page: 1,
      dialogVisible: false,
      detail: null,
      is_loading: false,
      logs: { data: [], TotalItem: 0 },
      detailFields: [
        { key: 'id', label: 'ID' },
        { key: 'content', label: 'Content' },
        { key: 'data_error', label: 'Data_error' },
        { key: 'action', label: 'Action' },
        { key: 'error', label: 'Error' },
        { key: 'cid_order', label: 'Cid_order' },
        { key: 'cid_type_payment', label: 'Cid_type_payment' },
        { key: 'id_payment', label: 'Id_payment' },
        { key: 'approved', label: 'Approved' },
        { key: 'flag_index', label: 'Flag_index' },
        { key: 'flag_content', label: 'Flag_content' },
        { key: 'created_at', label: 'Created_at' },
        { key: 'updated_at', label: 'Updated_at' }
      ]
    }
  },
  computed: {
    rows() {
      const d = this.logs && this.logs.data
      if (!Array.isArray(d)) return []
      if (d.length > 0 && Array.isArray(d[0])) return d[0]
      return d
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getToken() {
      const user = getUser()
      if (!user) return ''
      try {
        const entry = JSON.parse(user).find((a) => a.split('=')[0] === 'token')
        return entry ? entry.split('=')[1] : ''
      } catch (e) {
        return ''
      }
    },
    async fetchData() {
      this.is_loading = true
      try {
        const params = new URLSearchParams({
          page: this.page,
          token: this.getToken()
        })
        if (this.id_payment !== '' && this.id_payment != null) { params.append('id_payment', this.id_payment) }
        if (this.id_app !== '' && this.id_app != null) { params.append('id_app', this.id_app) }
        if (this.id_order !== '' && this.id_order != null) { params.append('cid_order', this.id_order) }
        if (this.error !== '' && this.error != null) { params.append('error', this.error) }
        const url = `${
          process.env.VUE_APP_BASE_API
        }/order/listlogordersendapp?${params.toString()}`
        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        const json = await res.json()
        if (json.status == 200) {
          this.logs = json.data
        } else {
          this.$message.error(json.message || 'Tải dữ liệu thất bại')
        }
      } catch (e) {
        this.$message.error(e.message)
      } finally {
        this.is_loading = false
      }
    },
    handleSearch() {
      this.page = 1
      this.fetchData()
    },
    handleCurrentChange(e) {
      this.page = e
      this.fetchData()
    },
    handleDetail(row) {
      this.detail = row
      this.dialogVisible = true
    },
    formatContent(row) {
      const c = row.content
      if (c == null) return ''
      if (typeof c === 'string') return c
      try {
        return JSON.stringify(c)
      } catch (e) {
        return String(c)
      }
    },
    formatValue(v) {
      if (v == null) return ''
      if (
        typeof v === 'string' ||
        typeof v === 'number' ||
        typeof v === 'boolean'
      ) {
        return v
      }
      try {
        return JSON.stringify(v)
      } catch (e) {
        return String(v)
      }
    }
  }
}
</script>

<style scoped>
.content-cell {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 32px;
  max-height: 60vh;
  overflow: auto;
}
.detail-item {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}
.detail-label {
  font-weight: 600;
  color: #303133;
  margin-right: 6px;
}
.detail-value {
  color: #606266;
}
</style>
