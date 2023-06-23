import jsb from "@sandwich-go/jsb";
import {isVirtualField} from "@/components/AimTable/schema";
import {formatValue} from "@/components/cells/types";

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