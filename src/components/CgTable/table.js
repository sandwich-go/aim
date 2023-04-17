const jsb = require("@sandwich-go/jsb")


// inplace模式下的编辑直接在table内显示编辑控件，可以设定一个按钮将某一行设定为编辑状态与否
// inplace模式下不允许启用Form编辑表单
export const EditTriggerSwitchButton = "EditTriggerSwitchButton" // 激活编辑状态方式，按钮切换
export const EditTriggerClick = "EditTriggerClick" // 激活编辑状态方式，单击行
export const EditTriggerDBLClick = "EditTriggerDBLClick"// 激活编辑状态方式，双击行
export const EditTriggerDBLClickOrSwitcher  = "EditTriggerDBLClickOrSwitcher"

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
export function switchRowInEdit(row) {
    row[CtrlDataInRowData].inplaceEdit = !row[CtrlDataInRowData].inplaceEdit
}
export function setRowInEdit(row,inEdit=true) {
    row[CtrlDataInRowData].inplaceEdit = inEdit
}

export  function isRowInEdit(row) {
    return row[CtrlDataInRowData].inplaceEdit
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

export const ToolbarShortcutCodeRowEdit = "rowEdit"
export const ToolbarShortcutCodeRowDelete = "rowDelete"
export const ToolbarShortcutCodeRowCopy = "rowCopy"
export const ToolbarShortcutCodeRowSaveLocal = "rowSaveLocal"
export const ToolbarShortcutCodeRowSaveRemote = "rowSaveRemote"
export const ToolbarShortcutCodeRowHistory = "rowHistory"
export const ToolbarShortcutCodeCopyField = "copyField"

// 快捷方式按钮属性映射
export const code2OptionsMapping = {}
code2OptionsMapping[ToolbarShortcutCodeAdd] = {icon:'el-icon-plus',type:'primary',code:ToolbarShortcutCodeAdd,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRefresh] = {icon:'el-icon-refresh',type:'primary',code:ToolbarShortcutCodeRefresh,circle:true}
code2OptionsMapping[ToolbarShortcutCodePrint] = {icon:'el-icon-s-grid',type:'primary',code:ToolbarShortcutCodePrint,circle:true}
code2OptionsMapping[ToolbarShortcutCodeCustom] = {icon:'el-icon-printer',type:'primary',code:ToolbarShortcutCodeCustom,circle:true}

code2OptionsMapping[ToolbarShortcutCodeRowEdit] = {icon:'el-icon-edit',label:'编辑',type:'warning',code:ToolbarShortcutCodeRowEdit,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRowDelete] = {icon:'el-icon-delete',label:'删除',type:'danger',code:ToolbarShortcutCodeRowDelete,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRowCopy] = {icon:'el-icon-copy-document',label:'拷贝',type:'primary',code:ToolbarShortcutCodeRowCopy,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRowSaveLocal] = {icon:'el-icon-s-promotion',label:'保存到本地',type:'primary',code:ToolbarShortcutCodeRowSaveLocal,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRowSaveRemote] = {icon:'el-icon-s-promotion',label:'保存', type:'primary',code:ToolbarShortcutCodeRowSaveRemote,circle:true}
code2OptionsMapping[ToolbarShortcutCodeRowHistory] = {icon:'el-icon-date',label:'历史',type:'success',code:ToolbarShortcutCodeRowHistory,circle:true}

