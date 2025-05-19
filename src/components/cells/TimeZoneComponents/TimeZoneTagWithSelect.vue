<template>
  <div style="display: inline-block">
    <time-zone-select v-if="showTimezoneSelect"
                      id="time-zone-select"
                      style="margin-left: -4px"
                      :on-visible-change="(v)=>{ if(!v){showTimezoneSelect=false}}"
                      :utc-offset.sync="utcTimezoneOffsetMinutesUsing"></time-zone-select>
    <el-tooltip v-else effect="light" :content="tooltip">
      <time-zone-tag id="time-zone-tag"
                     @click.native="showTimezoneSelect=true"
                     tag-style="font-weight:bold"
                     :utc-timezone-offset-minutes="utcTimezoneOffsetMinutesUsing" />
    </el-tooltip>
  </div>
</template>
<script>
import TimeZoneTag from "@/components/cells/TimeZoneComponents/TimeZoneTag.vue";
import TimeZoneSelect from "@/components/cells/TimeZoneComponents/TimeZoneSelect.vue";
import {getSystemTimezone} from "@/components/cells/TimeZoneComponents/timezone";

export default {
  name: 'TimeZoneTagSelect',
  components: {TimeZoneSelect, TimeZoneTag},
  props:{
    // 默认采用系统设定的时区信息
    utcTimezoneOffsetMinutes:{
      type:Number,
      default:getSystemTimezone()
    },
    onTimeZoneChange:Function,
    tooltip:{
      type:String,
      default:'点击调整当前组件使用的时区'
    },
  },
  watch:{
    utcTimezoneOffsetMinutesUsing(){
      this.onTimeZoneChange && this.onTimeZoneChange(this.utcTimezoneOffsetMinutesUsing)
    }
  },
  mounted() {
    window.addEventListener('click', this.handleClick);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleClick);
  },
  methods:{
    handleClick(event) {
      const targetElement = event.target;
      if(targetElement && targetElement.id !== 'time-zone-select' && targetElement.id !== 'time-zone-tag'){
        this.showTimezoneSelect =false
      }
    }
  },
  data() {
    return {
      showTimezoneSelect: false,
      utcTimezoneOffsetMinutesUsing:this.utcTimezoneOffsetMinutes
    }
  }
}
</script>
