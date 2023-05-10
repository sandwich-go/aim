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
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {isPlainObject} from "@/components/utils/jsb";

export default {
  name: "CellViewIcon",
  mixins: [MixinCellViewConfig],
  methods: {
    isPlainObject,
  },
  created() {
    this.ccConfigMerge()
  }
}
</script>