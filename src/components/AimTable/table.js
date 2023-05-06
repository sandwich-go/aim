import {AimFormInputMode2Title} from "@/components/AimFormInput";
import {defaultRow} from "@/components/AimTable/schema";

const jsb = require("@sandwich-go/jsb")


// inplace模式下的编辑直接在table内显示编辑控件，可以设定一个按钮将某一行设定为编辑状态与否
// inplace模式下不允许启用Form编辑表单
export const EditTriggerSwitchButton = "EditTriggerSwitchButton" // 激活编辑状态方式，按钮切换
export const EditTriggerClick = "EditTriggerClick" // 激活编辑状态方式，单击行
export const EditTriggerDBLClick = "EditTriggerDBLClick"// 激活编辑状态方式，双击行
export const EditTriggerDBLClickOrSwitcher  = "EditTriggerDBLClickOrSwitcher"
export const EditTriggerInplaceNone = 'EditTriggerInplaceNone' //inplace模式下开放编辑

export const EventCurrentRowChange = 'EventCurrentRowChange'

export const RowEditorInplace = 'RowEditorInplace'
export const RowEditorFormInput = 'RowEditorFormInput'

export const CtrlDataInRowData ='___x_table_ctrl_data'

export function xidRow(row){
    return jsb.pathGet(row,`${CtrlDataInRowData}.xid`)
}
export function mustCtrlData(row){
    if(!row[CtrlDataInRowData]){
        row[CtrlDataInRowData] = {}
    }
    row[CtrlDataInRowData].xid = row[CtrlDataInRowData].xid || jsb.xid()
    return row
}
export function removeCtrlData(row){
    delete row[CtrlDataInRowData]
    return row
}

export function rowFormEditorTitle(mode){
    return AimFormInputMode2Title[mode]
}

function autoOption(fieldSchema,fieldVal){
    if(!fieldSchema.filter.options){
        fieldSchema.filter.options = []
    }
    const optionIndex = jsb.findIndexOf(fieldSchema.filter.options,function (option){
        return option.value === fieldVal
    })
    if(optionIndex === -1){
        fieldSchema.filter.options.push({label: fieldVal, value: fieldVal})
    }
}


export function cleanData (data,schema,item2Row) {
    jsb.each(data,function(item,index){
        // 检查数据的ctrl字段，填充组件需要的控制性数据
        let row = mustCtrlData(item2Row?item2Row(item):item)
        row = defaultRow(schema,row)
        jsb.each(schema,function (fieldSchema) {
            // 自动为filter准备option
            if(jsb.pathGet(fieldSchema,'filter.autoOption',false)){
                const fieldVal = row[fieldSchema.field]
                if(!fieldVal){
                    return
                }
                autoOption(fieldSchema,fieldVal)
            }
        })
        data[index] = row
    })
    return data
}
