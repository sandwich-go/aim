<template>
  <span v-if="fieldValue">
    <el-alert
        disabled
        :closable="false"
        v-bind:style="{background:fieldValue,'border-radius':0}"
    ></el-alert>
  </span>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";

export default {
  name: "CgViewerColor",
  mixins:[MixinCellViewerConfig],
}
</script>