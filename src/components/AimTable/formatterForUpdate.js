import jsb from "@sandwich-go/jsb";
import {formatValue} from "../cells/types";
import {isVirtualField} from "./virtual_field";
import {removeCtrlData} from "./table";

// CleanDataForStorage 为数据存储清理数据，如移除虚拟字段，移除控制字段，字段数据的格式化等
export function CleanDataForStorage(schema,row,row2StorageItemFunc,removeVirtual=false,removeCtrl=true,) {
    row2StorageItemFunc = row2StorageItemFunc || function (v){return v}
    let ret = jsb.clone(row)
    if (removeCtrl){
        ret = removeCtrlData(ret)
    }
    formatterForUpdate(schema,ret,removeVirtual)
    return row2StorageItemFunc(ret)
}

function numberProcess({value}) {return Number(value)}
function stringProcess({value}) {return String(value)}
function boolProcess({value}) {
    const strVal = String(value).toLowerCase()
    return !(value === false || strVal === "false" || strVal === "0" || strVal === "null" || strVal === "undefined" ||jsb.isEmpty(value));
}
export const Str2FormatterFunc = {
    "string":stringProcess,
    "number":numberProcess,
    "float":numberProcess,
    "double":numberProcess,
    "boolean":boolProcess,
    "int8":numberProcess,
    "int16":numberProcess,
    "int32":numberProcess,
    "int64":numberProcess,
    "uint8":numberProcess,
    "uint16":numberProcess,
    "uint32":numberProcess,
    "uint64":numberProcess,
    "json":stringProcess,
    "lua":stringProcess,
}

export function formatterForUpdate(schema,row,removeVirtual=false){
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
                row[fieldName] = formatter({row:row,value:row[fieldName]})
            }
        }

        if (jsb.isUndefined(row[fieldName])) {
            return
        }
        if(jsb.isString(row[fieldName])){
            row[fieldName] = row[fieldName].trim().replace(/^\s+|\s+$/g, '')
        }

        if(fieldSchema.type ==='object' && fieldSchema.fields){
            row[fieldName] = formatterForUpdate(fieldSchema.fields,row[fieldName])
        }
        if(fieldSchema.type ==='table' && fieldSchema.fields){
            jsb.each(row[fieldName],function (subRow,index){
                row[fieldName][index] = formatterForUpdate(fieldSchema.fields,subRow)
            })
        }
    })
    return row
}
