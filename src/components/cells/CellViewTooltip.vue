<template>
  <el-tooltip effect="light" placement="top-start">
    <template v-if="isString(fieldValue)">
      <span><i class="el-icon-info"></i></span>
      <template slot="content">
        <span v-html='fieldValue'></span>
      </template>
    </template>
    <template v-else>
      <span><i class="el-icon-info"></i>
        <span v-if="fieldValue.labelSub" class="aim-title-sub-container" :style="fieldValue.containerStyleForSub || {}">
          <span class="aim-title-sub-main">{{ fieldValue.label }}</span>
          <span class="aim-title-sub-info">{{ fieldValue.labelSub }}</span>
        </span>
        <span v-else>
        {{fieldValue.label}}</span>
        </span>
      <template slot="content">
        <span v-if="fieldValue.tips" v-html='fieldValue.tips'></span>
        <span v-if="fieldValue.tipsHTML" v-html='fieldValue.tipsHTML'></span>
      </template>
    </template>
  </el-tooltip>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import isString from "@sandwich-go/jsb/isString";

export default {
  name: "CellViewTooltip",
  methods: {isString},
  mixins: [MixinCellViewConfig],
}
</script>
