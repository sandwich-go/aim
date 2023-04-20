<template>
  <div class="cg-input-with-width" :style="cssVars">
    <el-input
        v-model="dataRef[fieldName]"
        :disabled="disabled"
        :placeholder="cc.placeholder"
        :style="cc.style"
        :rows="cc.rows"
        :autosize="cc.autoSize"
        :type="cc.type||''"
        @change="change"
        size="mini"
    >
    </el-input>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {CellNameInput} from "@/components/cells/const";
export default {
  name: CellNameInput,
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
  computed: {
    cssVars() {
      // 如果在table列中，且设定了列元素则主动撑满整个表格
      return {
        "--input-width":this.calcWidthPxString(),
        width:"100%"
      };
    }
  },
}
</script>

<style scoped>
.cg-input-with-width >>> .el-input {
  width: var(--input-width) !important;
}
</style>