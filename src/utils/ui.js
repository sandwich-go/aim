const jsb = require("@sandwich-go/jsb")

export function parseWidthToPixelString(width,text){
    const widthString = String(width)
    if(widthString.endsWith("px")){
        return widthString
    }
    if(widthString === 'fit'){
        return `${jsb.textWidth(text)+40}px`
    }
    return `${parseInt(width)}px`
}