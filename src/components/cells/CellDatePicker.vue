<template>
  <el-date-picker
      :disabled="disabled"
      v-model="dataRef[fieldName]"
      type="datetime"
      :default-time="cc.defaultTime"
      :placeholder="cc.placeholder"
      @change="change"
      size="mini"
      :style="cc.style"
  >
  </el-date-picker>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellDatePicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    })
    this.calcWidthPixString("100%")
  },
}
</script>
