<template>
  <div class="left-menu">
    <a href="/" class="hamburger-container" @click.prevent="handleMenu">
      <i v-if="isMobi" class="fa fa-outdent" aria-hidden="true" />

      <i
        v-else
        :class="[
          { 'fa fa-indent': isCollapse },
          { 'fa fa-outdent': !isCollapse },
        ]"
        aria-hidden="true"
      />
    </a>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in getBreadcrumb.children"
        :key="index"
      >{{ item.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import { constantRoutes } from '@/router'
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: null
    }
  },
  computed: {
    isMobi() {
      return screen.width < 767
    },
    isCollapse() {
      return this.$store.state.settings.sidebar.opened && screen.width
    },
    getBreadcrumb() {
      const matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      return constantRoutes.find((a) => a.path === matched[0].path)
    }
  },

  methods: {
    handleMenu() {
      this.$store.dispatch('settings/changeIscollapse', !this.isCollapse)
    }
  }
}
</script>

<style>
</style>
