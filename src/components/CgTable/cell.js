import {pathGet} from "@/utils/jsb";

const jsb = require("@sandwich-go/jsb")

// 当field在表内组件为只读属性，使用内置CgViewer组件时,cellTable为该组件的配置+数据内容
// 当field在表内组件为编辑组件, cellTable为该组件的配置,组件的数据使用field本身的数据
export const CellTableDefault = 'CgViewerLabel'
export const CellFormDefault = 'CgInput'

export const CellTableCells = 'CgCells'

export const ConstCellTableName = 'cellTableName'
export const ConstCellTable = 'cellTable'

export const ConstCellFormName = 'cellFormName'
export const ConstCellForm = 'cellForm'

export function cellTableName(fs) {
    return pathGet(fs,ConstCellTableName,CellTableDefault)
}

export function cellTableConfig(row,fieldSchema){
    let cellTable = jsb.pathGet(fieldSchema,ConstCellTable)
    if(jsb.isFunction(cellTable)){
        cellTable = cellTable({row,fieldSchema,fieldValue:jsb.pathGet(row,fieldSchema.field)})
    }
    return cellTable
}

export function cellFormName(fs) {
    return pathGet(fs,ConstCellFormName,CellFormDefault)
}

export function cellFormConfig(row,fieldSchema){
    return jsb.pathGet(fieldSchema,ConstCellForm)
}