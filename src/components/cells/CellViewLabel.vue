<template>
  <span v-if="fieldValueFormatted">
      <span v-if="_val.html" v-html='_val.html' :style="_val.style"></span>
      <span v-else :style="_val.style">{{ _val.label}}</span>
  </span>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
import {assignWithMerge} from "@/components/utils/jsb";

export default {
  name: 'CellViewLabel',
  mixins: [MixinCell],
  computed: {
    _val(){
      let obj = {label:''}
      if(jsb.isString(this.fieldValueFormatted)){
        obj.label = this.fieldValueFormatted
      }else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      obj.label = obj.label || obj.title || obj.text
      return obj
    }
  }
}
</script>