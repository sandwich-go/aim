<template>
  <el-switch
      v-model="data[fieldName]"
      :active-color="cc.activeColor"
      :inactive-color="cc.inactiveColor"
      @change="change"
      size="mini"
      :disabled="disabled">
  </el-switch>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {boolProcess} from "@/components/cells/types";
export default {
  name: 'CellSwitch',
  mixins: [MixinCellEditorConfig],
  created() {
    this.data[this.fieldName] = boolProcess({value:this.data[this.fieldName]})
    this.ccConfigMerge({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    },["activeColor", "inactiveColor"])
  },
}
</script>
