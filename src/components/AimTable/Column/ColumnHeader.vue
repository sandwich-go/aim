<template>
  <span>
    <i v-if="fieldSchema.required" class="aim-required-icon"></i>
    <i v-if="fieldSchema.locked" class="el-icon-lock"></i>
    <cell-view-label-tooltip v-if="fieldSchema.tips" :cell-config="{label:fieldSchema.name,tips:fieldSchema.tips}"></cell-view-label-tooltip>
    <span v-else>{{fieldSchema.name}}</span>
  </span>
</template>

<script>

import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";

export default {
  name: 'ColumnHeader',
  components: {CellViewLabelTooltip},
  props: {
    fieldSchema: Object,
  },
}
</script>

<style>
.aim-required-icon {
  display: inline-block;
  color: #f56c6c;
  width: 0.4em;
  height: 1em;
  line-height: 1em;
  margin-right: 0.2em;
  font-weight: normal;
  font-size: 15px;
  position: relative;

  &:before {
    content: "*";
    position: absolute;
    left: 0;
    top: 0.4em;
  }
}
</style>