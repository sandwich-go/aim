const jsb = require("@sandwich-go/jsb");
const {flexStartStyle, flexEndStyle} = require("@/components/CgTable/default");

export function initToolbarConfig(configRef,options={}) {
    configRef  = jsb.objectAssignNX(configRef,{
        enable: true,
        style: {'padding-bottom': '9px'},
        leftSpan: 19,
        leftCells: [],
        leftColumnStyle: flexStartStyle,
        rightSpan: 0,
        rightCells: [],
        rightColumnStyle: flexEndStyle,
    })
    return Object.assign(configRef,options)
}

// toolbar 分左右时，如果左侧无数据则，则右的span返回24以便于flex end
export function  directionToolbarSpan(configData, direction) {
    if (direction === 'left') {
        return configData.leftCells.length === 0 ? 0 : configData.leftSpan
    }
    return configData.leftCells.length === 0 ? 24 : (configData.rightSpan || 24 - configData.leftSpan)
}