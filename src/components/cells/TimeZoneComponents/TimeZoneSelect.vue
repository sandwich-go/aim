<template>
  <el-select v-model="utcOffsetInner" size="mini" :style="selectStyle" @visible-change="onVisibleChange">
    <el-option
        v-for="s in timeZoneOptions"
        :key="s.value"
        :label="s.label"
        :value="s.value">
      <span>{{ s.label }}</span>
      <span v-if="s.comment" style="float:right;right: 0;gap: 3px;color:#707070;font-size:12px" v-html="s.label"/>
    </el-option>
  </el-select>
</template>

<script>
import {timeZoneOptions} from "@/components/cells/TimeZoneComponents/moment";

export default {
  name: 'TimeZoneSelect',
  props: {
    utcOffset: Number,
    selectStyle:{
      type:Object,
      default:()=>{return {width:"120px"}}
    },
    onVisibleChange:{
      type: Function,
      default: () => {
      }
    }
  },
  watch: {
    utcOffsetInner() {
      this.$emit("update:utcOffset", this.utcOffsetInner);
    }
  },
  data() {
    return {
      timeZoneOptions: timeZoneOptions,
      utcOffsetInner: this.utcOffset
    }
  }
}
</script>
