<template>
  <cg-viewer-icon
      :cell-config="cellConfigTrans()"
  ></cg-viewer-icon>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import CgViewerIcon from "@/components/cells/viewer/CgViewerIcon.vue";

export default {
  name: "CgViewerIconBoolean",
  components: {CgViewerIcon},
  mixins: [MixinCellViewerConfig],
  methods:{
    cellConfigTrans(){
      if(this.fieldValue){
        return {class: 'el-icon-check', style: 'color:green;'}
      }else{
        return {class: 'el-icon-close', style: 'color:red;'}
      }
    }
  },
  created() {
    this.ccConfigMerge()
  }
}
</script>