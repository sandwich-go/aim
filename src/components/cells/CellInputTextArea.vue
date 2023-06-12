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
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import CellInput from "@/components/cells/CellInput.vue";
export default {
  name: 'CellInputTextArea',
  components: {CellInput},
  mixins: [MixinCell],
  created() {
    if(!this.cellConfig){
      this.cellConfig = {}
    }
    this.cellConfig.type = 'textarea'
    this.cellConfig.size = 1
  }
}
</script>