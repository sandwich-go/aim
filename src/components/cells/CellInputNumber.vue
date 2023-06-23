<template>
  <el-input-number
      v-model="dataRef[fieldName]"
      :min="cc.min"
      :max="cc.max"
      :precision="cc.precision"
      :step="cc.step"
      :disabled="disabled"
      :controls-position="cc.controlsPosition"
      :style="cc.style"
      @change="change"
      size="mini"
  ></el-input-number>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellInputNumber',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
      min: -Infinity,
      max: Infinity,
      step: 1,
      controlsPosition:'right'
    })
    this.calcWidthPixString("100%")
  },
}
</script>
