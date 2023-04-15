const jsb = require("@sandwich-go/jsb")

export function parseWidthToPixelString(width,text,fixAddWidth=0){
    const widthString = String(width)
    if(widthString.endsWith("px")){
        return widthString
    }
    if(widthString === 'fit'){
        return `${jsb.textWidth(text)+60+fixAddWidth}px`
    }
    return `${parseInt(width)}px`
}

export const ReservedColorList = [
    "#1E90FF", // 适中的蓝色
    "#00CED1", // 暗青色
    "#8FBC8F", // 暗海洋绿色
    "#FFB6C1", // 浅粉红色
    "#E6E6FA", // 淡紫色
    "#F5DEB3", // 小麦色
    "#00FF7F", // 绿黄色
    "#B0E0E6", // 粉蓝色
    "#CD5C5C",  // 印度红色
    "#FF5733", // 红色
    "#FFC300", // 橙色
    "#32CD32", // 绿色
    "#00BFFF", // 深天蓝色
    "#9370DB", // 紫色
    "#FF69B4", // 粉色
    "#DC143C", // 猩红色
    "#7FFFD4", // 碧绿色
    "#FF7F50", // 珊瑚色
    "#FFD700", // 金色
    "#FF6347", // 番茄色
    "#8B008B", // 暗洋红色
    "#00FFFF", // 青色
    "#FF1493", // 深粉红色
    "#A52A2A", // 棕色
    "#8B0000", // 深红色
    "#006400", // 暗绿色
    "#FF4500", // 橙红色
    "#800080", // 紫罗兰色
    "#FF8C00", // 暗橙色
    "#FFFF00", // 黄色
];
