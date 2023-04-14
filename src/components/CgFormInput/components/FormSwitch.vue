<template>
  <el-switch
      v-model="data[fieldName()]"
      :active-color="cc.activeColor"
      :inactive-color="cc.inactiveColor"
      @change="change"
      :style="cc.style"
      :disabled="disabled">
  </el-switch>
</template>

<script>

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormSwitch',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    })
    console.log(this.cc)
  },
}
</script>
