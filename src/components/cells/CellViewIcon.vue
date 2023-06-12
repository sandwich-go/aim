<template>
  <span>
    <template v-if="fieldValueFormatted">
      <template style="align-items: center">
        <i v-bind="_val"></i>
        <span v-if="_val.label" style="padding-left: 9px">{{ _val.label }}</span>
      </template>
    </template>
  </span>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import {assignWithMerge} from "@/components/utils/jsb";
import jsb from "@sandwich-go/jsb";

export default {
  name: "CellViewIcon",
  mixins: [MixinCell],
  computed: {
    _val() {
      // fixme 显示在表格内的时候设定高度，外部传入，同表格行高度，暂时写死
      let obj = {class: ''}
      if (jsb.isString(this.fieldValueFormatted)) {
        obj.class = this.fieldValueFormatted
      } else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      obj.class = obj.class || obj.class.icon
      return obj
    }
  },
  created() {
    this.ccMerge()
  }
}
</script>