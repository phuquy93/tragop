<template>
  <el-dialog
    :visible="visible"
    :title="title"
    @update:visible="$emit('update:visible', $event)"
  >
    <div v-if="detail" class="log-detail">
      <!-- Thông tin ngắn: lưới thẻ -->
      <div class="info-grid">
        <div v-for="f in infoFields" :key="f.key" class="info-item">
          <div class="info-label">{{ f.label }}</div>
          <div class="info-value">
            <el-tag
              v-if="f.key === 'error' && errorTag(f.value)"
              :type="errorTag(f.value).type"
              size="small"
            >{{ errorTag(f.value).text }}</el-tag>
            <span v-else-if="f.value === ''" class="empty">—</span>
            <template v-else>{{ f.value }}</template>
          </div>
        </div>
      </div>

      <!-- Nội dung dài / JSON: khung code -->
      <div v-for="f in blockFields" :key="f.key" class="block">
        <div class="block-head">
          <span class="info-label">{{ f.label }}</span>
        </div>
        <pre class="block-code">{{ f.value }}</pre>
      </div>
    </div>

    <span slot="footer">
      <el-button
        icon="el-icon-close"
        @click="$emit('update:visible', false)"
      >Đóng</el-button>
    </span>
  </el-dialog>
</template>

<script>
// Tình trạng lỗi (giống bộ lọc ở trang log)
const ERROR_TAGS = {
  0: { text: 'Thành công', type: 'success' },
  1: { text: 'Lỗi đối tác', type: 'warning' },
  2: { text: 'Lỗi serve', type: 'danger' }
}

// Ngày dạng { date: '2026-10-19 11:27:02.000000', timezone: ... }
function isDateObject(v) {
  return v != null && typeof v === 'object' && typeof v.date === 'string'
}

// Object/mảng, chuỗi JSON hoặc chuỗi dài -> hiển thị dạng khung code
function isBlock(v) {
  if (v == null || isDateObject(v)) return false
  if (typeof v === 'object') return true
  if (typeof v !== 'string') return false
  const s = v.trim()
  return s.startsWith('{') || s.startsWith('[') || s.length > 120
}

export default {
  name: 'LogDetailDialog',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Chi tiết' },
    detail: { type: Object, default: null },
    // [{ key, label }]
    fields: { type: Array, default: () => [] }
  },
  computed: {
    rows() {
      const detail = this.detail || {}
      return this.fields.map((f) => ({
        key: f.key,
        label: f.label.replace(/_/g, ' '),
        raw: detail[f.key]
      }))
    },
    infoFields() {
      return this.rows
        .filter((r) => !isBlock(r.raw))
        .map((r) => ({ ...r, value: this.formatShort(r.raw) }))
    },
    blockFields() {
      return this.rows
        .filter((r) => isBlock(r.raw))
        .map((r) => ({ ...r, value: this.prettyJson(r.raw) }))
    }
  },
  methods: {
    formatShort(v) {
      if (v == null) return ''
      if (isDateObject(v)) return v.date.slice(0, 19)
      return String(v)
    },
    prettyJson(v) {
      let obj = v
      if (typeof v === 'string') {
        try {
          obj = JSON.parse(v)
        } catch (e) {
          return v
        }
      }
      try {
        return JSON.stringify(obj, null, 2)
      } catch (e) {
        return String(v)
      }
    },
    errorTag(v) {
      return v === '' ? null : ERROR_TAGS[v]
    }
  }
}
</script>

<style lang="scss" scoped>
$border: #e3e6ea;
$muted: #8a929c;
$ink: #303133;

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  margin-bottom: 18px;
}

.info-item {
  padding: 10px 12px;
  border: 1px solid $border;
  border-radius: 8px;
  background: #fafbfc;
  min-width: 0;
}

.info-label {
  font-size: 11.5px;
  font-weight: 700;
  color: $muted;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-value {
  margin-top: 4px;
  font-size: 14px;
  line-height: 1.45;
  color: $ink;
  word-break: break-all;

  .empty {
    color: #c0c4cc;
  }
}

.block {
  margin-bottom: 16px;
}

.block-head {
  margin-bottom: 6px;
}

.block-code {
  margin: 0;
  max-height: 420px;
  overflow: auto;
  padding: 12px 14px;
  border: 1px solid $border;
  border-radius: 8px;
  background: #f6f8fa;
  color: #24292f;
  font-family: Consolas, "SFMono-Regular", Menlo, monospace;
  font-size: 12.5px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
