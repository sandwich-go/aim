// isVirtualField 是否为虚拟列
// 以下情况会认为是一个虚拟列，只进行展示，不参与编辑操作
//  - 未指定field字段
// virtual字段会被赋默认数值，如果指定了field
import jsb from "@sandwich-go/jsb";
import {type2DefaultVal} from "../cells/types";

// FillDefaultDataWithSchema 根据schema填充默认数据
export function FillDefaultDataWithSchema(schema, row) {
    row = row || {}
    jsb.each(schema, function (fieldSchema) {
        if (!fieldSchema.field ) {
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
