<template>
  <time-zone-datetime-picker
      :disabled="disabled"
      :timestamp.sync="dataRef[fieldName]"
      type="datetime"
      :default-time="cc.defaultTime"
      :placeholder="cc.placeholder"
      @change="change"
      size="mini"
      :style="cc.style"
  >
  </time-zone-datetime-picker>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import TimeZoneDatetimePicker from "@/components/cells/TimeZoneComponents/TimeZoneDatetimePicker.vue";

export default {
  components: {TimeZoneDatetimePicker},
  name: 'CellTimeZoneDatetimePicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    })
    this.calcWidthPixString("100%")
  },
}
</script>
