// isVirtualField 是否为虚拟列
// 以下情况会认为是一个虚拟列，只进行展示，不参与编辑操作
//  - virtual = true
//  - 为指定field字段
import jsb from "@sandwich-go/jsb";
import {type2DefaultVal} from "@/components/cells/types";

export function isVirtualField(fs) {
    return !fs.field || fs.virtual
}

// filterVirtualField 过滤虚拟列
export function filterVirtualField(schema) {
    let schemaValid = []
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        schemaValid.push(fieldSchema)
    })
    return schemaValid
}

// defaultRow 根据schema构造默认行数据
export function defaultRow(schema, row) {
    row = row || {}
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        const fieldName = fieldSchema.field
        if (!jsb.isUndefined(row[fieldName])) {
            return
        }
        const defaultVal = jsb.pathGet(fieldSchema, 'default', undefined)
        if (!jsb.isUndefined(defaultVal)) {
            row[fieldName] = jsb.isFunction(defaultVal) ? defaultVal() : defaultVal
            return
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
