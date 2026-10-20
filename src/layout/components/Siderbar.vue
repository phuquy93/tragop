<template>
  <aside class="app-sidebar">
    <!-- Loading toàn màn hình khi đang đăng xuất -->
    <div v-if="isLogout" class="logout-loading">
      <div class="logout-loading-box">
        <div class="logout-spinner" />
        <span>Đang đăng xuất...</span>
      </div>
    </div>

    <div class="app-brand">
      <div class="brand-row">
        <router-link to="/" title="Trang chủ">
          <img class="logo-img" :src="logo" alt="Điện Máy Chợ Lớn">
        </router-link>
        <span class="brand-mark" aria-hidden="true">D</span>
        <button
          class="rail-btn"
          type="button"
          :title="collapsed ? 'Mở rộng menu' : 'Thu gọn menu'"
          @click="$emit('toggle-rail')"
        >
          <i class="fa fa-chevron-left" aria-hidden="true" />
        </button>
      </div>
      <span class="portal-pill"><span class="dot" /> Cổng trả góp</span>
    </div>

    <nav class="app-nav">
      <template v-for="group in visibleGroups">
        <button
          :key="group.key + '-head'"
          type="button"
          class="app-nav-group"
          :class="{ collapsed: !isOpen(group) }"
          :aria-expanded="isOpen(group) ? 'true' : 'false'"
          @click="toggleGroup(group)"
        >
          <span>{{ group.title }}</span>
          <i class="fa fa-chevron-down nav-chev" aria-hidden="true" />
        </button>
        <div
          :key="group.key + '-items'"
          class="app-nav-items"
          :class="{ 'is-closed': !isOpen(group) }"
        >
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            :title="item.title"
            :class="{ 'is-active': $route.path === item.path }"
          >
            <i :class="item.icon" aria-hidden="true" />
            <span>{{ item.title }}</span>
          </router-link>
        </div>
      </template>
    </nav>

    <div v-if="user" class="app-user">
      <div class="who-link" :title="displayName">
        <span class="avatar">{{ initials }}</span>
        <span class="who">
          <b>{{ displayName }}</b>
          <span>{{ roleLabel }}</span>
        </span>
      </div>
      <a href="#" class="user-action" title="Thoát" @click.prevent="logout">
        <i class="fa fa-sign-out-alt" aria-hidden="true" />
      </a>
    </div>
  </aside>
</template>

<script>
import { constantRoutes } from '@/router'
import logo from '@/assets/logo.png'

// Nhóm menu (thứ tự hiển thị = thứ tự mảng); tiêu đề, icon, quyền lấy từ router
const MENU_GROUPS = [
  {
    key: 'hoso',
    title: 'Hồ sơ trả góp',
    paths: [
      '/installment/new',
      '/installment/logreturn',
      '/installment/logdata',
      '/installment/loggetorder',
      '/installment/logupdateapp'
    ]
  },
  { key: 'baocao', title: 'Báo cáo', paths: ['/installment/export'] },
  { key: 'quantri', title: 'Quản trị', paths: ['/installment/user'] }
]

const ROLE_LABELS = {
  1: 'Admin',
  2: 'Quản lý chi nhánh',
  3: 'Tài chính',
  4: 'Quản lý user tài chính',
  5: 'Nhân viên bán hàng'
}

// Nhóm chứa trang đang mở thì mở, các nhóm khác đóng
function groupStateFor(path) {
  return MENU_GROUPS.reduce((state, g) => {
    state[g.key] = g.paths.includes(path)
    return state
  }, {})
}

export default {
  name: 'Sidebar',
  props: {
    // Desktop: sidebar đang thu gọn thành thanh icon
    collapsed: { type: Boolean, default: false }
  },
  data() {
    return {
      logo,
      isLogout: false,
      // key nhóm -> đang mở/đóng
      groupState: groupStateFor(this.$route.path)
    }
  },
  watch: {
    // Chuyển sang trang thuộc nhóm đang đóng thì mở nhóm đó
    '$route.path'(path) {
      const group = MENU_GROUPS.find((g) => g.paths.includes(path))
      if (group && !this.groupState[group.key]) {
        this.groupState = { ...this.groupState, [group.key]: true }
      }
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    },
    rule() {
      return this.userField('rule')
    },
    // Chỉ giữ mục user có quyền, bỏ nhóm không còn mục nào
    visibleGroups() {
      return MENU_GROUPS.map((g) => ({
        ...g,
        items: g.paths
          .map((path) => constantRoutes.find((r) => r.path === path))
          .filter((r) => r && r.meta.roles.some((role) => role == this.rule))
          .map((r) => ({ path: r.path, title: r.meta.title, icon: r.meta.icon }))
      })).filter((g) => g.items.length)
    },
    displayName() {
      return this.userField('name') || this.userField('data')
    },
    initials() {
      const words = this.displayName.trim().split(/\s+/).filter(Boolean)
      const first = words[0] ? words[0][0] : '?'
      const last = words.length > 1 ? words[words.length - 1][0] : ''
      return (first + last).toUpperCase()
    },
    roleLabel() {
      return ROLE_LABELS[this.rule] || this.userField('data')
    }
  },
  methods: {
    // Cookie user lưu dạng ['key=value', ...]
    userField(key) {
      const entry = (this.user || []).find((a) => a.split('=')[0] === key)
      return entry ? entry.slice(key.length + 1) : ''
    },
    isOpen(group) {
      return !!this.groupState[group.key]
    },
    toggleGroup(group) {
      this.groupState = { ...this.groupState, [group.key]: !this.isOpen(group) }
    },
    logout() {
      if (this.isLogout) return
      this.isLogout = true
      this.$store
        .dispatch('user/logout')
        .then(() => {
          this.$store.dispatch('tabhistory/resetState')
        })
        .finally(() => {
          this.isLogout = false
        })
    }
  }
}
</script>
