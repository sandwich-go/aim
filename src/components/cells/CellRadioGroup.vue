<template>
  <el-radio-group v-model="dataRef[fieldName]" size="mini" :disabled="disabled">
    <el-radio-button v-for="option in optionsUsing"
                     :disabled="option.disabled"
                     :label="option.value"
                     :key="option.value">{{option.label}}</el-radio-button>
  </el-radio-group>
</template>
<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellRadioGroup',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPixString("100%")
  },
}
</script>
