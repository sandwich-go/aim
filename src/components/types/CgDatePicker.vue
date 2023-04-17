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

import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgSelect',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    })
  },
}
</script>
