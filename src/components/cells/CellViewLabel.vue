<template>
  <span v-if="fieldValue">
    <el-popover v-if="popover" :trigger="trigger">
      <span v-if="popoverContent.plain">{{popoverContent.content}}</span>
      <span v-else v-html="popoverContent.content"></span>
      <el-link v-if="triggerIcon" slot="reference" size="mini" :icon="triggerIcon" style="padding-right: 6px"></el-link>
      <template v-else>
        <span slot="reference" v-if="!isPlainObject(fieldValue)" >{{fieldValue}}</span>
        <span slot="reference" v-else-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
        <span slot="reference" v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title) || fieldValueFormatted }}</span>
      </template>
    </el-popover>
    <template v-if="!popover || triggerIcon">
      <span v-if="!isPlainObject(fieldValue)" >{{fieldValue}}</span>
      <span v-else-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title) || fieldValueFormatted }}</span>
    </template>
  </span>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import {isPlainObject} from "@/components/utils/jsb";
import jsb from "@cg-devcenter/jsb";
export default {
  name: 'CellViewLabel',
  mixins: [MixinCellViewConfig],
  methods: {
    isPlainObject,
  },
  computed:{
    popover() {
      return this.fieldSchema.popover
    },
    trigger(){
      return this.popoverContent.trigger || "hover"
    },
    triggerIcon(){
      if(this.popoverContent.icon){
        return jsb.isString(this.popoverContent.icon)?this.popoverContent.icon:"el-icon-document"
      }
      return ''
    },
    popoverContent(){
      let ret = this.fieldSchema.popover
      if(jsb.isFunction(this.fieldSchema.popover)){
        ret = this.fieldSchema.popover({parent:this.data,data:this.data})
      }
      if(jsb.isString(ret)){
        return {
          content:ret,
          plain:true,
        }
      }
      return ret || {}
    }
  }
}
</script>