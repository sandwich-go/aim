<template>
  <div disabled="inline-flex">
    <cell-input :as-image="true" v-bind="$props"></cell-input>
  </div>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import CellInput from "@/components/cells/CellInput.vue";

export default {
  name: "CellInputImage",
  components: {CellInput},
  mixins: [MixinCell],
}
</script>