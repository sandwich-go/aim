import jsb from "@cg-devcenter/jsb";
import {mustCtrlData, xidRow} from "./table";
import {CleanTableForStorage} from "./formatterForUpdate";

// newLocalDataProxyWithFieldName 本地数据代理,form表单内使用
export function newLocalDataProxyWithFieldName(parent,fieldName, options = {}) {
    if(!parent[fieldName]){
        parent[fieldName] = []
    }
    // eslint-disable-next-line no-unused-vars
    const optionQuery = jsb.pathGet(options,'query',({params})=>{return parent[fieldName]})
    const query = ({params})=>{
        return Promise.resolve(optionQuery({params})).then((resp) => {
            parent[fieldName] = resp || []
            jsb.each(parent[fieldName],v=>mustCtrlData(v))
            return {
                Data: parent[fieldName],
                Total: parent[fieldName].length,
            }
        })
    }
    const optionSaveTable =  jsb.pathGet(options,'saveTable')
    const row2Item = (options && options.row2Item) ? options.row2Item : (v) => {
        return v
    }
    const afterTableDataChanged = (tableData,schema)=>{
        if(!optionSaveTable){
            return
        }
        return optionSaveTable(CleanTableForStorage(
            schema,
            tableData,
            true,
            true,
            false,
            row2Item
        ))
    }
    return {
        isLocalData:true,
        deleteConfirmConfig:null,
        item2Row: (options && options.item2Row) ? options.item2Row : (v) => {
            return v
        },
        row2Item: row2Item,
        query:query,
        delete({row,aimTableSchema}) {
            jsb.remove(parent[fieldName], item => xidRow(item) === xidRow(row))
            return afterTableDataChanged(parent[fieldName],aimTableSchema)
        },
        deleteRows({rows,aimTableSchema}) {
            jsb.remove(parent[fieldName], item => jsb.find(rows, v => xidRow(v) === xidRow(item)))
            return afterTableDataChanged(parent[fieldName],aimTableSchema)
        },
        // inPlace模式下不会调用该接口，只是通过query返回的数据直接push，push的时候数据中带着ctrl数据
        save: ({row,aimTableSchema}) => {
            const index = jsb.findIndexOf(parent[fieldName], item => xidRow(item) === xidRow(row))
            if (index === -1) {
                parent[fieldName].push(row)
            } else {
                parent[fieldName][index] = row
            }
            return afterTableDataChanged(parent[fieldName],aimTableSchema)
        },
        saveTableData: ({tableData,aimTableSchema}) => {
            parent[fieldName] = tableData
            return afterTableDataChanged(parent[fieldName],aimTableSchema)
        },
    }
}