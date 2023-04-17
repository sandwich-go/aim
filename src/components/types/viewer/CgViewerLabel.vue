<template>
  <span v-if="cellConfig">
    <template v-if="isString(cellConfig)">{{cellConfig}}</template>
    <template v-else>
      <span v-if="cellConfig.html" v-html='cellConfig.html' :style="cellConfig.style"></span>
      <span v-else :style="cellConfig.style">{{cellConfig.label || cellConfig.title}}</span>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinCellViewerConfig from "@/components/types/mixins/MixinCellViewerConfig.vue";

export default {
  name: "CgViewerLabel",
  methods: {isString},
  mixins: [MixinCellViewerConfig],
}
</script>