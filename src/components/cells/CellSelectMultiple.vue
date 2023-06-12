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
    <el-option v-for="(val,idx) in optionsComputed"
               :value="val.value"
               :key="idx"
               :disabled="val.disabled"
               :label="val.label"></el-option>
  </el-select>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellSelectMultiple',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
      style:{},
    })
    this.calcWidthPixString("100%")
  },
}
</script>
