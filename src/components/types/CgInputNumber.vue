<template>
  <el-input-number
      v-model="dataRef[fieldName]"
      :min="cc.min"
      :max="cc.max"
      :step="cc.step"
      :disabled="disabled"
      :style="cc.style"
      @change="change"
      size="mini"
  ></el-input-number>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgInputNumber',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      min: -Infinity,
      max: Infinity,
      step: 1,
    })
  },
}
</script>
