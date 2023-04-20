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
import {CellNameSwitch} from "@/components/cells/const";

export default {
  name: CellNameSwitch,
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    })
  },
}
</script>
