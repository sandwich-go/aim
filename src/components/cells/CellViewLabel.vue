<template>
  <span v-if="fieldValue">
      <span v-if="!isPlainObject(fieldValue)" >{{fieldValue}}</span>
      <span v-else-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title) || fieldValueFormatted }}</span>
  </span>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {isPlainObject} from "@/components/utils/jsb";

export default {
  name: 'CellViewLabel',
  mixins: [MixinCellViewConfig],
  methods: {
    isPlainObject,
  },
}
</script>