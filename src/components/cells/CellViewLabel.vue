<template>
  <span v-if="fieldValue">
    <el-popover v-if="fieldSchema.hover" trigger="hover">
      <span v-if="hoverContent.plain">{{hoverContent.content}}</span>
      <span v-else v-html="hoverContent.content"></span>
      <span slot="reference" v-if="!isPlainObject(fieldValue)" >{{fieldValue}}</span>
      <span slot="reference" v-else-if="fieldValue.html" v-html='fieldValue.html' :style="fieldValue.style"></span>
      <span slot="reference" v-else :style="fieldValue.style">{{ (fieldValue.label || fieldValue.title) || fieldValueFormatted }}</span>
    </el-popover>
    <template v-else>
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
    hoverContent(){
      let ret = this.fieldSchema.hover
      if(jsb.isFunction(this.fieldSchema.hover)){
        ret = this.fieldSchema.hover({parent:this.data})
      }
      if(jsb.isString(ret)){
        return {
          content:ret,
          plain:true
        }
      }
      return ret
    }
  }
}
</script>