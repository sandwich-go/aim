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

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {pathGet} from "@/components/utils/jsb";

export default {
  name: 'CellInputNumber',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      min: pathGet(this.fieldSchemaRef, 'min', -Infinity),
      max: pathGet(this.fieldSchemaRef, 'max', Infinity),
      step: pathGet(this.fieldSchemaRef, 'step', 1),
      controlsPosition: 'right'
    })
    this.calcWidthPixString("100%")
  },
}
</script>
