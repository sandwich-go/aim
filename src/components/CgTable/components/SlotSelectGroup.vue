<template>
  <el-select
      v-model="scopeData.value"
      v-bind:style="scopeData.style"
      size="mini"
      @change="scopeData.change"
      :placeholder="scopeData.placeholder"
  >
    <el-option-group
        v-for="group in scopeData.options"
        :key="group.label"
        :label="group.label">
      <el-option
          v-for="optionscope in group.options"
          :key="optionscope.value"
          :label="optionscope.label"
          :value="optionscope.value"
      >
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  name: 'SlotSelectGroup',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      scopeData:{
        placeholder:'',
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
}
</script>
