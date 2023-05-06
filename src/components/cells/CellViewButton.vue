<template>
  <el-button :disabled="disabled" v-bind="cc" size="mini" @click="emitClick($event)">
    <template v-if="!cc.circle">{{ cc.label ? cc.label : "" }}</template>
  </el-button>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
export default {
  name: 'CellViewButton',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
}
</script>
