<template class="filter-input" :style="cssVars">
  <el-input
      clearable
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      :placeholder="cc.placeholder"
      @change="change"
      size="mini"
  >
  </el-input>
</template>

<script>
import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgInput',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig()
  },
  computed: {
    cssVars() {
      return {
        "--input-width": this.cc.style.width
      };
    }
  },
}
</script>
<!--<style lang="scss" scoped>-->
<style scoped>
.filter-input >>> .el-input {
  width: var(--input-width) !important;
}
</style>