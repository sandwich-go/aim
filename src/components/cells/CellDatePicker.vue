<template>
  <el-date-picker
      type="datetime"
      :disabled="disabled"
      v-model="dataRef[fieldName]"
      @change="change"
      v-bind="cc">
  </el-date-picker>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellDatePicker',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    })
    this.calcWidthPixString("100%")
  },
}
</script>
