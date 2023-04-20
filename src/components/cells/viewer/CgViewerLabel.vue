<template>
  <span v-if="fieldValue">
    <template v-if="!isPlainObject(fieldValue)">{{fieldValue}}</template>
    <template v-else>
      <span v-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{fieldValue.label || fieldValue.title}}</span>
    </template>
  </span>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import {isPlainObject} from "@/utils/jsb";
import {CellNameLabel} from "@/components/cells/const";

export default {
  name: CellNameLabel,
  methods: {isPlainObject},
  mixins: [MixinCellViewerConfig],
}
</script>