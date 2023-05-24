<template>
  <div disabled="inline-flex">
    <cell-input
        :as-image="true"
        :cell-config="cellConfig"
        :field-schema="fieldSchema"
        :field-name="fieldName"
        :data="data"
        :options="options"
        :disabled="disabled"
    ></cell-input>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import CellInput from "@/components/cells/CellInput.vue";

export default {
  name: "CellInputImage",
  components: {CellInput},
  mixins: [MixinCellViewConfig],
}
</script>