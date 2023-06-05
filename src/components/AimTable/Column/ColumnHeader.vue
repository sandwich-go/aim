<template>
  <span v-if="name">
    <i v-if="!ignoreRequired&&fieldSchema.required" class="aim-required-icon"></i>
    <i v-if="fieldSchema.locked" class="el-icon-lock"></i>
    <cell-view-label-tooltip
        v-if="fieldSchema['tips'] || fieldSchema['tipsHTML']"
        :cell-config="{
          label:name,
          tips:fieldSchema['tips'],
          tipsHTML:fieldSchema['tipsHTML']
        }"></cell-view-label-tooltip>
    <el-tooltip v-else-if="tipSlotName(fieldSchema)" effect="light">
      <div slot="content">
        <slot :name="getProxyTipSlotName(fieldSchema)" :field-schema="fieldSchema"></slot>
      </div>
      <span><i class="el-icon-info"></i>{{ name }}</span>
    </el-tooltip>
    <span v-else>{{ name }}</span>
  </span>
</template>

<script>

import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";
import {getProxyTipSlotName, tipSlotName} from "@/components/AimTable/slot";

export default {
  name: 'ColumnHeader',
  methods: {getProxyTipSlotName, tipSlotName},
  components: {CellViewLabelTooltip},
  props: {
    fieldSchema: Object,
    name:String,
    ignoreRequired:Boolean
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