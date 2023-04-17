<template>
  <cg-viewer-icon
      :cell-config="cellConfigTrans()"
  ></cg-viewer-icon>
</template>

<script>
import MixinCellViewerConfig from "@/components/types/mixins/MixinCellViewerConfig.vue";
import CgViewerIcon from "@/components/types/viewer/CgViewerIcon.vue";

export default {
  name: "CgViewerIconBoolean",
  components: {CgViewerIcon},
  mixins: [MixinCellViewerConfig],
  methods:{
    cellConfigTrans(){
      if(this.cellConfig){
        return {class: 'el-icon-check', style: 'color:green;'}
      }else{
        return {class: 'el-icon-close', style: 'color:red;'}
      }
    }
  },
  created() {
    this.initComponentConfig()
  }
}
</script>