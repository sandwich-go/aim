<template>
  <el-date-picker
      :disabled="disabled"
      v-model="dataRef[fieldName]"
      type="datetime"
      :default-time="cc.defaultTime"
      :placeholder="cc.placeholder"
      :picker-options="cc.pickerOptions"
      :value-format="cc.valueFormat"
      :format="cc.format"
      @input="input"
      @change="change"
      size="mini"
      :style="cc.style"
  >
  </el-date-picker>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import jsb from "@cg-devcenter/jsb";

export default {
  name: 'CellDatePicker',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      defaultTime: "00:00:00",
      placeholder: "选择日期时间"
    }, ["valueFormat", "format"])
    this.calcWidthPixString("100%")
    this.myDisabledDate = jsb.pathGet(this.cc, "pickerOptions.myDisabledDate", undefined)
  },
  data() {
    return {
      myDisabledDate: undefined // 禁用时间使用
    }
  },
  methods: {
    input(timestamp) {
      const {startDate} = this.myDisabledDate || {}
      if (startDate) {
        this.$set(this.cc.pickerOptions, 'selectableRange',
            this.isSameDay(new Date(timestamp), startDate()) ? this.getSelectableRange() : "00:00:00 - 23:59:59"
        )
      }
    },
    isSameDay(t1, t2) {
      const d1 = new Date(t1), d2 = new Date(t2);
      return d1.getFullYear() === d2.getFullYear()
          && d1.getMonth() === d2.getMonth()
          && d1.getDate() === d2.getDate();
    },
    getSelectableRange() {
      const now = new Date()
      let futureTime = now
      if (typeof this.myDisabledDate.startDate == 'function') {
        futureTime = new Date(this.myDisabledDate.startDate())
      }
      const startTime = Math.max(futureTime.getTime(),
          new Date(now).setHours(0, 0, 0, 0)
      )
      return `${new Date(startTime).toTimeString().slice(0, 8)} - 23:59:59`
    }
  },
}
</script>
