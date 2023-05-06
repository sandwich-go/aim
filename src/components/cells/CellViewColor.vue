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
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";

export default {
  name: "CellViewColor",
  mixins:[MixinCellViewConfig],
}
</script>