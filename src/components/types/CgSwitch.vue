<template>
  <el-switch
      :size="cc.size"
      v-model="data[fieldName]"
      :active-color="cc.activeColor"
      :inactive-color="cc.inactiveColor"
      @change="change"
      :style="cc.style"
      :disabled="disabled">
  </el-switch>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgSwitch',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    })
  },
}
</script>
