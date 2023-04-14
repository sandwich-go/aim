<template>
  <el-select size="mini"
             v-model="dataRef[fieldName()]"
             :disabled="disabled"
             :style="cc.style"
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

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormSelect',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>
