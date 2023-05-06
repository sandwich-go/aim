<template>
  <div>
      <span v-if="fieldValue">
        <template v-for="(item,index) of wrapAsTagList(fieldValue,getOptions())">
          <el-tag
              v-if="item.label"
              :key="index"
              size="mini"
              :style="cc.style"
              :type="item.type || 'info'"
              :effect="item.effect || 'light'">
              {{ item.label }}
          </el-tag>
        </template>
     </span>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {wrapAsTagList} from "@/utils/jsb";

export default {
  name: 'CellViewTag',
  mixins: [MixinCellViewConfig],
  created() {
    this.ccConfigMerge({style:{"margin-right": "3px"}})
  },
  methods: {
    wrapAsTagList,
  },
}
</script>