<template>
  <el-select
      :style="cc.style"
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      clearable
      size="mini"
      @change="change">
    <el-option-group
        v-for="group in getOptions()"
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

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgSelectGroup',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
