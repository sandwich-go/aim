<template>
  <el-checkbox
      v-model="dataRef[fieldName()]"
      :border="cc.border"
      :style="cc.style"
      :disabled="disabled"
      @change="change">
  </el-checkbox>
</template>

<script>

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormCheckbox',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({border: false, style: {position:'absolute',left: 0}})
  },
}
</script>
