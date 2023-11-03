<template>
  <div>
      <span v-if="!isNullUndefined(fieldValue)">
        <template v-for="(item,index) of wrapAsTagList(fieldValue,optionsUsing)">
          <el-tag
              v-if="item.label"
              :key="index"
              size="mini"
              :style="cc.style"
              @click.native="function(){ item.click && item.click()}"
              :type="item.type || item.tagType || 'info'"
              :effect="item.effect|| item.tagEffect || 'light'">
              {{ item.label }}
          </el-tag>
        </template>
     </span>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {wrapAsTagList} from "@/components/utils/jsb";
import jsb from "@sandwich-go/jsb";
export default {
  name: 'CellViewTag',
  mixins: [MixinCellViewConfig],
  created() {
    this.ccConfigMerge({style:{"margin-right": "3px"}})
  },
  methods: {
    wrapAsTagList,
    isNullUndefined(v){
      return jsb.isUndefined(v) || jsb.isNull(v)
    }
  },
}
</script>