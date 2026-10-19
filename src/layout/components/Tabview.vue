<template>
  <div
    ref="pane"
    class="tabview"
    :class="{ 'is-dragging': drag.active && drag.moved }"
    @mousedown="onDragStart"
    @mousemove="onDragMove"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
    @click.capture="onClickCapture"
    @wheel.prevent="onWheel"
  >
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
          @contextmenu.native.prevent="openContextMenu($event, item, index)"
        >
          <router-link :to="item.path" draggable="false">{{
            item.title
          }}</router-link>
        </el-tag>
        <el-tag
          v-else
          :key="index"
          type=""
          effect="plain"
          :class="{ active: isActive(item.path) }"
          @close="handleClose(item.path)"
          @contextmenu.native.prevent="openContextMenu($event, item, index)"
        >
          <router-link :to="item.path" draggable="false">{{
            item.title
          }}</router-link>
        </el-tag>
      </template>
    </div>

    <!-- Menu chuột phải -->
    <ul
      v-show="contextMenu.visible"
      class="tab-contextmenu"
      :style="{ left: contextMenu.left + 'px', top: contextMenu.top + 'px' }"
    >
      <li
        :class="{ disabled: disabledCurrent }"
        @click="disabledCurrent || closeCurrent()"
      >
        <i class="el-icon-close" />Đóng tab hiện tại
      </li>
      <li
        :class="{ disabled: disabledOthers }"
        @click="disabledOthers || closeOthers()"
      >
        <i class="el-icon-circle-close" />Đóng các tab khác
      </li>
      <li
        :class="{ disabled: disabledLeft }"
        @click="disabledLeft || closeLeft()"
      >
        <i class="el-icon-back" />Đóng các tab bên trái
      </li>
      <li
        :class="{ disabled: disabledRight }"
        @click="disabledRight || closeRight()"
      >
        <i class="el-icon-right" />Đóng các tab bên phải
      </li>
      <li
        class="divider"
        :class="{ disabled: disabledAll }"
        @click="disabledAll || closeAll()"
      >
        <i class="el-icon-delete" />Đóng tất cả
      </li>
    </ul>
  </div>
</template>

<script>
import router from '@/router'
import { constantRoutes } from '@/router'

