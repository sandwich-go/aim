<template>
  <div>
      <span v-if="fieldValueFormatted">
        <template v-for="(item,index) of _val">
          <el-tag
              v-if="item.label"
              :key="index"
              size="mini"
              :style="item.style"
              @click.native="function(){ item.click && item.click()}"
              :type="item.type || 'info'"
              :effect="item.effect || 'light'">
              {{ item.label }}
          </el-tag>
        </template>
     </span>
  </div>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import {wrapAsTagList} from "@/components/utils/jsb";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellViewTag',
  mixins: [MixinCell],
  computed: {
    _val(){
      let tags = wrapAsTagList(this.fieldValueFormatted,this.optionsComputed)
      jsb.each(tags,(v,index)=>{
        v.style = v.style || {}
        if(index !== 0 && v.style["margin-left"]){
          v.style["margin-left"] = "3px"
          jsb.objectAssignNX(v.style,this.cc)
        }
      })
      return tags
    }
  },
  created() {
    this.ccMerge()
  },
}
</script>