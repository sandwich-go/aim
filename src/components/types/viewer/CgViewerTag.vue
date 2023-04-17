<template>
  <span v-if="cellConfig">
    <template v-for="(item,index) of wrapAsTagList(cellConfig,getOptions())">
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
import MixinCellViewerConfig from "@/components/types/mixins/MixinCellViewerConfig.vue";
import {wrapAsTagList} from "@/utils/jsb";

export default {
  name: "CgViewerTag",
  mixins: [MixinCellViewerConfig],
  methods: {
    wrapAsTagList,
    tagStyleBind(item) {
      return getItemStyle(item,{"margin-right":"3px"})
    }
  },
}
</script>