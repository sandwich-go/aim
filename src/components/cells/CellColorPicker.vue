<template>
  <el-color-picker
      v-model="dataRef[fieldName]"
      show-alpha
      :style="cc.style"
      size="mini"
      :predefine="colorPredefined"
      :disabled="disabled">
  </el-color-picker>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {ReservedColorList} from "@/components/utils/ui";
const jsb = require("@cg-devcenter/jsb")
export default {
  name: 'CellColorPicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      style: {width:null},
      predefine:jsb.ccPath('predefine',ReservedColorList)
    })
  },
  computed:{
    colorPredefined(){
      return this.cc.predefine || jsb.cc.colorPredefined
    }
  }
}
</script>