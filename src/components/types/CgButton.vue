<template>
  <el-button
      :disabled="disabled"
      :style="cc.style"
      :icon="cc.icon"
      :type="cc.type"
      :plain="cc.plain"
      :circle="cc.circle"
      size="mini"
      @click="emitClick($event)"
  >
    <template v-if="!cc.circle">{{cc.label ? cc.label : ""}}</template>
  </el-button>
</template>

<script>

import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";
import {makeButton} from "@/components/types/types";

export default {
  name: 'CgButton',
  mixins: [MixinCellEditorConfig],
  created() {
    this.initComponentConfig(makeButton())
  },
  methods:{
    emitClick(jsEvent){
      this.$emit('code-button-click',{code:this.cc.code,jsEvent:jsEvent})
    }
  }
}
</script>
