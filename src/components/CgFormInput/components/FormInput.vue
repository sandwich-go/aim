<template>
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
</template>

<script>
import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormInput',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>