<template>
  <span v-if="fieldValueFormatted">
    <el-alert disabled :closable="false" :style="_val.style"></el-alert>
  </span>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
import {assignWithMerge} from "@/components/utils/jsb";

export default {
  name: "CellViewColor",
  mixins:[MixinCell],
  computed: {
    _val() {
      // fixme 显示在表格内的时候设定高度，外部传入，同表格行高度，暂时写死
      let obj = {style:{'border-radius':0,background:''}}
      if (jsb.isString(this.fieldValueFormatted)) {
        obj.style.background = this.fieldValueFormatted
      } else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      assignWithMerge(obj,this.cc,['style'])
      obj.style.background = obj.style.background || obj.color
      return obj
    }
  },
  created() {
    this.ccMerge()
  }
}
</script>