export default {
  name: 'Tabview',
  data() {
    return {
      contextMenu: {
        visible: false,
        left: 0,
        top: 0
      },
      selected: {
        item: null,
        index: -1
      },
      drag: {
        active: false,
        startX: 0,
        scrollLeft: 0,
        moved: false
      }
    }
  },
  computed: {
    getTabViews() {
      return this.$store.state.tabhistory.listTabs
    },
    // Không đóng được tab cố định (index 0)
    disabledCurrent() {
      return this.selected.index <= 0
    },
    // Còn tab nào khác (ngoài tab cố định và tab đang chọn) để đóng không
    disabledOthers() {
      return (
        this.getTabViews.filter(
          (t, i) => i !== 0 && (this.selected.item ? t.path !== this.selected.item.path : true)
        ).length === 0
      )
    },
    // Có tab đóng được nào nằm bên trái không (index 0 là cố định)
    disabledLeft() {
      return this.selected.index <= 1
    },
    // Có tab nào bên phải không
    disabledRight() {
      return this.selected.index >= this.getTabViews.length - 1
    },
    // Còn tab đóng được nào không (ngoài tab cố định)
    disabledAll() {
      return this.getTabViews.length <= 1
    }
  },
  watch: {
    $route: {
      handler: function() {
        let getTabViews = [...this.$store.state.tabhistory.listTabs]
        const filter = getTabViews.filter((a) => a.path === this.$route.path)
        const item = constantRoutes.find((a) => a.path === this.$route.path)

        const router = {
          path: item.path,
          title: item.meta.title,
          id: item.id
        }
        if (filter.length === 0) {
          getTabViews = [...getTabViews, router]
        }

        this.$store.dispatch('tabhistory/getTabViews', getTabViews)
      }
    }
  },
  created() {
    const getTabViews = [...this.$store.state.tabhistory.listTabs]
    const filter = getTabViews.filter((a) => a.path === this.$route.path)
    if (filter.length === 0) {
      const router = {
        path: this.$route.path,
        title: this.$route.meta.title
      }
      getTabViews.push(router)
    }
    this.$store.dispatch('tabhistory/getTabViews', getTabViews)
  },
  mounted() {
    document.addEventListener('click', this.closeContextMenu)
    window.addEventListener('resize', this.closeContextMenu)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeContextMenu)
    window.removeEventListener('resize', this.closeContextMenu)
  },
  methods: {
    isActive(route) {
      if (route === this.$route.path) {
        return true
      }
      return false
    },
    handleClose(tab) {
      const getTabViews = [...this.$store.state.tabhistory.listTabs]
      const index = getTabViews.findIndex((a) => a.path === tab)
      getTabViews.splice(index, 1)
      router.push({ path: getTabViews[getTabViews.length - 1].path })
      this.$store.dispatch('tabhistory/getTabViews', getTabViews)
    },

    // ---- Menu chuột phải ----
    openContextMenu(e, item, index) {
      this.selected = { item, index }
      // Giới hạn để menu không tràn khỏi màn hình
      const menuWidth = 210
      const menuHeight = 200
      this.contextMenu.left = Math.min(e.clientX, window.innerWidth - menuWidth)
      this.contextMenu.top = Math.min(e.clientY, window.innerHeight - menuHeight)
      this.contextMenu.visible = true
    },
    closeContextMenu() {
      this.contextMenu.visible = false
    },
    // Áp dụng danh sách tab mới và điều hướng nếu cần
    applyTabs(tabs, gotoPath) {
      this.$store.dispatch('tabhistory/getTabViews', tabs)
      this.closeContextMenu()
      if (gotoPath && this.$route.path !== gotoPath) {
        router.push({ path: gotoPath })
      }
    },
    closeCurrent() {
      const idx = this.selected.index
      if (idx <= 0) return
      const tabs = [...this.getTabViews]
      const closingActive = this.selected.item.path === this.$route.path
      tabs.splice(idx, 1)
      let goto = this.$route.path
      if (closingActive) {
        const neighbor = tabs[idx - 1] || tabs[tabs.length - 1]
        goto = neighbor ? neighbor.path : this.$route.path
      }
      this.applyTabs(tabs, goto)
    },
    closeOthers() {
      const target = this.selected.item
      const tabs = this.getTabViews.filter(
        (t, i) => i === 0 || t.path === target.path
      )
      this.applyTabs(tabs, target.path)
    },
    closeLeft() {
      const idx = this.selected.index
      // Giữ tab cố định (0) và các tab từ vị trí đang chọn trở đi
      const tabs = this.getTabViews.filter((_t, i) => i === 0 || i >= idx)
      const stillOpen = tabs.some((t) => t.path === this.$route.path)
      this.applyTabs(tabs, stillOpen ? this.$route.path : this.selected.item.path)
    },
    closeRight() {
      const idx = this.selected.index
      const tabs = this.getTabViews.filter((_t, i) => i <= idx)
      const stillOpen = tabs.some((t) => t.path === this.$route.path)
      this.applyTabs(tabs, stillOpen ? this.$route.path : this.selected.item.path)
    },
    closeAll() {
      // Chỉ giữ lại tab cố định
      const tabs = this.getTabViews.filter((_t, i) => i === 0)
      const goto = tabs.length ? tabs[0].path : '/'
      this.applyTabs(tabs, goto)
    },

    // ---- Kéo chuột để trượt tab qua lại ----
    onDragStart(e) {
      // Chỉ nhận chuột trái
      if (e.button !== 0) return
      // Chặn kéo-thả gốc của trình duyệt (kéo link/chữ) gây khựng
      e.preventDefault()
      const pane = this.$refs.pane
      this.drag.active = true
      this.drag.moved = false
      this.drag.startX = e.pageX - pane.offsetLeft
      this.drag.scrollLeft = pane.scrollLeft
    },
    onDragMove(e) {
      if (!this.drag.active) return
      const pane = this.$refs.pane
      const x = e.pageX - pane.offsetLeft
      const walk = x - this.drag.startX
      // Vượt ngưỡng nhỏ mới coi là "đang kéo" (tránh chặn click chọn tab)
      if (Math.abs(walk) > 4) this.drag.moved = true
      pane.scrollLeft = this.drag.scrollLeft - walk
    },
    onDragEnd() {
      this.drag.active = false
    },
    onClickCapture(e) {
      // Nếu vừa kéo thì chặn click (không mở tab / không đóng tab ngoài ý muốn)
      if (this.drag.moved) {
        e.preventDefault()
        e.stopPropagation()
        this.drag.moved = false
      }
    },
    onWheel(e) {
      // Lăn chuột dọc -> trượt tab theo chiều ngang
      const pane = this.$refs.pane
      pane.scrollLeft += e.deltaY + e.deltaX
    }
  }
}
</script>

<style lang="scss" scoped>
.tabview {
  position: relative;

  // Chặn kéo-thả gốc của trình duyệt trên link/tag để kéo trượt mượt
  a,
  .el-tag {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-select: none;
  }
}

.tab-contextmenu {
  position: fixed;
  z-index: 3000;
  min-width: 190px;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.16);

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 13px;
    color: #303133;
    border-radius: 6px;
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.15s ease, color 0.15s ease;

    i {
      font-size: 15px;
      color: #909399;
    }

    &:hover {
      background: #ecf5ff;
      color: #409eff;

      i {
        color: #409eff;
      }
    }

    &.divider {
      margin-top: 4px;
      border-top: 1px solid #f0f2f5;
      padding-top: 10px;

      &:hover {
        background: #fef0f0;
        color: #f56c6c;

        i {
          color: #f56c6c;
        }
      }
    }

    &.disabled {
      color: #c0c4cc;
      cursor: not-allowed;

      i {
        color: #c0c4cc;
      }

      &:hover {
        background: transparent;
        color: #c0c4cc;
      }
    }
  }
}
</style>
