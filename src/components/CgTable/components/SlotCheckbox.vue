<template>
  <el-checkbox size="mini"
               v-model="dataValue"
               :style="scopeData.style"
               :label="scopeData.label || scopeData.title"
               :border="scopeData.border"
               @change="scopeData.change">
  </el-checkbox>
</template>

<script>

export default {
  name: 'SlotCheckbox',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      dataValue :null,
      scopeData:{
        label:'',
        title:'',
        border:true,
        style:{},
        change:function (valNew){
          this.$emit("input",valNew)
        }
      }
    }
  },
  created() {
    this.scopeData = Object.assign(this.scopeData,this.scope)
  },
  watch:{
    value:{
      handler(val){
        this.dataValue = val
      },
      immediate:true,
    }
  },
}
</script>
