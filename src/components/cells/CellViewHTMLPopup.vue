<template>
  <div v-if="fieldValue">
    <span v-if="isPlain()" v-html="content()"></span>
    <el-popover v-else trigger="hover">
      <span v-html="fieldValue"></span>
      <el-button slot="reference" size="mini"><i class="el-icon-document"/></el-button>
    </el-popover>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import jsb from "@sandwich-go/jsb";
export default {
  name: "CellViewHTMLPopup",
  mixins: [MixinCellViewConfig],
  methods:{
    isPlain(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'plain',true)
      }
      return false
    },
    content(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'content',this.fieldValue)
      }
      return this.fieldValue
    }
  }
}
</script>