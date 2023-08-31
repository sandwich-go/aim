import jsb from "@sandwich-go/jsb";
import {formatValue} from "../cells/types";
import {isVirtualField} from "./virtual_field";
import {isRowSelected, removeCtrlData} from "./table";

// CleanDataForStorage 为数据存储清理数据，如移除虚拟字段，移除控制字段，字段数据的格式化等
export function CleanDataForStorage(schema,row,row2StorageItemFunc,removeVirtual=false,removeCtrl=true,) {
    row2StorageItemFunc = row2StorageItemFunc || function (v){return v}
    let ret = jsb.clone(row)
    formatterForUpdate(schema,ret,removeVirtual)
    if (removeCtrl){
        ret = removeCtrlData(ret)
    }
    return row2StorageItemFunc(ret)
}

function numberProcess({value,pathSlice,fieldName}) {
    if(!value){
        return 0
    }
    let num = parseFloat(value);
    if (isNaN(num)) {
        throw `value: ${value} at ${pathSlice.join(".")}.${fieldName} is not number`
    }
    return num;
}

function stringProcess({value}) {return String(value)}
function boolProcess({value}) {
    const strVal = String(value).toLowerCase()
    return !(value === false || strVal === "false" || strVal === "0" || strVal === "null" || strVal === "undefined" ||jsb.isEmpty(value));
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

        row[fieldName] = formatValue(fieldSchema.type,row[fieldName])
        // 如果上层错误设定了formatterUpdate会导致此处无法对数据进行格式化，如对{}设定了 formatterUpdate = string
        if (fieldSchema['formatterUpdate']) {
            let formatter = fieldSchema['formatterUpdate']
            if(jsb.isString(formatter)){
                formatter = Str2FormatterFunc[formatter.toLowerCase()]
            }
            if(formatter) {
                let selected = []
                if(fieldSchema.type ==='table'){
                    jsb.each(row[fieldName] || [],(tableRow,index)=>{
                        if(isRowSelected(tableRow)){
                            selected.push(index)
                        }
                    })
                }
                row[fieldName] = formatter({
                    row:row,
                    value:row[fieldName],
                    pathSlice:parentNameSlice,
                    fieldName:fieldSchema.name,
                    selected:selected
                })
            }
        }

        if (jsb.isUndefined(row[fieldName])) {
            return
        }
        if(jsb.isString(row[fieldName])){
            row[fieldName] = row[fieldName].trim().replace(/^\s+|\s+$/g, '')
        }
        if(fieldSchema.type ==='object' && fieldSchema.fields){
            let objectTrace = parentNameSlice.slice();
            objectTrace.push(fieldSchema.name)
            row[fieldName] = formatterForUpdate(fieldSchema.fields,row[fieldName],removeVirtual,objectTrace)
        }
        if(fieldSchema.type ==='table' && fieldSchema.fields){
            let tableTrace = parentNameSlice.slice();
            tableTrace.push(fieldSchema.name)
            jsb.each(row[fieldName],function (subRow,index){
                const rowTrace = tableTrace.slice()
                rowTrace.push(`[${index}]`)
                row[fieldName][index] = formatterForUpdate(fieldSchema.fields,subRow,removeVirtual,rowTrace)
            })
        }
    })
    return row
}
