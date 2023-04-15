<template>
  <el-button
      :disabled="disabled"
      :style="cc.style"
      :icon="cc.icon"
      :type="cc.type"
      :plain="cc.plain"
      :circle="cc.circle"
      size="mini"
      @click="emitClick"
  >
    <template v-if="!cc.circle">{{cc.label ? cc.label : ""}}</template>
  </el-button>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";
import {makeButton} from "@/components/types/types";

export default {
  name: 'CgButton',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig(makeButton())
  },
  methods:{
    emitClick(){
      this.$emit('code-button-click',{code:this.cc.code,scope:this.cc})
    }
  }
}
</script>
