<template class="filter-input" :style="cssVars">
  <el-input
      clearable
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      :placeholder="cc.placeholder"
      @change="change"
      :size="cc.size"
  >
  </el-input>
</template>

<script>
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgInput',
  mixins: [MixinComponentConfig],
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