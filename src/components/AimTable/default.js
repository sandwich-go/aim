// isVirtualField 是否为虚拟列
// 以下情况会认为是一个虚拟列，只进行展示，不参与编辑操作
//  - virtual = true
//  - 为指定field字段
import jsb from "@sandwich-go/jsb";
import {type2DefaultVal} from "../cells/types";
import {isVirtualField} from "./virtual_field";

// FillDefaultDataWithSchema 根据schema填充默认数据
export function FillDefaultDataWithSchema(schema, row) {
    row = row || {}
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        const fieldName = fieldSchema.field
        if (!jsb.isUndefined(row[fieldName]) && !jsb.isNull(row[fieldName])) {
            return
        }
        const defaultVal = jsb.pathGet(fieldSchema, 'default', undefined)
        if (!jsb.isUndefined(defaultVal)) {
            row[fieldName] = jsb.isFunction(defaultVal) ? defaultVal() : defaultVal
            return
        }
        if(fieldSchema.type==='object' && fieldSchema.fields) {
            row[fieldName] = FillDefaultDataWithSchema(fieldSchema.fields,row[fieldName])
            return;
        }
        const vByType = type2DefaultVal[fieldSchema.type]
        if(jsb.isFunction(vByType)){
            row[fieldName] = vByType(fieldSchema)
        }else{
            row[fieldName] = vByType
        }
    })
    return row
}
