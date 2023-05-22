<template>
  <el-date-picker
      v-model="dataRef[fieldName]"
      type="datetimerange"
      :disabled="disabled"
      :default-time="cc.defaultTime"
      :style="cc.style"
      :range-separator="cc.rangeSeparator"
      :picker-options="cc.pickerOptions"
      :start-placeholder="cc.startPlaceholder"
      :end-placeholder="cc.endPlaceholder"
      @change="change"
      size="mini"
  >
  </el-date-picker>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellDateRangePicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      startPlaceholder:'开始时间',
      endPlaceholder:'开始时间',
      rangeSeparator:'~',
      defaultTime:['00:00:00','23:59:59'],
      pickerOptions:{},
    })
    this.calcWidthPixString("100%")
  },
}
</script>
