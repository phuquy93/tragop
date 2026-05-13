<template>
  <div class="sidebar-inner">
    <div class="bg_overflow" @click.prevent="handleMenu" />
    <div class="sidebar-container">
      <el-menu
        :collapse="iscollapse"
        class="el-menu-vertical-demo"
        theme="light"
        :default-active="defaultBar"
      >
        <template
          v-for="(item, index) in siderBars.filter((a) => a.alwaysShow)"
        >
          <template v-if="item.children && item.children.length > 1">
            <el-submenu :key="index" :index="item.path">
              <template
                slot="title"
              ><i :class="item.meta.icon" aria-hidden="true" />{{
                item.meta.title
              }}</template>

              <el-menu-item
                v-for="(subItem, i) in item.children.filter((c) =>
                  c.meta.roles.find(
                    (b) =>
                      b ==
                      user.find((a) => a.split('=')[0] == 'rule').split('=')[1]
                  )
                )"
                :key="i"
                :index="subItem.path"
              ><router-link :to="subItem.path">{{
                subItem.meta.title
              }}</router-link></el-menu-item>
            </el-submenu>
          </template>

          <template
            v-else-if="
              item.children &&
                item.children.length === 1 &&
                item.meta.roles.find(
                  (a) =>
                    a == user.find((a) => a.split('=')[0] == 'rule').split('=')[1]
                )
            "
          >
            <el-menu-item :key="index" :index="item.path">
              <router-link :to="item.path">
                <i :class="item.meta.icon" aria-hidden="true" />{{
                  item.meta.title
                }}</router-link>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { constantRoutes } from '@/router'
export default {
  name: 'Sidebar',
  computed: {
    iscollapse() {
      return this.$store.state.settings.isCollapse
    },

    defaultBar() {
      return this.$route.path
    },

    user() {
      return this.$store.state.user.user
    },
    siderBars() {
      return constantRoutes
    }
  },
  methods: {
    handleMenu() {
      this.$store.dispatch('settings/changeIscollapse', false)
    }
  }
}
</script>
