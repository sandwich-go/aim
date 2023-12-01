<template>
  <aim-slider-input
      v-model="dataRef[fieldName]"
      v-bind="cellConfig"
  />
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import AimSliderInput from "@/components/AimSliderInput/index.vue";

export default {
  name: 'CellSlider',
  components: {AimSliderInput},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      min: -Infinity,
      max: Infinity,
      step: 1,
      showInput:true
    })
    this.calcWidthPixString("100%")
  },
}
</script>
