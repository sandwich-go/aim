<template>
  <el-alert v-bind="_val"/>
</template>

<script>
import {parseWidthToPixelString} from "@/components/utils/ui";
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
import {assignWithMerge} from "@/components/utils/jsb";
export default {
  name: 'CellViewAlert',
  mixins: [MixinCell],
  props: {
    center: {
      type: Boolean,
      default: null
    },
  },
  computed: {
    _val() {
      let obj = {
        title: '',
        center: this.center,
        type: 'warning',
        size:"mini",
        effect: 'dark',
        style: {height:'28px'},
        closable: false,
        showIcon: true
      }
      if (jsb.isString(this.fieldValueFormatted)) {
        obj.title = this.fieldValueFormatted
      } else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      assignWithMerge(obj,this.cc,['style'])
      obj.title = obj.title || obj.label
      if (obj.style['width']) {
        obj.style['width'] = parseWidthToPixelString(obj.style['width'], obj.label, this.cc.showIcon ? 30 : 0)
      }
      return obj
    }
  },
  created() {
    this.ccMerge()
  },
}
</script>
