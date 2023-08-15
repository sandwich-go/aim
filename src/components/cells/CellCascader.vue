<template>
  <el-cascader
      v-bind="cc"
      :options="getOptions()"
      clearable
      size="mini"
      v-model="dataRef[fieldName]"
  >
    <template slot-scope="{ node, data }">
      <span>{{ data.label }}</span>
      <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
    </template>
  </el-cascader>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellCascader',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPixString("100%")
    console.log(this.options())
  },
}
</script>
