<template>
  <el-checkbox
      v-model="dataRef[fieldName]"
      :border="cc.border"
      :style="cc.style"
      :disabled="disabled"
      size="mini"
      @change="change">
    {{cc.label}}
  </el-checkbox>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {boolProcess} from "@/components/cells/types";
export default {
  name: 'CellCheckbox',
  mixins: [MixinCellEditorConfig],
  created() {
    this.data[this.fieldName] = boolProcess({value:this.data[this.fieldName]})
    this.ccConfigMerge({
          border: false,
          style: {
            width:null,// checkbox不应该设定宽度
          }
        }
    )
  },
}
</script>
