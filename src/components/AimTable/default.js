// isVirtualField 是否为虚拟列
// 以下情况会认为是一个虚拟列，只进行展示，不参与编辑操作
//  - 未指定field字段
// virtual字段会被赋默认数值，如果指定了field
import jsb from "@sandwich-go/jsb";
import {type2DefaultVal} from "../cells/types";

// FillDefaultDataWithSchema 根据schema填充默认数据
// 新建或者编辑时都可以填充默认字段
// 注意: 编辑的时候不适合填充填充default返回的数据或者options的默认选项，否则在编辑界面无法区分数据是来自存储本身还是来自默认数据
export function FillDefaultDataWithSchema(schema, row={},fillBySchemaDefault=true) {
    row = row || {}
    jsb.each(schema, function (fieldSchema) {
        if (!fieldSchema.field ) {
            return;
        }
        const fieldName = fieldSchema.field

        const filedTypeUsing = fieldSchema.type || 'input'

        let noValue = jsb.isUndefined(row[fieldName]) || jsb.isNull(row[fieldName])
        if (noValue && fillBySchemaDefault) {
            // 如果不存在值，调用默认的default初始化
            const defaultVal = jsb.pathGet(fieldSchema, 'default', undefined)
            if (!jsb.isUndefined(defaultVal)) {
                row[fieldName] = jsb.isFunction(defaultVal) ? defaultVal() : defaultVal
            }
            noValue = jsb.isUndefined(row[fieldName]) || jsb.isNull(row[fieldName])
        }
        if(noValue){
            // 调用类型对应的默认赋值逻辑
            const vByType = type2DefaultVal[filedTypeUsing]
            if(jsb.isFunction(vByType)){
                row[fieldName] = vByType(fieldSchema)
            }else{
                row[fieldName] = vByType
            }
        }
        // object类型防止由于{}无法给子字段赋值
        if(jsb.isObjectOrMap(row[fieldName]) && filedTypeUsing==='object' && fieldSchema.fields){
            row[fieldName] = FillDefaultDataWithSchema(fieldSchema.fields,row[fieldName],fillBySchemaDefault)
        }
        // array嵌套数组类型
        if(jsb.isArray(row[fieldName]) && filedTypeUsing==='table' && fieldSchema.fields){
            jsb.each(row[fieldName],(v,index)=>{
                row[fieldName][index] = FillDefaultDataWithSchema(fieldSchema.fields,v,fillBySchemaDefault)
            })
        }
    })
    return row
}
