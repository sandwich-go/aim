<template>
  <el-input-number
      v-model="dataRef[fieldName]"
      :min="cc.min"
      :max="cc.max"
      :step="cc.step"
      :disabled="disabled"
      :controls-position="cc.controlsPosition"
      :style="cc.style"
      @change="change"
      size="mini"
  ></el-input-number>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgInputNumber',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      min: -Infinity,
      max: Infinity,
      step: 1,
      controlsPosition:'right'
    })
  },
}
</script>
