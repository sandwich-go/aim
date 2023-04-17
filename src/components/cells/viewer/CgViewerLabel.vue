<template>
  <span v-if="fieldValue">
    <template v-if="isString(fieldValue)">{{fieldValue}}</template>
    <template v-else>
      <span v-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{fieldValue.label || fieldValue.title}}</span>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";

export default {
  name: "CgViewerLabel",
  methods: {isString},
  mixins: [MixinCellViewerConfig],
}
</script>