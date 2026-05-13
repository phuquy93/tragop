<template>
  <div class="app-container">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="handleAddRole(true)"
    >Thêm user</el-button>
    <el-row style="margin-top: 30px">
      <el-col :xs="12" :lg="4">
        <el-input v-model="name" placeholder="Nhập tên" />
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-select v-model="status" placeholder="Tùy chọn" clearable>
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
      </el-col>
      <el-col :xs="12" :lg="4">
        <el-select
          v-model="cid_store"
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
      </el-col>
      <el-col :xs="24" :lg="4">
        <el-button
          type="primary"
          icon="el-icon-search"
          style="width: 100%"
          @click="handleSearch"
        >
          Tìm kiếm
        </el-button>
      </el-col>
    </el-row>

    <el-table
      :data="listUsers.data"
      style="width: 100%; margin-top: 30px"
      border
    >
      <el-table-column label="Tên">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Loại user">
        <template slot-scope="scope">
          <span v-if="scope.row.rule == 1">Admin</span>
          <span v-else-if="scope.row.rule == 2">Quản lý chi nhánh</span>
          <span v-else-if="scope.row.rule == 3">Tài chính</span>
          <span v-else-if="scope.row.rule == 4">Quản lý user tài chính</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">Hiện</span>
          <span v-else>Ẩn</span>
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
      <Popup
        :status-popup="statusPopup"
        :edit="edit"
        @statusDialog="statusDialog"
      />
    </el-dialog>

    <!-- Pagination -->
    <el-pagination
      :page-size="10"
      layout="total, prev, pager, next"
      :total="listUsers.TotalItem"
      :current-page.sync="page"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import Popup from './popup.vue'
import { getSites } from '@/api/store'
export default {
  components: {
    Popup
  },
  data() {
    return {
      dialogVisible: false,

      statusPopup: '',

      name: '',
      status: '',
      cid_store: '',

      page: 1,

      edit: null,

      sites: [],
      sitesLoaded: false,
      loadingSites: false
    }
  },
  computed: {
    listUsers() {
      return this.$store.state.user.listUsers
    }
  },
  created() {
    this.$store.dispatch('user/getUsers', {
      page: this.page,
      name: this.name,
      status: this.status,
      cid_store: this.cid_store,
      limit: 10
    })
  },
  methods: {
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
    handleAddRole(status) {
      this.edit = null
      this.dialogVisible = status
      this.statusPopup = 'Thêm mới'
    },
    handleSearch() {
      this.page = 1
      this.$store.dispatch('user/getUsers', {
        page: 1,
        name: this.name,
        status: this.status,
        cid_store: this.cid_store,
        limit: 10
      })
    },
    handleEdit(data) {
      data.password = ''
      data.passwordedit = ''
      this.dialogVisible = true
      this.statusPopup = 'Sửa'
      this.edit = Object.assign({}, data)
    },

    statusDialog(status) {
      this.dialogVisible = status
    },
    handleCurrentChange(e) {
      this.page = e
      this.$store.dispatch('user/getUsers', {
        page: this.page,
        name: this.name,
        status: this.status,
        cid_store: this.cid_store,
        limit: 10
      })
    }
  }
}
</script>
