<template>
  <el-cascader
      v-bind="cc"
      clearable
      :options="optionsComputed"
      v-model="dataRef[fieldName]">
    <template slot-scope="{ node, data }">
      <span>{{ data.label }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellCascader',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
    this.calcWidthPixString("100%")
  },
}
</script>
