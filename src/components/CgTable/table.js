import {makeButton} from "@/components/types/types";

const jsb = require("@sandwich-go/jsb")


export const EditTriggerSwitchButton = "x-table-edit-trigger-switch-button" // 激活编辑状态方式，按钮切换
export const EditTriggerClick = "x-table-edit-trigger-click" // 激活编辑状态方式，单击行
export const EditTriggerDBLClick = "x-table-edit-trigger-dblclick"// 激活编辑状态方式，双击行
export const EditTriggerDBLClickOrSwitchButton  = "x-table-edit-trigger-dblclick-switch-button"


export const RowEditorForNew = "RowEditForNew"    // 增加新行
export const RowEditorForCopyPaste = "RowEditorForCopyPaste"    // 复制
export const RowEditorForUpdate = "RowEditorForUpdate"  // 更新需求
export const RowEditorForView = "RowEditorForView"   // 查看需求
export const RowEditorForRollback = "RowEditorForRollback"

export const EventCurrentRowChange = 'EventCurrentRowChange'

export const StaticStringDivider = 'divider'

export const RowEditorInplace = 'RowEditorInplace'
export const RowEditorFormInput = 'RowEditorFormInput'

export const CtrlDataInRowData ='___x_table_ctrl_data'

export function xidRow(row){
    return jsb.pathGet(row,`${CtrlDataInRowData}.xid`)
}
export function mustCtrlData(item){
    if(!item[CtrlDataInRowData]){
        item[CtrlDataInRowData] = {}
    }
    item[CtrlDataInRowData].xid = item[CtrlDataInRowData].xid || jsb.xid()
    return item
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
        const row = mustCtrlData(item2Row?item2Row(item):item)
        data[index] = row
        // 自动为filter准备option
        jsb.each(schema,function (fieldSchema) {
            if(!jsb.pathGet(fieldSchema,'filter.autoOption',false)){
                return;
            }
            const fieldVal = row[fieldSchema.field]
            if(!fieldVal){
                return
            }
            autoOption(fieldSchema,fieldVal)
        })
    })
    return data
}

export function getItemStyle(item,options){
    let style = jsb.pathGet(item,'style',{})
    jsb.each(options,function (val,key){
        if(jsb.eqNull(item[key])){
            style[key] = val
        }
    })
    return style
}

export function getProxySlotName(slotName){
    return `cg-table-proxy-slot-${slotName}`
}

// 快捷方式 只展现图标，code也就是shortcut的名称
export const ToolbarShortcutCodeRefresh = "refresh"
export const ToolbarShortcutCodeCustom = "custom"
export const ToolbarShortcutCodePrint = "print"
export const ToolbarShortcutCodeAdd = "add"

export const ToolbarShortcutCodeCopyField = "copyField"

// 快捷方式按钮属性映射
export const code2OptionsMapping = {}
code2OptionsMapping[ToolbarShortcutCodeAdd] = {icon:'el-icon-plus',type:'primary',code:ToolbarShortcutCodeAdd,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRefresh] = {icon:'el-icon-refresh',type:'primary',code:ToolbarShortcutCodeRefresh,circle:true}
code2OptionsMapping[ToolbarShortcutCodePrint] = {icon:'el-icon-s-grid',type:'primary',code:ToolbarShortcutCodePrint,circle:true}
code2OptionsMapping[ToolbarShortcutCodeCustom] = {icon:'el-icon-printer',type:'primary',code:ToolbarShortcutCodeCustom,circle:true}


export function fixToolbarItems(toolbarConfigData) {
    jsb.each(['leftItems','rightItems'],function (val){
        jsb.each(toolbarConfigData[val], function (codeOrItem, key) {
            // 纯字符串，认为是一个只有code按钮，内部如已设定了code的icon映射则直接使用
            if (jsb.isString(codeOrItem)) {
                toolbarConfigData[val][key] = makeButton(code2OptionsMapping[codeOrItem] || {code: codeOrItem})
            }
        })
    })
    return toolbarConfigData
}

export function fieldValueVirtual(row,fieldSchema,defaultVal){
    defaultVal = defaultVal || null
    const fieldValue = jsb.pathGet(row,fieldSchema.field,defaultVal)
    if(fieldSchema.valueVirtual){
        if (jsb.isFunction(fieldSchema.valueVirtual)){
            return fieldSchema.valueVirtual({row,fieldSchema,fieldValue})
        }
        return fieldSchema.valueVirtual
    }
    return fieldValue
}
export function filedViewConfig({row,fieldSchema,fieldValue}) {
    let fieldViewConfig = jsb.pathGet(fieldSchema, 'valueVirtual',{})
    if(jsb.isFunction(fieldViewConfig)){
        fieldViewConfig = fieldViewConfig({row,fieldSchema,fieldValue})
    }
    // 拷贝options字段
    fieldViewConfig.options = fieldViewConfig.options || fieldSchema.options
    return fieldViewConfig
}