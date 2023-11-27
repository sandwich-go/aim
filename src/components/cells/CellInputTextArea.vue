<template>
  <cell-input
      :data="data"
      :field-name="fieldName"
      :options="options"
      :cell-config="cellConfig"
      :style-base="styleBase"
      :style-override="styleOverride"
      :disabled="disabled"/>
</template>


<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellInput from "@/components/cells/CellInput.vue";
export default {
  name: 'CellInputTextArea',
  components: {CellInput},
  mixins: [MixinCellEditorConfig],
  created() {
    if(!this.cellConfig){
      this.cellConfig = {}
    }
    this.cellConfig.type = 'textarea'
    if(!this.cellConfig.autosize){
      this.cellConfig.autosize={ minRows: 1}
    }
  }
}
</script>