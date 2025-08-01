<template>
  <cell-view-icon
      v-if="fieldValue || !!falseIcon"
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
  computed: {
    falseIcon(){
      return this.fieldSchema?this.fieldSchema.falseIcon:'el-icon-close'
    },
  },
  methods:{
    cellConfigTrans(){
      if(this.fieldValue){
        return {class: 'el-icon-check', style: 'color:green;'}
      }else{
        return {class: this.falseIcon, style: 'color:red;'}
      }
    }
  },
  created() {
    this.ccConfigMerge()
  }
}
</script>