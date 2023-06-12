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

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name:'CellPager',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
  },
}
</script>
