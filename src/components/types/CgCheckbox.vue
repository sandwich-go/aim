<template>
  <el-checkbox
      v-model="dataRef[fieldName]"
      :border="cc.border"
      :style="cc.style"
      :disabled="disabled"
      size="mini"
      @change="change">
  </el-checkbox>
</template>

<script>

import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgCheckbox',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig({
          border: false,
          style: {
            width:null,// checkbox不应该设定宽度
          }
        }
    )
  },
}
</script>
