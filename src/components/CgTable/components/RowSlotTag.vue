<template>
  <span v-if="fieldValueVirtual">
    <template v-if="!check(fieldValueVirtual)">
      {{ check(fieldValueVirtual) }}
    </template>
    <template v-for="(item,index) of fieldValueVirtual">
    <el-tag
        v-if="item.label"
        :key="index"
        size="mini"
        v-bind:style="tagStyleBind(item)"
        :type="item.type || 'info'"
        @click.native="function(){ item['Click'] && item['Click']({row,fieldSchema,fieldValue,fieldValueVirtual})}"
        :effect="item.effect || 'light'">
      {{ item.label }}
    </el-tag>
    </template>
  </span>
</template>

<script>
import MixinRowSlotProperty from "@/components/CgTable/components/mixin/MixinRowSlotProperty.vue";
import {getItemStyle} from "@/components/CgTable/table";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "RowSlotTag",
  mixins: [MixinRowSlotProperty],
  methods: {
    check(fieldValVirtual) {
      if (!jsb.isArray(fieldValVirtual)) {
        return "fieldValVirtual should be array"
      }
      return ''
    },
    tagStyleBind(item) {
      return getItemStyle(item,{"margin-right":"3px"})
    }
  }
}
</script>