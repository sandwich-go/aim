<template>
  <span v-if="cc">
    <template v-if="isString(cc)">{{cc}}</template>
    <template v-else>
      <span v-if="cc.html" v-html='cc.html' :style="cc.style"></span>
      <span v-else :style="cc.style">{{cc.label || cc.title}}</span>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: "CgLabel",
  methods: {isString},
  mixins: [MixinComponentConfig],
}
</script>