<template>
  <span v-if="fieldValue">
    <template v-if="!isPlainObject(fieldValue)">{{fieldValue}}</template>
    <template v-else>
      <span v-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title)|| fieldValueFormatted()}}</span>
    </template>
  </span>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {isPlainObject} from "@/components/utils/jsb";

export default {
  name: 'CellViewLabel',
  methods: {isPlainObject},
  mixins: [MixinCellViewConfig],
  created() {
    console.log("fieldValue ",this.fieldValue,this.fieldValueFormatted(),this.data, this.fieldName)
  }
}
</script>