<template>
  <el-pagination
      background
      :layout="cc.layout"
      :total="dataRef['PagerTotal']"
      :current-page="dataRef['PagerAutoGenPage'] + 1"
      :page-size="dataRef['PagerAutoGenSize']"
      @size-change="dataRef['PagerPageSizeChange']"
      @current-change="dataRef['PagerPageChange']"
  />
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'TablePager',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
