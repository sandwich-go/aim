<template>
  <el-select
      :style="cc.style"
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      clearable
      :loading="inOptionLoading"
      size="mini"
      @change="change">
    <el-option-group
        v-for="group in getOptions()"
        :key="group.label"
        :label="group.label">
      <el-option
          v-for="optionItem in group.options"
          :key="optionItem.key || optionItem.value"
          :label="optionItem.label"
          :disabled="optionItem.disabled"
          :value="optionItem.value">
        <span>{{ optionItem.label }}</span>
        <span v-if="optionItem.comment" style="float:right;right: 0;gap: 3px;color:dodgerblue;font-size:12px" v-html="optionItem.comment"/>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellSelectGroup',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
