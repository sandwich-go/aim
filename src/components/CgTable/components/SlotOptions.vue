<template>
  <el-select size="mini" v-model="dataValue" :style="scopeData.style" @change="scopeData.change">
    <el-option
        v-for="option in scopeData.options"
        :key="option.value"
        :label="option.label"
        :value="option.value">
    </el-option>
  </el-select>
</template>

<script>

export default {
  name: 'SlotOptions',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      dataValue :null,
      scopeData:{
        options:[],
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
