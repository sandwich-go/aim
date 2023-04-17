<template>
  <el-switch
      v-model="data[fieldName]"
      :active-color="cc.activeColor"
      :inactive-color="cc.inactiveColor"
      @change="change"
      size="mini"
      :disabled="disabled">
  </el-switch>
</template>

<script>

import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CgSwitch',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    })
  },
}
</script>
