<template>
  <div style="display:inline; gap: 20px">
    <template v-for="(sc,shortcut) in shortcuts || {}">
      <span :key="shortcut">
        <el-link
            v-if="shortcut ==='copy'"
            :type="pathGet(sc,'type','primary')"
            :style="style(sc)"
            :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
            @click="clipCopy($event,sc)">
        <i :class="pathGet(sc,'icon','el-icon-document-copy')"/>
      </el-link>
      <el-link
          v-else-if="shortcut ==='jump' && pathGet(sc,'href',fieldValueFormatted)"
          :type="pathGet(sc,'type','primary')"
          :style="style(sc)"
          target="_blank"
          :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
          :href="pathGet(sc,'href',fieldValueFormatted)">
        <i :class="pathGet(sc,'icon','el-icon-s-promotion')"/>
      </el-link>
      <el-link
          v-else-if="shortcut ==='filter'"
          :style="style(sc)"
          :type="pathGet(sc,'type','primary')"
          :disabled="pathGet(sc,'disabled',false) || fieldValueFormatted===''"
          @click="clipFilter(sc)">
        <i :class="pathGet(sc,'icon','el-icon-search')"/>
      </el-link>
        <el-link
            v-else
            :style="style(sc)"
            :type="pathGet(sc,'type','primary')"
            :disabled="pathGet(sc,'disabled',false)"
            @click="click(sc,shortcut)">
        <i :class="pathGet(shortcut,'icon','el-icon-s-grid')"/>
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
  computed: {
    shortcuts() {
      const sc = this.pathGet(this.fieldSchema,'shortcuts',{})
      if(jsb.isFunction(sc)){
        return sc({row:this.row})
      }
      return sc
    }
  },
  data() {
    return {
      fieldSchemaRef:this.fieldSchema,
      fieldValueFormatted: this.getFieldValueFormatted(),
    }
  },
  methods: {
    click(sc,shortcut){
      const v = jsb.pathGet(sc,'click')
      if(v){
        v({row:this.row,value: this.fieldValueFormatted,})
        return
      }
      jsb.cc.toastWarning(`shortcut ${shortcut} no click function`)
    },
    clipFilter(){
      if(!this.fieldSchema.filter){
        jsb.cc.toastWarning(`shortcut filter not configured for field: ${this.fieldSchema.field}`)
        return
      }
      this.$set(this.fieldSchemaRef.filter.data,this.fieldSchema.field,this.fieldValueFormatted)
    },
    clipCopy(event, sc) {
      let clipCopy = jsb.pathGet(sc, 'click')
      if (!clipCopy) {
        clipCopy = jsb.clipCopy
      }
      clipCopy(this.fieldValueFormatted, event)
    },
    getFieldValueFormatted() {
      return this.fieldSchema.formatter ?
          this.fieldSchema.formatter({row: this.row,value: this.fieldValueFormatted}) :
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
        return v({row: this.row,value: this.fieldValueFormatted})
      }
      return v
    },
  }
}
</script>
