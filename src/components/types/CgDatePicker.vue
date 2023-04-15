<template>
  <el-date-picker
      :disabled="disabled"
      v-model="dataRef[fieldName]"
      type="datetime"
      :default-time="cc.defaultTime"
      :placeholder="cc.placeholder"
      @change="change"
      :size="cc.size"
      :style="cc.style"
  >
  </el-date-picker>
</template>

<script>

import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgSelect',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    })
  },
}
</script>
