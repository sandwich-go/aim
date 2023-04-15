<template>
  <span v-if="fieldValueVirtual">
    <template style="align-items: center" >
      <i v-if="isString(fieldValueVirtual)" :class="fieldValueVirtual"></i>
      <i v-else :class="fieldValueVirtual.class || fieldValueVirtual.icon" :style="fieldValueVirtual.style || {}"></i>
      <span v-if="fieldValueVirtual.label" style="padding-left: 3px">{{fieldValueVirtual.label}}</span>
    </template>
  </span>
</template>

<script>
import MixinRowSlotProperty from "@/components/CgTable/components/mixin/MixinRowSlotProperty.vue";
import {isString} from "xe-utils";

export default {
  name: "RowSlotIcon",
  mixins: [MixinRowSlotProperty],
  methods: {
    isString,
  }
}
</script>