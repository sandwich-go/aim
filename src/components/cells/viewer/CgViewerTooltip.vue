<template>
  <el-tooltip class="item" effect="light" placement="top-start">
    <template v-if="isString(fieldValue)">
      <span><i class="el-icon-info"></i></span>
      <template slot="content">
        <span v-html='fieldValue'></span>
      </template>
    </template>
    <template v-else>
      <span><i class="el-icon-info"></i>{{fieldValue.label}}</span>
      <template slot="content">
        <span v-html='fieldValue.tips'></span>
      </template>
    </template>
  </el-tooltip>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import {isString} from "xe-utils";

export default {
  name: "CgViewerLabelTooltip",
  mixins: [MixinCellViewerConfig],
  methods: {
    isString,
  },
}
</script>
