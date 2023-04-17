<template>
  <el-color-picker
      v-model="dataRef[fieldName]"
      show-alpha
      :style="cc.style"
      size="mini"
      :predefine="cc.predefineColors"
      :disabled="disabled">
  </el-color-picker>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {ReservedColorList} from "@/utils/ui";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CgInput',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      style: {width:null},
      predefineColors:jsb.cc('predefineColors',ReservedColorList)
    })
  },
}
</script>