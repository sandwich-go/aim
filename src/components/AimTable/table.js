import {AimFormInputMode2Title} from "@/components/AimFormInput";
const jsb = require("@sandwich-go/jsb")


// inplace模式下的编辑直接在table内显示编辑控件，可以设定一个按钮将某一行设定为编辑状态与否
// inplace模式下不允许启用Form编辑表单

export const EditTriggerManual = "manual"      // 手动点击按钮触发，接收按钮code为: CodeButtonRowEdit
export const EditTriggerClick = "click"        // 激活编辑状态方式，单击行启动编辑模式
export const EditTriggerDBLClick = "dbClick"  // 激活编辑状态方式，双击行启动编辑模式
export const EditTriggerManualAndDBLClick = "dbClick-manual" // 手动按钮或双击方式触发编辑

export const EditModeInplaceNoTrigger = 'inplaceNoTrigger' // 就地编辑,不需要trigger,默认都是可编辑状态，数据量较大时不要使用该方式
export const EditModeInplace = 'inplace'                   // 就地编辑,默认显示为禁用的编辑控件，数据量较大时不要使用该方式
export const EditModeFormInput = 'formInput'               // 使用form input方式编辑,数据量较大时推荐该方式


export const CtrlDataInRowData = '___aim_table_ctrl_data'
export const EventCurrentRowChange = 'EventCurrentRowChange'

export function aimTableError(title,message='') {
    console.error(`AimTable Error  >> | ${title} ${message}`)
}
export function aimTableWarn(title,message='') {
    console.warn(`AimTable Warn  >> | ${title} ${message}`)
}
export function aimTableLog(title, message='') {
    console.log(`AimTable Debug   >> | ${title} ${message}`)
}

export function isModeInplace(mode) {
    return mode === EditModeInplaceNoTrigger || mode === EditModeInplace
}

export function xidRow(row) {
    return jsb.pathGet(row, `${CtrlDataInRowData}.xid`)
}
export function copyRow(row){
    let newRow = jsb.clone(row)
    newRow = removeCtrlData(newRow)
    return mustCtrlData(newRow)
}

export function mustCtrlData(row) {
    if(!jsb.eqNull(xidRow(row))){
        return row
    }
    if (!row[CtrlDataInRowData]) {
        row[CtrlDataInRowData] = {}
    }
    row[CtrlDataInRowData].xid = row[CtrlDataInRowData].xid || jsb.xid()
    return row
}

export function removeCtrlData(obj) {
    delete obj.___aim_table_ctrl_data
    // 递归obj的每一个值
    jsb.each(obj,v=>{
        if(jsb.isVisitable(v)){
            removeCtrlData(v)
        }
    })
    return obj
}

export function rowFormEditorTitle(mode) {
    return AimFormInputMode2Title[mode]
}

