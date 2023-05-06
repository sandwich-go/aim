import {flexEndStyle, flexStartStyle} from "@/components/AimTable/style";

const jsb = require("@sandwich-go/jsb");

export function initToolbarConfig(configRef,styleToMerge={}) {
    configRef  = jsb.objectAssignNX(configRef,{
        enable: true,
        style: {},
        leftSpan: 19,
        leftCells: [],
        rightSpan: 0,
        rightCells: [],
    })
    configRef.leftStyle = jsb.objectAssignNX(configRef.leftStyle,flexStartStyle)
    configRef.rightStyle = jsb.objectAssignNX(configRef.flexEndStyle,flexEndStyle)
    if(!styleToMerge['padding-right']){
        styleToMerge['padding-right'] = '3px'
    }
    configRef.style = jsb.objectAssignNX(configRef.style,styleToMerge)
    return configRef
}

// toolbar 分左右时，如果左侧无数据则，则右的span返回24以便于flex end
export function  directionToolbarSpan(configData, direction) {
    if (direction === 'left') {
        return configData.leftCells.length === 0 ? 0 : configData.leftSpan
    }
    return configData.leftCells.length === 0 ? 24 : (configData.rightSpan || 24 - configData.leftSpan)
}