<template>
  <el-select
      :style="cc.style"
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      clearable
      size="mini"
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
          :value="optionItem.value">
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgSelectGroup',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>
