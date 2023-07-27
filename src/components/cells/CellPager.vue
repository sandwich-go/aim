<template>
  <el-pagination
      :background="cc.background"
      :layout="cc.layout"
      :total="dataRef['PagerTotal']"
      :current-page="dataRef['PagerAutoGenPage'] + 1"
      :page-size="dataRef['PagerAutoGenSize']"
      :page-sizes="cc.pageSizes"
      @size-change="dataRef['PagerPageSizeChange']"
      @current-change="dataRef['PagerPageChange']"
  />
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name:'CellPager',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
