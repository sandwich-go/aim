<template>
  <span v-if="cc">
    <template v-for="(item,index) of wrapArray(cc)">
    <el-tag
        v-if="item.label"
        :key="index"
        size="mini"
        v-bind:style="tagStyleBind(item)"
        :type="item.type || 'info'"
        :effect="item.effect || 'light'">
      {{ item.label }}
    </el-tag>
    </template>
  </span>
</template>

<script>
import {getItemStyle} from "@/components/CgTable/table";
import {wrapArray} from "@/utils/jsb";
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: "CgTag",
  mixins: [MixinComponentConfig],
  methods: {
    wrapArray,
    tagStyleBind(item) {
      return getItemStyle(item,{"margin-right":"3px"})
    }
  },
  created() {
    this.initComponentConfig()
  }
}
</script>