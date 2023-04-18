<template>
  <el-select
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      size="mini"
      @change="change">
    <el-option
        v-for="option in getOptions()"
        :key="option.value"
        :label="option.label"
        :value="option.value">
    </el-option>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgSelect',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
