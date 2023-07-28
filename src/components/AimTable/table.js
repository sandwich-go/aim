import {AimFormInputMode2Title} from "@/components/AimFormInput";
import {defaultRow} from "@/components/AimTable/schema";

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


export function removeCtrlData(row) {
    delete row.___aim_table_ctrl_data
    return row
}

export function rowFormEditorTitle(mode) {
    return AimFormInputMode2Title[mode]
}

function autoOption(parent, fieldVal) {
    if (!parent.options) {
        parent.options = []
    }
    const optionIndex = jsb.findIndexOf(parent.options, function (option) {
        return option.value === fieldVal
    })
    if (optionIndex === -1) {
        parent.options.push({label: fieldVal, value: fieldVal})
    }
}

function autoOptionFunc(autoOption,fieldVal){
    if(jsb.isFunction(autoOption)){
        return autoOption(fieldVal)
    }
    return jsb.wrapArray(fieldVal)
}


export function cleanData(data, schema,item2Row) {
    jsb.each(data, function (item, index) {
        // 检查数据的ctrl字段，填充组件需要的控制性数据
        let row = mustCtrlData(item2Row ? item2Row(item) : item)
        row = defaultRow(schema, row)
        jsb.each(schema, function (fieldSchema) {
            // 自动为filter准备option
            const fieldVal = row[fieldSchema.field]
            if (!fieldVal) {
                return
            }
            const filterAutoOption = jsb.pathGet(fieldSchema, 'filter.autoOption', false)
            if (filterAutoOption) {
                jsb.each(autoOptionFunc(filterAutoOption,fieldVal),option=>{
                    autoOption(fieldSchema.filter, option)
                })
            }
            const schemaAutoOption = jsb.pathGet(fieldSchema, 'autoOption', false)
            if (schemaAutoOption) {
                jsb.each(autoOptionFunc(schemaAutoOption,fieldVal),option=>{
                    autoOption(fieldSchema, option)
                })
            }
        })
        data[index] = row
    })
    return data
}
