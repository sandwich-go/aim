<template>
  <span v-if="cellConfig">
    <template style="align-items: center" >
      <i v-if="isString(cellConfig)" :class="cellConfig"></i>
      <i v-else :class="cellConfig.class || cellConfig.icon" :style="cellConfig.style || {}"></i>
      <span v-if="cellConfig.label" style="padding-left: 9px">{{cellConfig.label}}</span>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinCellViewerConfig from "@/components/types/mixins/MixinCellViewerConfig.vue";

export default {
  name: "CgViewerIcon",
  mixins: [MixinCellViewerConfig],
  methods: {
    isString,
  },
  created() {
    this.initComponentConfig()
  }
}
</script>