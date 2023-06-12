<template>
  <el-button :disabled="disabled" v-bind="_val"  @click="click($event)" :icon="icon()" :type="type()">
    <template v-if="!_val.circle">{{ _val.label }}</template>
  </el-button>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
import {makeCellFromString} from "@/components/cells/make";
import {assignWithMerge} from "@/components/utils/jsb";
export default {
  name: 'CellViewButton',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
  },
  computed: {
    _val() {
      let obj = {size:"mini",label:''}
      if (jsb.isString(this.fieldValueFormatted)) {
        obj = makeCellFromString(this.fieldValueFormatted,{cell:'CellViewButton'})
      }else{
        obj = Object.assign(obj,this.fieldValueFormatted)
      }
      assignWithMerge(obj,this.cc,['style'])
      return obj
    }
  },
  methods:{
    click(jsEvent) {
      this.stateSwitch = !this.stateSwitch
      this.emitClick(jsEvent)
    },
    icon(){
      return this.getStateSwitch()?(this._val.iconTrue||this._val.icon):this._val.icon
    },
    type(){
      return this.getStateSwitch()?(this._val.typeTrue||this._val.type):this._val.type
    },
    getStateSwitch(){
      return this.useInnerStateSwitch?this.stateSwitch:this.dataRef[this.fieldName]
    },
  },
  data(){
    return {
      stateSwitch:false,
      useInnerStateSwitch: this.fieldName && this.dataRef,
    }
  },
}
</script>
