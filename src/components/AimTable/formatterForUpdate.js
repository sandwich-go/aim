import jsb from "@sandwich-go/jsb";
import {formatValue} from "@/components/cells/types";
import {isVirtualField} from "@/components/AimTable/virtual_field";
import {removeCtrlData} from "@/components/AimTable/table";

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

        if (fieldSchema['formatterUpdate']) {
            row[fieldName] = fieldSchema['formatterUpdate']({row:row,value:row[fieldName]})
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
