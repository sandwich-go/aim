<template>
  <row-slot-icon
      :row="row"
      :field-schema="fieldSchema"
      :field-value="fieldValue"
      :field-value-virtual="fieldValueVirtualTrans()"
  ></row-slot-icon>
</template>

<script>
import RowSlotIcon from "@/components/CgTable/components/RowSlotIcon.vue";
import MixinRowSlotProperty from "@/components/CgTable/components/mixin/MixinRowSlotProperty.vue";

export default {
  name: "RowSlotIconTrueFalse",
  components: {RowSlotIcon},
  mixins:[MixinRowSlotProperty],
  methods:{
    fieldValueVirtualTrans(){
      if(this.fieldValueVirtual){
        return {class: 'el-icon-check', style: 'color:green;'}
      }else{
        return {class: 'el-icon-close', style: 'color:red;'}
      }
    }
  }
}
</script>