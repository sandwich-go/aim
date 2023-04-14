<template>
  <el-date-picker
      size="mini"
      v-model="scopeData.value"
      type="datetimerange"
      :disabled="disabled"
      :default-time="scopeData.defaultTime"
      :style="scopeData.style"
      :range-separator="scopeData.rangeSeparator"
      :picker-options="scopeData.pickerOptions"
      :start-placeholder="scopeData.startPlaceholder"
      :end-placeholder="scopeData.endPlaceholder"
      @change="scopeData.change"
  >
  </el-date-picker>
</template>

<script>
const jsb = require("@sandwich-go/jsb")

export default {
  name: 'SlotDateTimeRange',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      scopeData:{
        startPlaceholder:'开始时间',
        endPlaceholder:'开始时间',
        rangeSeparator:'~',
        defaultTime:['00:00:00','23:59:59'],
        pickerOptions:jsb.datetimePickerOptionsPast(),
        style:{
          width:"320px"
        },
        change:function (valNew){
          this.$emit("input",valNew)
        }
      },
    }
  },
  created() {
    this.scopeData = Object.assign(this.scopeData,this.scope)
  }
}
</script>
