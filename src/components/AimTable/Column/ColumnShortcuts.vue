<template>
  <div style="display:inline; gap: 20px">
    <template v-for="(sc,shortcut) in fieldSchema['shortcuts'] || {}">
      <span :key="shortcut">
        <el-link
            v-if="shortcut ==='copy'"
            :type="pathGet(sc,'type','primary')"
            :style="style(sc)"
            :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
            @click="clipCopy($event,sc)">
        <i :class="pathGet(shortcut,'icon','el-icon-document-copy')"/>
      </el-link>
      <el-link
          v-if="shortcut ==='jump' && pathGet(sc,'href',fieldValueFormatted)"
          :type="pathGet(sc,'type','primary')"
          :style="style(sc)"
          :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
          :href="pathGet(sc,'href',fieldValueFormatted)">
        <i :class="pathGet(shortcut,'icon','el-icon-s-promotion')"/>
      </el-link>
      <el-link
          v-if="shortcut ==='filter'"
          :style="style(sc)"
          :type="pathGet(sc,'type','primary')"
          :href="pathGet(sc,'href',fieldValueFormatted)"
          :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
          @click="clipFilter($event,sc)">
        <i :class="pathGet(shortcut,'icon','el-icon-search')"/>
      </el-link>
      </span>
    </template>
  </div>
</template>

<script>
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'ColumnShortcuts',
  props: {
    row: Object,
    fieldSchema: Object,
  },
  data() {
    return {
      fieldValueFormatted: this.getFieldValueFormatted()
    }
  },
  methods: {
    clipFilter(){
    },
    getFieldValueFormatted() {
      return this.fieldSchema.formatter ?
          this.fieldSchema.formatter({value: jsb.pathGet(this.row, this.fieldSchema.field), row: this.row}) :
          jsb.pathGet(this.row, this.fieldSchema.field)
    },
    style(cc) {
      let style = this.pathGet(cc,'style',{})
      jsb.objectAssignNX(style,{
        'padding-right':'3px'
      })
      return style
    },
    pathGet(cc, name, defaultVal) {
      const v = jsb.pathGet(cc, name, defaultVal)
      if (jsb.isFunction(v)) {
        return v({value: this.fieldValueFormatted, row: this.row})
      }
      return v
    },
    clipCopy(event, sc) {
      let clipCopy = jsb.pathGet(sc, 'click')
      if (!clipCopy) {
        clipCopy = jsb.clipCopy
      }
      clipCopy(this.row[this.fieldSchema.field], event)
    },
  }
}
</script>
