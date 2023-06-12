<template>
  <el-checkbox
      v-bind="cc"
      v-model="dataRef[fieldName]"
      :disabled="disabled"
      @change="change">
    {{cc.label}}
  </el-checkbox>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";
export default {
  name: 'CellCheckbox',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
          border: false,
          style: {
            width:null,// checkbox不应该设定宽度
          }
        }
    )
  },
}
</script>
