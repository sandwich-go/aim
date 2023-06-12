<template>
  <el-select
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      size="mini"
      clearable
      @change="change">
    <el-option
        v-for="option in optionsComputed"
        :key="option.value"
        :label="option.label"
        :value="option.value">
    </el-option>
  </el-select>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellSelect',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
    this.calcWidthPixString("100%")
  },
}
</script>
