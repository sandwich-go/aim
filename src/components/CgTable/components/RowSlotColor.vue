<template>
  <span v-if="fieldValueVirtual">
    <div class="cgc-color-bg-sub-item" v-bind:style="{background:fieldValueVirtual}"></div>
  </span>
</template>

<script>
import MixinRowSlotProperty from "@/components/CgTable/mixin/MixinRowSlotProperty.vue";


export default {
  name: "RowSlotIcon",
  mixins:[MixinRowSlotProperty],
  methods: {
    check() {
      return ''
    },
  }
}
</script>

<style scoped>
.cgc-color-bg-sub-item {
  border: 1px solid lightgray;
  width: 16px;
  height: 16px;
  display: inline-block;
}
</style>