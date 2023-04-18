<template>
  <span>
    <template v-if="fieldValue">
      <template style="align-items: center">
        <i v-if="!isPlainObject(fieldValue)" :class="fieldValue"></i>
        <i v-else :class="fieldValue.class || fieldValue.icon" :style="fieldValue.style || {}"></i>
        <span v-if="fieldValue.label" style="padding-left: 9px">{{ fieldValue.label }}</span>
      </template>
    </template>
    <template v-else>
      <i :class="fieldValue"></i>
    </template>
  </span>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import {isPlainObject} from "@/utils/jsb";

export default {
  name: "CgViewerIcon",
  mixins: [MixinCellViewerConfig],
  methods: {
    isPlainObject,
  },
  created() {
    this.ccConfigMerge()
  }
}
</script>