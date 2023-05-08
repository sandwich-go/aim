<template>
  <div class="cell-input-with-width" :style="cssVars">
    <el-input
        v-model="dataRef[fieldName]"
        v-bind="cc"
        :disabled="disabled"
        @change="change"
        size="mini"
    ></el-input>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
export default {
  name: 'CellInput',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
  computed: {
    cssVars() {
      // 如果在table列中，且设定了列元素则主动撑满整个表格
      return {
        "--input-width": this.calcWidthPxString() || '100%',
        width:"100%"
      };
    }
  },
}
</script>

<style scoped>
.cell-input-with-width >>> .el-input {
  width: var(--input-width) !important;
}
</style>