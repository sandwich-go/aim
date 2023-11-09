<template>
  <div v-if="fieldValue">
    <el-popover trigger="hover">
      <span v-html="fieldValue"></span>
      <el-button slot="reference" size="mini"><i class="el-icon-document"/></el-button>
    </el-popover>
    <span v-html="fieldValue"></span>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";

export default {
  name: "CellViewHTMLPopup",
  mixins: [MixinCellViewConfig],
}
</script>