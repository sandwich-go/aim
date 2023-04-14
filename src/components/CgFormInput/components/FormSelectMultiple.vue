<template>
  <el-select
      v-model="dataRef[fieldName()]"
      multiple
      :style="cc.style"
      filterable
      default-first-option
      :disabled="disabled"
      clearable
      @change="change">
    <el-option v-for="(val,idx) in options()"
               :value="val.value"
               :key="idx"
               :disabled="val.disabled"
               :label="val.label"></el-option>
  </el-select>
</template>

<script>

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormSelectMultiple',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      style:{},
      change:function (valNew){
        this.$emit("input",valNew)
      }
    })
  },
}
</script>
