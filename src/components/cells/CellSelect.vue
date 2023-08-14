<template>
  <el-select
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      size="mini"
      clearable
      @change="change">
    <el-option
        v-for="option in optionsUsing"
        :key="option.value"
        :label="option.label"
        :disabled="option.disabled"
        :value="option.value">
      <span>{{ option.label }}</span>
      <span v-if="option.comment" style="float:right;right: 0;gap: 3px;color:dodgerblue;font-size:12px" v-html="option.comment">
      </span>
    </el-option>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellSelect',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPixString("100%")
  },
}
</script>
