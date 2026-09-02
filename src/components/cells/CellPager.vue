<template>
  <el-alert v-if="totalAlert" type="warning" size="mini" :closable="false">
    <span slot="title" v-html="dataRef['PagerTotal']"></span>
  </el-alert>
  <div v-else-if="canTogglePagination" class="aim-cell-pager-with-toggle">
    <el-checkbox
        :value="dataRef['PagerVisible']"
        size="mini"
        @change="dataRef['PagerTogglePagination']"
    >显示分页</el-checkbox>
    <el-pagination
        v-if="dataRef['PagerVisible']"
        :background="cc.background"
        :layout="cc.layout"
        :total="dataRef['PagerTotal']"
        :current-page="dataRef['PagerAutoGenPage'] + 1"
        :page-size="dataRef['PagerAutoGenSize']"
        :page-sizes="cc.pageSizes"
        @size-change="dataRef['PagerPageSizeChange']"
        @current-change="dataRef['PagerPageChange']"
    />
    <span v-else-if="cc.showTotal" class="aim-cell-pager-total">共 {{ dataRef['PagerTotal'] }} 条</span>
  </div>
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
    canTogglePagination() {
      return !!this.cc.paginationToggle && !!this.cc.isLocal && !!this.cc.infiniteScroll
    },
    totalAlert(){
      return jsb.isString(this.dataRef['PagerTotal'])
    }
  },
  created() {
    this.ccConfigMerge()
  },
}
</script>

<style scoped>
.aim-cell-pager-with-toggle {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.aim-cell-pager-with-toggle .el-pagination {
  float: none;
}

.aim-cell-pager-total {
  color: #606266;
  font-size: 13px;
  white-space: nowrap;
}
</style>
