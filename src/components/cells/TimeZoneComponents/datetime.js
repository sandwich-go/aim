import moment from "moment";
import jsb from "@cg-devcenter/jsb";
function todayLastSecond() {
  return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
}

export function datetimePickerOptionsLimitLength(options, limits) {
  options.onPick = function ({minDate}) {
    options.__pickerMinDateTime = minDate.getTime()
    options.__pickerMinDate = minDate
  }
  const oldDisableDate = options.disabledDate
  options.disabledDate = function (time) {
    if (options.__pickerMinDateTime) {
      let minTime = options.__pickerMinDateTime - limits
      let maxTime = options.__pickerMinDateTime + limits - 1000 //偏移1秒，最后一天的59:59
      let now = new Date()
      if (maxTime > now) {
        maxTime = todayLastSecond() // 截止到今天的23:59:59
      }
      return time.getTime() < minTime || time.getTime() > maxTime
    }
    if (oldDisableDate) {
      return oldDisableDate(time)
    }
    return false
  }
  return options
}

export function momentHumanizeForDatePicker(eventDuration, config) {
  const unit = jsb.pathGet(config, 'unit', "s")
  let eventMDuration = moment.duration(eventDuration, unit);
  if (eventMDuration.asMinutes() < 60) {
    return `${eventMDuration.asMinutes()}分钟`
  }
  if (eventMDuration.asHours() < 24) {
    return `${eventMDuration.asHours()}小时`
  }
  return `${eventMDuration.asDays()}天`
}

// 0 当天
export const defaultShortcuts = [-1, 1800, 3600 * 2, 3600 * 3, 3600 * 6, 3600 * 12, 3600 * 24, 3600 * 48, 3600 * 72, 3600 * 168, 3600 * 336, 3600 * 504]

export const TimeRangeTodayDiff = -1

export function defaultDatetimeShortcutsOptions() {
  let options = []
  jsb.each(defaultShortcuts,diff=>{
    options.push({label:diffSecondToText(diff),value:diff})
  })
  return options
}

export function diffSecondToText(diffSecond){
  if(diffSecond === TimeRangeTodayDiff){
    return "当天"
  }
  return `最近${momentHumanizeForDatePicker(diffSecond, {unit: "s"})}`
}
export function diffSecondToTimeRange(diffSecond) {
  let start = new Date()
  let end = new Date()
  if(diffSecond === TimeRangeTodayDiff){
     start = new Date(new Date().setHours(0, 0, 0));
     end = new Date(start.getTime() + (24 * 60 * 60 - 1) * 1000);
  }else{
    start.setTime(end.getTime() - diffSecond * 1000);
  }
  return [start,end,diffSecondToText(diffSecond),diffSecond]
}

export function datetimePickerOptionsPast(disableNext, shortcuts) {
  disableNext = disableNext === undefined ? false : disableNext
  shortcuts = shortcuts || defaultShortcuts
  let options = {shortcuts: []}
  for (const diff of shortcuts) {
    let option = diffSecondToTimeRange(diff)
    options.shortcuts.push({
      text: option[2], onClick(picker) {
        picker.$emit('pick', option)
      }
    })
  }
  if (disableNext) {
    options.disabledDate = function (time) {
      return time.getTime() > todayLastSecond();
    }
  }
  return options
}

const nextShorts = [{
  text: '后一周',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后一个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后三个月',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后半年',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 180);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后一年',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 365);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后两年',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 2);
    picker.$emit('pick', [start, end]);
  }
}, {
  text: '后三年',
  onClick(picker) {
    const end = new Date();
    const start = new Date();
    end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 3);
    picker.$emit('pick', [start, end]);
  }
}]

export function datetimePickerOptionsNext(disablePast,shortcuts) {
  disablePast = disablePast === undefined ? false : disablePast
  let options = {}
  if(shortcuts){
    options.shortcuts = nextShorts
  }
  if (disablePast) {
    options.disabledDate = function (time) {
      return time.getTime() < Date.now();
    }
  }
  return options
}
