<template>
  <el-alert v-if="totalAlert" type="warning" size="mini" :closable="false">
    <span slot="title" v-html="dataRef['PagerTotal']"></span>
  </el-alert>
  <el-pagination
      v-else
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
import jsb from "@cg-devcenter/jsb";

export default {
  name:'CellPager',
  mixins: [MixinCellEditorConfig],
  computed: {
    totalAlert(){
      return jsb.isString(this.dataRef['PagerTotal'])
    }
  },
  created() {
    this.ccConfigMerge()
  },
}
</script>
