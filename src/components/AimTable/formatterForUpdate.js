import jsb from "@sandwich-go/jsb";
import {boolProcess, formatValue, numberProcess, stringProcess} from "../cells/types";
import {isVirtualField} from "./virtual_field";
import {isRowSelected, removeCtrlData} from "./table";


// RemoveFieldNotInSchema 移除data中不在schema中的字段
export function RemoveFieldNotInSchema(schema,row) {
    jsb.each(row,(v,k)=>{
        // 当前数据的key是否为合法的field
        const validField = jsb.find(schema,fs=>fs.field === k)
        if(!validField){
            delete row[k]
            return
        }
        if(validField.type ==='object'){
            row[k] = RemoveFieldNotInSchema(validField.fields||[],v)
        }
        if(validField.type ==='table'){
            jsb.each(v,function (subRow,index){
                row[k][index] = RemoveFieldNotInSchema(validField.fields||[],subRow)
            })
        }
    })
    return row
}

// CleanDataForStorage 为数据存储清理数据，如移除虚拟字段，移除控制字段，字段数据的格式化等
export function CleanDataForStorage(schema,row,removeVirtual=false,removeCtrl=true) {
    let ret = jsb.clone(row)
    formatterForUpdate(schema,ret,removeVirtual)
    if (removeCtrl){
        ret = removeCtrlData(ret)
    }
    return ret
}


export const Str2FormatterFunc = {
    "string":stringProcess,
    "number":numberProcess,
    "boolean":boolProcess,
    "float":numberProcess,
    "double":numberProcess,
    "int32":numberProcess,
    "uint32":numberProcess,
    "int64":numberProcess,
    "uint64":numberProcess,
    "bytes":stringProcess,
    "json":stringProcess,
    "lua":stringProcess,
    "sint32":numberProcess,
    "sint64":numberProcess,
    "fixed32":numberProcess,
    "fixed64":numberProcess,
    "sfixed32":numberProcess,
    "sfixed64":numberProcess,
}

export function formatterForUpdate(schema,row,removeVirtual,parentNameSlice=[]){
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            if(removeVirtual){
                delete row[fieldSchema.field]
            }
            return;
        }
        const fieldName = fieldSchema.field
        let fieldsSubmit = fieldSchema.fields
        // 简单的根据类型返回格式化数据
        row[fieldName] = formatValue(fieldSchema.type,row[fieldName])
        // 如果上层错误设定了formatterUpdate会导致此处无法对数据进行格式化，如对{}设定了 formatterUpdate = string
        if (fieldSchema['formatterUpdate']) {
            let formatter = fieldSchema['formatterUpdate']
            if(jsb.isString(formatter)){
                formatter = Str2FormatterFunc[formatter.toLowerCase()]
            }
            if(formatter) {
                let selected = []
                // table 或者 object 复合类型如果提供了formatter，则完全以formatter为准，不再进行对单个元素的格式化
                if(fieldSchema.type ==='table'){
                    jsb.each(row[fieldName] || [],(tableRow,index)=>{
                        if(isRowSelected(tableRow)){
                            selected.push(index)
                        }
                    })
                }
                let valFormatted = formatter({
                    row:row,
                    value:row[fieldName],
                    pathSlice:parentNameSlice,
                    fieldName:fieldSchema.name,
                    selected:selected
                })
                // table类型韵如通过fields指定格式化后希望用到的字段，防止后续字段格式化时加入提交时被删除的字段
                if(fieldSchema.type ==='table' && jsb.isObjectOrMap(valFormatted)){
                    fieldsSubmit = jsb.pathGet(valFormatted,'aimFieldsSubmit',fieldsSubmit)
                    valFormatted = jsb.pathGet(valFormatted,'value',valFormatted)
                }
                if(fieldSchema.type ==='object' && jsb.isObjectOrMap(valFormatted)){
                    fieldsSubmit = jsb.pathGet(valFormatted,'aimFieldsSubmit',fieldsSubmit)
                    valFormatted = jsb.pathGet(valFormatted,'value',valFormatted)
                }
                row[fieldName] = valFormatted
            }
        }
        if (jsb.isUndefined(row[fieldName])) {
            return
        }
        if(jsb.isString(row[fieldName])){
            row[fieldName] = stringProcess({value:row[fieldName]})
        }
        if(fieldSchema.type ==='object' && fieldsSubmit){
            let objectTrace = parentNameSlice.slice();
            objectTrace.push(fieldSchema.name)
            row[fieldName] = formatterForUpdate(fieldsSubmit,row[fieldName],removeVirtual,objectTrace)
        }
        if(fieldSchema.type ==='table' && fieldsSubmit){
            let tableTrace = parentNameSlice.slice();
            tableTrace.push(fieldSchema.name)
            jsb.each(row[fieldName],function (subRow,index){
                const rowTrace = tableTrace.slice()
                rowTrace.push(`[${index}]`)
                row[fieldName][index] = formatterForUpdate(fieldsSubmit,subRow,removeVirtual,rowTrace)
            })
        }
    })
    return row
}
