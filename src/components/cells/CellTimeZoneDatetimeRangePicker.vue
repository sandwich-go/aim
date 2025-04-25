<template>
  <time-zone-datetime-picker
      :disabled="disabled"
      :timestamp.sync="dataRef[fieldName]"
      type="datetimerange"
      :placeholder="cc.placeholder"
      :pickerOptions="cc.pickerOptions"
      :utcTimezoneOffsetMinutes="cc.utcTimezoneOffsetMinutes"
      @change="change"
      size="mini"
      :style="cc.style"
  >
  </time-zone-datetime-picker>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import TimeZoneDatetimePicker from "@/components/cells/TimeZoneComponents/TimeZoneDatetimePicker.vue";
import jsb from "@cg-devcenter/jsb";

export default {
  components: {TimeZoneDatetimePicker},
  name: 'CellTimeZoneDatetimeRangePicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间",
      pickerOptions: {},
      utcTimezoneOffsetMinutes: jsb.pathGet(this.dataRef, 'utcTimezoneOffsetMinutes', 0)
    })
    this.calcWidthPixString("100%")
  },
}
</script>
