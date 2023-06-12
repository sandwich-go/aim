<template>
  <el-date-picker
      v-bind="cc"
      v-model="dataRef[fieldName]"
      type="datetimerange"
      @change="change"
      :disabled="disabled"
  >
  </el-date-picker>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellDateRangePicker',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
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
