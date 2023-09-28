<template>
  <span v-if="fieldValue">
      <span v-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title)|| fieldValueFormatted}}</span>
  </span>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";

export default {
  name: 'CellViewLabel',
  mixins: [MixinCellViewConfig],
}
</script>