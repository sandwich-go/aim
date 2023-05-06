<template>
  <cell-view-icon
      :cell-config="cellConfigTrans()"
  ></cell-view-icon>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";

export default {
  name: "CellViewBoolean",
  components: {CellViewIcon},
  mixins: [MixinCellViewConfig],
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