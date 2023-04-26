<template>
  <el-select
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      size="mini"
      @change="change">
    <el-option
        v-for="option in getOptions()"
        :key="option.value"
        :label="option.label"
        :value="option.value">
    </el-option>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {CellNameSelect} from "@/components/cells/const";

export default {
  name: CellNameSelect,
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPxString("100%")
  },
}
</script>
