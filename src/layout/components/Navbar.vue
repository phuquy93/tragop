<template>
  <div class="right-menu">
    <span style="margin-right: 10px; position: relative; top: -11px">{{
      user.filter((a) => a.split("=")[0] === "data")[0].split("=")[1]
    }}</span>
    <el-dropdown trigger="click" size="medium">
      <span class="el-dropdown-link">
        <img
          src="./f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80"
          alt="infouser"
          style="width: 40px; border-radius: 10px; cursor: pointer"
        >
        <i class="el-icon-caret-bottom" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          class="logout"
          @click.native="logout"
        >Thoát</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUser } from '@/utils/auth'
export default {
  name: 'Navbar',
  data() {
    return {
      user: JSON.parse(getUser())
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('user/logout').then(() => {
        this.$store.dispatch('tabhistory/resetState')
      })
    }
  }
}
</script>

