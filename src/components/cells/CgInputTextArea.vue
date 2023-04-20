<template>
  <cg-input
      :data="data"
      :field-name="fieldName"
      :options="options"
      :cell-config="cellConfig"
      :style-base="styleBase"
      :style-override="styleOverride"
      :disabled="disabled"/>
</template>


<script>
import CgInput from "@/components/cells/CgInput.vue";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {CellNameInputTextArea} from "@/components/cells/const";

export default {
  name: CellNameInputTextArea,
  components: {CgInput},
  mixins: [MixinCellEditorConfig],
  created() {
    if(!this.cellConfig){
      this.cellConfig = {}
    }
    this.cellConfig.type = 'textarea'
    this.cellConfig.size = 1
  }
}
</script>