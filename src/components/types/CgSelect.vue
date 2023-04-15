<template>
  <el-select
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      :size="cc.size"
      @change="change">
    <el-option
        v-for="option in options()"
        :key="option.value"
        :label="option.label"
        :value="option.value">
    </el-option>
  </el-select>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgSelect',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>
