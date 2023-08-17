import jsb from "@sandwich-go/jsb";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";
import {mustCtrlData} from "@/components/AimTable/table";

function autoOption(parent, fieldVal) {
    if (!parent.options) {
        parent.options = []
    }
    const optionIndex = jsb.findIndexOf(parent.options, function (option) {
        return option.value === fieldVal
    })
    if (optionIndex === -1) {
        parent.options.push({label: fieldVal, value: fieldVal})
    }
}

function autoOptionFunc(autoOption,fieldVal){
    if(jsb.isFunction(autoOption)){
        return autoOption(fieldVal)
    }
    return jsb.wrapArray(fieldVal)
}

// cleanDataForTable 为表格使用清理数据清理数据，data应该是一个数组，添加必要的xid便于索引，自动为filter填充options
export function cleanDataForTable(data, schema, item2Row) {
    jsb.each(data, function (item, index) {
        // 检查数据的ctrl字段，填充组件需要的控制性数据
        let row = mustCtrlData(item2Row ? item2Row(item) : item)
        row = FillDefaultDataWithSchema(schema, row)
        jsb.each(schema, function (fieldSchema) {
            // 自动为filter准备option
            const fieldVal = row[fieldSchema.field]
            if (!fieldVal) {
                return
            }
            const filterAutoOption = jsb.pathGet(fieldSchema, 'filter.autoOption', false)
            if (filterAutoOption) {
                jsb.each(autoOptionFunc(filterAutoOption,fieldVal),option=>{
                    autoOption(fieldSchema.filter, option)
                })
            }
            const schemaAutoOption = jsb.pathGet(fieldSchema, 'autoOption', false)
            if (schemaAutoOption) {
                jsb.each(autoOptionFunc(schemaAutoOption,fieldVal),option=>{
                    autoOption(fieldSchema, option)
                })
            }
        })
        data[index] = row
    })
    return data
}
