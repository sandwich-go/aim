<template>
  <div>
      <span v-if="fieldValue">
        <template v-for="(item,index) of wrapAsTagList(fieldValue,getOptions())">
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
  </div>
</template>

<script>
import {getItemStyle} from "@/components/CgTable/table";
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import {wrapAsTagList} from "@/utils/jsb";
import {CellNameTag} from "@/components/cells/const";

export default {
  name: CellNameTag,
  mixins: [MixinCellViewerConfig],
  methods: {
    wrapAsTagList,
    tagStyleBind(item) {
      return getItemStyle(item, {"margin-right": "3px"})
    }
  },
}
</script>