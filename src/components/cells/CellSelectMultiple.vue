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
    <el-option v-for="(val,idx) in getOptions()"
               :value="val.value"
               :key="idx"
               :disabled="val.disabled"
               :label="val.label"></el-option>
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
      change:function (valNew){
        this.$emit("input",valNew)
      }
    })
    this.calcWidthPxString("100%")
  },
}
</script>
