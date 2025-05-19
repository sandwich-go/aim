<template>
  <el-tag type="primary" size="medium" :style="tagStyle">{{`${utfOffsetMinutesToName(utcTimezoneOffsetMinutes)}`}}</el-tag>
</template>
<script>

import {getSystemTimezone, utfOffsetMinutesToName} from "./timezone";
export default {
  name: 'TimeZoneTag',
  methods: {utfOffsetMinutesToName},
  props:{
    utcTimezoneOffsetMinutes:{
      type:Number,
      default:getSystemTimezone(),
    },
    tagStyle:String,
  },
}
</script>