<template>
  <el-input-number
      v-model="dataRef[fieldName]"
      :min="cc.min"
      :max="cc.max"
      :step="cc.step"
      :disabled="disabled"
      :style="cc.style"
      @change="change"
      size="mini"
  ></el-input-number>
</template>

<script>

import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgInputNumber',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig({
      min: -Infinity,
      max: Infinity,
      step: 1,
    })
  },
}
</script>
