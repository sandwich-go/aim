<template>
  <el-checkbox
      v-model="dataRef[fieldName]"
      :border="cc.border"
      :style="cc.style"
      :disabled="disabled"
      :size="cc.size"
      @change="change">
  </el-checkbox>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgCheckbox',
  mixins: [MixinComponentConfig],
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
