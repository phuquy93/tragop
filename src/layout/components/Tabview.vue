<template>
  <div class="tabview">
    <div class="flex">
      <template v-for="(item, index) in getTabViews">
        <el-tag
          v-if="index != 0"
          :key="index"
          type=""
          effect="plain"
          closable
          :class="{ active: isActive(item.path) }"
          @close="handleClose(item.path)"
        >
          <router-link :to="item.path">{{ item.title }}</router-link>
        </el-tag>
        <el-tag
          v-else
          :key="index"
          type=""
          effect="plain"
          :class="{ active: isActive(item.path) }"
          @close="handleClose(item.path)"
        >
          <router-link :to="item.path">{{ item.title }}</router-link>
        </el-tag>
      </template>
    </div>
  </div>
</template>

<script>
import router from '@/router'
import { constantRoutes } from '@/router'

export default {
  name: 'Tabview',
  computed: {
    getTabViews() {
      return this.$store.state.tabhistory.listTabs
    }
  },
  watch: {
    $route: {
      handler: function() {
        let getTabViews = [...this.$store.state.tabhistory.listTabs]
        const filter = getTabViews.filter((a) => a.path == this.$route.path)
        const item = constantRoutes.find((a) => a.path == this.$route.path)

        const router = {
          path: item.path,
          title: item.meta.title,
          id: item.id
        }
        if (filter.length == 0) {
          getTabViews = [...getTabViews, router]
        }

        this.$store.dispatch('tabhistory/getTabViews', getTabViews)
        // if (window.screen.width < 767) {
        //   this.$store.dispatch("settings/changeIscollapse", false);
        // }
      }
    }
  },
  created() {
    const getTabViews = [...this.$store.state.tabhistory.listTabs]
    const filter = getTabViews.filter((a) => a.path == this.$route.path)
    if (filter.length == 0) {
      const router = {
        path: this.$route.path,
        title: this.$route.meta.title
      }
      getTabViews.push(router)
    }
    this.$store.dispatch('tabhistory/getTabViews', getTabViews)
  },
  methods: {
    isActive(route) {
      if (route == this.$route.path) {
        return true
      }
      return false
    },
    handleClose(tab) {
      const getTabViews = [...this.$store.state.tabhistory.listTabs]
      const index = getTabViews.findIndex((a) => a.path == tab)
      getTabViews.splice(index, 1)
      router.push({ path: getTabViews[getTabViews.length - 1].path })
      this.$store.dispatch('tabhistory/getTabViews', getTabViews)
    }
  }
}
</script>
