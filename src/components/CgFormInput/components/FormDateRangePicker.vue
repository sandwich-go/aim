<template>
  <el-date-picker
      v-model="dataRef[fieldName()]"
      type="datetimerange"
      :disabled="disabled"
      :default-time="cc.defaultTime"
      :style="cc.style"
      :range-separator="cc.rangeSeparator"
      :picker-options="cc.pickerOptions"
      :start-placeholder="cc.startPlaceholder"
      :end-placeholder="cc.endPlaceholder"
      @change="change"
  >
  </el-date-picker>
</template>

<script>

import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";

export default {
  name: 'FormSelect',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      startPlaceholder:'开始时间',
      endPlaceholder:'开始时间',
      rangeSeparator:'~',
      defaultTime:['00:00:00','23:59:59'],
      pickerOptions:{},
    })
  },
}
</script>
