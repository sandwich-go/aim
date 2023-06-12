<template>
  <el-color-picker
      v-bind="cc"
      v-model="dataRef[fieldName]"
      show-alpha
      :disabled="disabled">
  </el-color-picker>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import {ReservedColorList} from "@/components/utils/ui";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CellColorPicker',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
      style: {width:null},
      predefine:jsb.ccPath('predefine',ReservedColorList)
    })
  },
}
</script>