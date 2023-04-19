<template>
  <el-checkbox
      v-model="dataRef[fieldName]"
      :border="cc.border"
      :style="cc.style"
      :disabled="disabled"
      size="mini"
      @change="change">
    {{cc.label}}
  </el-checkbox>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgCheckbox',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
          border: false,
          style: {
            width:null,// checkbox不应该设定宽度
          }
        }
    )
  },
}
</script>
