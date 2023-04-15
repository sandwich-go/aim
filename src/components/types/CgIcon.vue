<template>
  <span v-if="cc">
    <template style="align-items: center" >
      <i v-if="isString(cc)" :class="cc"></i>
      <i v-else :class="cc.class || cc.icon" :style="cc.style || {}"></i>
      <span v-if="cc.label" style="padding-left: 9px">{{cc.label}}</span>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: "CgIcon",
  mixins: [MixinComponentConfig],
  methods: {
    isString,
  },
  created() {
    this.initComponentConfig()
  }
}
</script>