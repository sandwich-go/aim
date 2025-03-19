<template>
  <div style="display: inline-block;align-content: end">
    <el-date-picker
        v-if="type==='datetimerange'"
        ref="datePicker"
        v-model="dateTimeRange"
        type="datetimerange"
        size="mini"
        :disabled="disabled"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptionsUsing"
    />
    <el-date-picker
        v-else ref="datePicker"
        v-model="dateTime"
        type="datetime"
        size="mini"
        :disabled="disabled"
        :placeholder="placeholder"
        :picker-options="pickerOptionsUsing"
    />
    <time-zone-tag-with-select
        :utc-timezone-offset-minutes="utcTimezoneOffsetMinutesUsing"
        :on-time-zone-change="(v)=>{utcTimezoneOffsetMinutesUsing=v}"
    ></time-zone-tag-with-select>
  </div>
</template>
<script>
import {datetimePickerOptionsNext} from "@/components/cells/TimeZoneComponents/datetime";
import {
  convertDateWithTimeZoneToTimestamp,
  convertTimestampDateToTimezone,
  DatetimeFormatWithoutTimezone,
  getSystemTimezone,
} from "@/components/cells/TimeZoneComponents/timezone";
import moment from "moment";
import TimeZoneTagWithSelect from "@/components/cells/TimeZoneComponents/TimeZoneTagWithSelect.vue";

export default {
  name: 'TimeZoneDatetimePicker',
  components: {TimeZoneTagWithSelect},
  props: {
    timestampRange: Array,
    timestamp: [Number, String],
    disabled: Boolean,
    placeholder: String,
    type: {
      type: String,
      default: "datetimerange",
    },
    defaultTime: {
      type: Array,
      default: () => {
        return ['00:00:00']
      }
    },
    // 默认采用系统设定的时区信息
    utcTimezoneOffsetMinutes: {
      type: Number,
      default: getSystemTimezone()
    },
    pickerOptions: {
      type: Object,
    },
    // fixme 兼容 ab test 目前使用的字符串存储的range数据
    outValueTypeString: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    timestamp(newValue) {
      this.update(newValue)
    },
    timestampRange(newValue) {
      this.update(newValue)
    },
    dateTimeRange: {
      handler() {
        let value = []
        if (this.dateTimeRange && this.dateTimeRange.length >= 2) {
          value = [this.toValTimestamp(this.dateTimeRange[0]), this.toValTimestamp(this.dateTimeRange[1])]
        }
        this.$emit("update:timestampRange", value);
      },
      deep: true
    },
    dateTime() {
      this.$emit("update:timestamp", this.toValTimestamp(this.dateTime));
    },
    utcTimezoneOffsetMinutesUsing() {
      this.cleanData()
    },
  },
  created() {
    this.cleanData()
  },
  data() {
    return {
      DatetimeFormatWithoutTimezone,
      dateTimeRange: [],
      dateTime: '',
      showTimezoneSelect: false,
      timestampRangeInner: this.timestampRange,
      // 查看场景下，如果逻辑层未设定时间戳，默认值0 或者空，这里不应该更新为moment().unix()
      timestampInner: (this.timestamp === null || this.timestamp === undefined) ? moment().unix() : this.timestamp,
      pickerOptionsUsing: this.pickerOptions || datetimePickerOptionsNext(false, this.type === 'datetimerange'),
      utcTimezoneOffsetMinutesUsing: this.utcTimezoneOffsetMinutes
    }
  },
  methods: {
    // 外层数据多次调整主动感应数据变动，如数据未变动则不更新，防止update事件触发的更新避免死循环
    update(v) {
      if (v === undefined) {
        return
      }

      let changed = false
      if (this.type === 'datetimerange') {
        if (!this._arraysAreEqual(this.timestampRangeInner, v)) {
          this.timestampRangeInner = v
          changed = true
        }
      } else {
        if (this.timestampInner !== v) {
          this.timestampInner = v
          changed = true
        }
      }
      if (changed) {
        this.cleanData()
      }
    },
    _arraysAreEqual(arr1, arr2) {
      if (arr1 === undefined || arr2 === undefined) {
        return false;
      }

      if (arr1.length !== arr2.length) {
        return false;
      }

      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false;
        }
      }

      return true;
    },
    toValTimestamp(val) {
      const value = convertDateWithTimeZoneToTimestamp(val, this.utcTimezoneOffsetMinutesUsing)
      return this.outValueTypeString ? String(value) : value
    },
    // 格式化为element组件支持的字符串日期，移除时区概念(element组件会认作UTC+8,使用者按照设定时区操作)
    cleanData() {
      if (this.type === 'datetimerange') {
        if (this.timestampRangeInner && this.timestampRangeInner.length >= 2) {
          this.dateTimeRange = [
            convertTimestampDateToTimezone(this.timestampRangeInner[0], this.utcTimezoneOffsetMinutesUsing).format(DatetimeFormatWithoutTimezone),
            convertTimestampDateToTimezone(this.timestampRangeInner[1], this.utcTimezoneOffsetMinutesUsing).format(DatetimeFormatWithoutTimezone)
          ]
        } else {
          this.dateTimeRange = []
        }
      } else {
        if (this.timestampInner) {
          this.dateTime = convertTimestampDateToTimezone(this.timestampInner, this.utcTimezoneOffsetMinutesUsing).format(DatetimeFormatWithoutTimezone)
        } else {
          this.dateTime = ""
        }
      }
    },
  },
}
</script>
