<template>
  <div class="app-wrapper" :class="{ hideMenu: isCollapse }">
    <Sidebar />
    <div class="main-container">
      <div class="navbar">
        <Breadcrumb />
        <Navbar />
      </div>
      <Tabview />
      <AppMain />
    </div>
  </div>
</template>

<script >
import { AppMain, Navbar, Breadcrumb, Sidebar, Tabview } from './components'

export default {
  name: 'Layout',
  components: { Sidebar, Navbar, Breadcrumb, AppMain, Tabview },
  computed: {
    isCollapse() {
      return this.$store.state.settings.sidebar.opened
    }
  }
}
</script>

