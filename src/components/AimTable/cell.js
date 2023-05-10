import {pathGet} from "@/components/utils/jsb";
import {cellNameForFormByType, cellNameForTableByType, cellNameForTableInplaceByType} from "@/components/cells/types";

const jsb = require("@sandwich-go/jsb")


// Table 内组件
export const FieldPathCellNameForTable = 'cell'
export const FieldPathCellConfigForTable = 'cellConfig'

// Form内组件名称、配置路径
export const FieldPathCellNameForForm = 'cellForm'
export const FieldPathCellConfigForForm = 'cellFormConfig'


// cellNameForTable 获取table内fs使用的组件名称
export function cellNameForTable(fs,row,inplace=false) {
    const cellTable  = pathGet(fs, FieldPathCellNameForTable,inplace?cellNameForTableInplaceByType(fs.type):cellNameForTableByType(fs.type))
    if(jsb.isFunction(cellTable)){
        return cellTable({row})
    }
    return cellTable
}

// cellConfigForTable 获取table内cell的配置
export function cellConfigForTable(fs,row) {
    let cc = jsb.pathGet(fs, FieldPathCellConfigForTable,{})
    if (jsb.isFunction(cc)) {
        return cc({row, fs, fieldValue: jsb.pathGet(row, fs.field)})
    }
    return cc
}

// cellNameForForm 获取form内fs使用的组件名称
export function cellNameForForm(fs, row) {
    const cellForm  = pathGet(fs, FieldPathCellNameForForm, cellNameForFormByType(fs.type))
    if(jsb.isFunction(cellForm)){
        return cellForm({row})
    }
    return cellForm
}

// cellFormConfig 获取form内cell的配置
export function cellConfigForForm(fieldSchema,row) {
    let cc = jsb.pathGet(fieldSchema, FieldPathCellConfigForForm,{})
    if (jsb.isFunction(cc)) {
        return cc({row, fieldSchema, fieldValue: jsb.pathGet(row, fieldSchema.field)})
    }
    return cc
}

// 当cell的类型无法被正确识时
export  function cellShowWhenLostForTable(row, fieldSchema) {
    const cc = cellConfigForTable(row,fieldSchema)
    if(cc){
        return cc
    }
    return row[fieldSchema]
}
