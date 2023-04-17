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

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {makeButton} from "@/components/cells/types";
import {code2OptionsMapping} from "@/components/CgTable/table";

export default {
  name: 'CgButton',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.cc = Object.assign(this.cc,makeButton(code2OptionsMapping[this.cc.code],this.cc))
  },
  methods:{
    emitClick(jsEvent){
      this.$emit('code-cell-click',{code:this.cc.code,jsEvent:jsEvent})
    }
  }
}
</script>
