import momentTimeZone from 'moment-timezone';

//convertTimestampDateToTimezone 将给定的时间戳或者字符串转换为目标时区的时间
export function convertTimestampDateToTimezone(tsOrTimeStr, utcOffset) {
    if(!isNaN(tsOrTimeStr)){
         return momentTimeZone.unix( Number(tsOrTimeStr)).utcOffset(utcOffset)
    }
    const timestamp = Number(Date.parse(tsOrTimeStr)/1000)
    return momentTimeZone.unix(timestamp).utcOffset(utcOffset)
}

// dateStrWithoutTimezone为不带时区标记的日期字符串，将其转化到时间戳
export function convertDateWithTimeZoneToTimestamp(dateStrWithoutTimezone,utcOffset){
    // 如果dateStrWithoutTimezone中带有时区，将其移除
    const cleanDateStr = cleanTimezone(dateStrWithoutTimezone)
    // 追加时区
    const dateStr = `${cleanDateStr} ${utfOffsetMinutesToName(utcOffset)}`
    return Number(Date.parse(dateStr)/1000)
}

export const DatetimeFormatWithoutTimezone= "YYYY-MM-DD HH:mm:ss"
export const DatetimeFormatWithTimezone= "YYYY-MM-DD HH:mm:ss [GMT]Z"

export function utfOffsetMinutesToName(offset) {
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');

    return `GMT${sign}${hoursString}:${minutesString}`;
}

function cleanTimezone(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
