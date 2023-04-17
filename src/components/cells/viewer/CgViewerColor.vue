<template>
  <span v-if="fieldValue">
    <div
        class="cgc-color-bg-sub-item"
        v-bind:style="{background:fieldValue}"
    ></div>
  </span>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";

export default {
  name: "CgViewerColor",
  mixins:[MixinCellViewerConfig],
}
</script>

<style scoped>
.cgc-color-bg-sub-item {
  border: 1px solid lightgray;
  width: 100%;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
