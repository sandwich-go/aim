import jsb from "@sandwich-go/jsb";
import {isVirtualField} from "@/components/AimTable/schema";

export function trimInvisibleChar(schema,row,removeVirtual=false){
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            if(removeVirtual){
                delete row[fieldSchema.field]
            }
            return;
        }
        const fieldName = fieldSchema.field
        if (jsb.isUndefined(row[fieldName])) {
            return
        }
        if(jsb.isString(row[fieldName])){
            row[fieldName] = row[fieldName].trim().replace(/^\s+|\s+$/g, '')
        }
        if(fieldSchema.type ==='object' && fieldSchema.fields){
            row[fieldName] = trimInvisibleChar(fieldSchema.fields,row[fieldName])
        }
        if(fieldSchema.type ==='table' && fieldSchema.fields){
            jsb.each(row[fieldName],function (subRow,index){
                row[fieldName][index] = trimInvisibleChar(fieldSchema.fields,subRow)
            })
        }
    })
    return row
}