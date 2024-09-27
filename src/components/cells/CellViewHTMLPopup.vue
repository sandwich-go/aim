<template>
  <div v-if="htmlContent">
    <span v-if="isPlainHTML" v-html="htmlContent"></span>
    <el-popover v-else trigger="hover">
      <span v-html="htmlContent"></span>
      <el-link v-if="title" slot="reference" size="mini">{{title}}</el-link>
      <el-link v-else slot="reference" size="mini" icon="el-icon-document"></el-link>
    </el-popover>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import jsb from "@cg-devcenter/jsb";
export default {
  name: "CellViewHTMLPopup",
  mixins: [MixinCellViewConfig],
  computed:{
    htmlContent(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'content',this.fieldValue)
      }
      return this.fieldValue
    },
    title(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'title')
      }
      return ''
    },
    isPlainHTML(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'plain',true)
      }
      return false
    }
  },
}
</script>