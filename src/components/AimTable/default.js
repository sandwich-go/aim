// isVirtualField 是否为虚拟列
// 以下情况会认为是一个虚拟列，只进行展示，不参与编辑操作
//  - 未指定field字段
// virtual字段会被赋默认数值，如果指定了field
import jsb from "@sandwich-go/jsb";
import {type2DefaultVal} from "../cells/types";

// FillDefaultDataWithSchema 根据schema填充默认数据
export function FillDefaultDataWithSchema(schema, row,rootRow=null) {
    row = row || {}
    rootRow = rootRow || row
    jsb.each(schema, function (fieldSchema) {
        if (!fieldSchema.field ) {
            return;
        }
        const fieldName = fieldSchema.field

        let noValue = jsb.isUndefined(row[fieldName]) || jsb.isNull(row[fieldName])
        if (noValue) {
            // 如果不存在值，调用默认的default初始化
            const defaultVal = jsb.pathGet(fieldSchema, 'default', undefined)
            if (!jsb.isUndefined(defaultVal)) {
                row[fieldName] = jsb.isFunction(defaultVal) ? defaultVal({row:rootRow}) : defaultVal
            }
        }
        // 默认值赋值后再次检测
        noValue = jsb.isUndefined(row[fieldName]) || jsb.isNull(row[fieldName])
        if(noValue){
            // 调用类型对应的默认赋值逻辑
            const vByType = type2DefaultVal[fieldSchema.type]
            if(jsb.isFunction(vByType)){
                row[fieldName] = vByType(fieldSchema)
            }else{
                row[fieldName] = vByType
            }
        }
        // object类型防止由于{}无法给子字段赋值
        if(jsb.isObjectOrMap(row[fieldName]) && fieldSchema.type==='object' && fieldSchema.fields){
            row[fieldName] = FillDefaultDataWithSchema(fieldSchema.fields,row[fieldName],rootRow)
        }
        // array嵌套数组类型
        if(jsb.isArray(row[fieldName]) && fieldSchema.type==='table' && fieldSchema.fields){
            jsb.each(row[fieldName],(v,index)=>{
                row[fieldName][index] = FillDefaultDataWithSchema(fieldSchema.fields,v,rootRow)
            })
        }
    })
    return row
}
