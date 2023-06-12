<template>
  <el-select
      :style="cc.style"
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      clearable
      size="mini"
      @change="change">
    <el-option-group
        v-for="group in optionsComputed"
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

import MixinCell from "@/components/cells/mixins/MixinCell.vue";

export default {
  name: 'CellSelectGroup',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
  },
}
</script>
