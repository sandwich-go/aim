<template>
  <cell-select-group
      v-bind="$props"
      v-if="isOptionsGroup()">
  </cell-select-group>
  <el-select
      v-else
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      :style="cc.style"
      :loading="inOptionLoading"
      size="mini"
      clearable
      @change="change">
    <el-option
        v-for="option in getOptions()"
        :key="option.key || option.value"
        :label="option.label"
        :disabled="option.disabled"
        :value="option.value">
      <span>{{ option.label }}</span>
      <span v-if="option.comment" style="float:right;right: 0;gap: 3px;color:#707070;font-size:12px" v-html="option.comment"/>
    </el-option>
  </el-select>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellSelectGroup from "@/components/cells/CellSelectGroup.vue";

export default {
  name: 'CellSelect',
  components: {CellSelectGroup},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPixString("100%")
  },
  methods:{
    isOptionsGroup(){
      const options  = this.getOptions()
      const firstElement =options[0] || {}
      return !!firstElement['options'];
    }
  }
}
</script>
