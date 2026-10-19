<template>
  <!-- Layout theo Kiemke2026: sidebar xanh full chiều cao, tài khoản ở cuối sidebar -->
  <div
    class="app-wrapper tg-app"
    :class="{ 'is-rail': railCollapsed, 'is-mobile-open': mobileOpen }"
  >
    <Sidebar :collapsed="railCollapsed" @toggle-rail="toggleRail" />

    <!-- Mobile: lớp phủ khi mở menu -->
    <div class="tg-overlay" @click="mobileOpen = false" />

    <div class="main-container">
      <!-- Chỉ hiện trên mobile: nút ☰ mở menu + logo -->
      <div class="tg-topbar">
        <button
          type="button"
          class="tg-burger"
          title="Mở menu"
          @click="mobileOpen = true"
        >
          <i class="fa fa-bars" />
        </button>
        <img class="tg-topbar-logo" :src="logo" alt="Điện Máy Chợ Lớn">
      </div>
      <Tabview />
      <AppMain />
    </div>
  </div>
</template>

<script>
import { AppMain, Sidebar, Tabview } from './components'
import logo from '@/assets/logo.png'

const RAIL_STORAGE_KEY = 'Tragop-Sidebar-Rail'

function readRail() {
  try {
    return JSON.parse(window.localStorage.getItem(RAIL_STORAGE_KEY)) === true
  } catch (e) {
    return false
  }
}

export default {
  name: 'Layout',
  components: { Sidebar, AppMain, Tabview },
  data() {
    return {
      logo,
      // Mobile: menu trượt từ trái đang mở
      mobileOpen: false,
      // Desktop: thu gọn sidebar thành thanh icon
      railCollapsed: readRail()
    }
  },
  watch: {
    $route() {
      this.mobileOpen = false
    }
  },
  methods: {
    toggleRail() {
      this.railCollapsed = !this.railCollapsed
      try {
        window.localStorage.setItem(
          RAIL_STORAGE_KEY,
          JSON.stringify(this.railCollapsed)
        )
      } catch (e) {
        // bỏ qua khi trình duyệt chặn storage
      }
    }
  }
}
</script>
