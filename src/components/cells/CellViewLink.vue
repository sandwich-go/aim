<template>
  <span v-if="fieldValueFormatted" style="align-items: center">
    <el-link v-bind="_val" @click="emitClick($event)">
      <cell-view-label v-if="_val.label" :formatter="()=>{return _val.label}"></cell-view-label>
    </el-link>
  </span>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import isObject from "@sandwich-go/jsb/isObject";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";
import jsb from "@sandwich-go/jsb";
import {assignWithMerge} from "@/components/utils/jsb";

export default {
  name: 'CellViewLink',
  components: {CellViewLabel},
  mixins: [MixinCell],
  computed: {
    _val(){
      let obj = {type :'primary',target:'_blank',href:'',label:''}
      if(jsb.isString(this.fieldValueFormatted)){
        obj.href = this.fieldValueFormatted
        obj.label = obj.href
      }else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      obj.label = obj.label || obj.href
      return obj
    }
  },
  created() {
    this.ccMerge()
  },
  methods: {
    isObject,
    emitClick(jsEvent) {
      if(this._val.click) {
        this._val.click({jsEvent})
      }
      if(this._val.code) {
        this.$emit('code-cell-click', this.emitData({
          code: this._val.code,
          jsEvent:jsEvent,
        }))
      }
    }
  }
}
</script>