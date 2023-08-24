<template>
  <el-select
      v-model="dataRef[fieldName]"
      multiple
      size="mini"
      :style="cc.style"
      filterable
      default-first-option
      :disabled="disabled"
      clearable
      @change="change">
    <el-option v-for="val in getOptions()"
               :value="val.value"
               :key="val.key || val.value"
               :disabled="val.disabled"
               :label="val.label">
      <span>{{ option.label }}</span>
      <span v-if="option.comment" style="float:right;right: 0;gap: 3px;color:dodgerblue;font-size:12px" v-html="option.comment"/>
    </el-option>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellSelectMultiple',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      style:{},
    })
    this.calcWidthPixString("100%")
  },
}
</script>
