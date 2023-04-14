<template>
  <span v-if="fieldValueVirtual">
    <template v-if="!check(fieldValueVirtual)">
      {{ check(fieldValueVirtual) }}
    </template>
    <i :class="fieldValueVirtual.class || fieldValueVirtual.icon" :style="fieldValueVirtual.style"></i>
  </span>
</template>

<script>
import MixinRowSlotProperty from "@/components/CgTable/mixin/MixinRowSlotProperty.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "RowSlotIcon",
  mixins:[MixinRowSlotProperty],
  methods: {
    check(fieldValVirtual) {
      if (!jsb.isPlainObject(fieldValVirtual)) {
        return "fieldValVirtual should be object"
      }
      return ''
    },
  }
}
</script>