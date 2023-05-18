<template>
  <el-tooltip effect="light" placement="top-start">
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
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import isString from "@sandwich-go/jsb/isString";

export default {
  name: "CellViewTooltip",
  methods: {isString},
  mixins: [MixinCellViewConfig],
}
</script>
