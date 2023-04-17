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
import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";
import {ReservedColorList} from "@/utils/ui";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CgInput',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig({
      style: {width:null},
      predefineColors:jsb.cc('predefineColors',ReservedColorList)
    })
  },
}
</script>