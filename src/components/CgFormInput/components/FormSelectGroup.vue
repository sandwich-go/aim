<template>
  <el-select
             size="mini"
             :style="cc.style"
             v-model="dataRef[fieldName()]"
             :disabled="disabled"
             clearable
             @change="change">
    <el-option-group
        v-for="group in options()"
        :key="group.label"
        :label="group.label">
      <el-option
          v-for="optionItem in group.options"
          :key="optionItem.value"
          :label="optionItem.label"
          :disabled="optionItem.disabled"
          :value="optionItem.value"
      >
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormSelectGroup',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>
