import momentTimeZone from 'moment-timezone';
import moment from 'moment'
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export const timeZoneOptions = momentTimeZone.tz
  .names()
  .map((name) => {
    const now = Date.now();
    const zone = moment.tz.zone(name);
    return { name, offset: zone !== null ? zone.utcOffset(now) : 0 };
  })
  .sort((a, b) =>
    a.offset === b.offset
      ? a.name.localeCompare(b.name)
      : b.offset - a.offset
  )
  .map((zone) => {
    return {
      value: moment.tz(zone.name).utcOffset(),
      label: `GMT ${moment.tz(zone.name).format('Z')}`,
    };
  })
    .filter(
        (value, index, self) =>
            index ===
            self.findIndex((t) => t.value === value.value) // Remove duplicates based on offset
    );

export function timeZoneGet(zoneName) {
  for(const item of timeZoneOptions) {
    if(item.value === zoneName) {
      return item
    }
  }
  return null
}
