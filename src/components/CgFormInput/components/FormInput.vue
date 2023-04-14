<template>
  <div class="filter-input" :style="cssVars">
    <el-input
        size="mini"
        clearable
        v-model="dataRef[fieldName()]"
        :disabled="disabled"
        :style="cc.style"
        :placeholder="cc.placeholder"
        @change="change"
    >
    </el-input>
  </div>
</template>

<script>
import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormInput',
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
