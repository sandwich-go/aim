<template>
  <div v-if="htmlContent">
    <span v-html="htmlContent"></span>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import jsb from "@cg-devcenter/jsb";

export default {
  name: "CellViewHTML",
  mixins: [MixinCellViewConfig],
  computed:{
    htmlContent(){
      if(jsb.isObjectOrMap(this.fieldValue)){
        return jsb.pathGet(this.fieldValue,'content',this.fieldValue)
      }
      return this.fieldValue
    },
  },
}
</script>