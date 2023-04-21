import {pathGet} from "@/utils/jsb";

const jsb = require("@sandwich-go/jsb")


// Table 内组件
export const CellTableDefault = 'CgViewerLabel'
export const ConstCellTableName = 'cellTableName'
export const ConstCellTable = 'cellTable'
export const CellTableCells = 'CgCells'

// Form内组件
export const CellFormDefault = 'CgInput'
export const ConstCellFormName = 'cellFormName'
export const ConstCellForm = 'cellForm'

export function cellTableName(fs,row) {
    const cellTable  = pathGet(fs, ConstCellTableName, CellTableDefault)
    if(jsb.isFunction(cellTable)){
        return cellTable({row})
    }
    return cellTable
}

export function cellTableConfig(row, fieldSchema) {
    let cellTable = jsb.pathGet(fieldSchema, ConstCellTable,{})
    if (jsb.isFunction(cellTable)) {
        cellTable = cellTable({row, fieldSchema, fieldValue: jsb.pathGet(row, fieldSchema.field)})
    }
    return cellTable
}

export function cellFormName(fs,row) {
    const cellForm  = pathGet(fs, ConstCellFormName, CellFormDefault)
    if(jsb.isFunction(cellForm)){
        return cellForm({row})
    }
    return cellForm
}

export function cellFormConfig(row, fieldSchema) {
    return jsb.pathGet(fieldSchema, ConstCellForm,{})
}