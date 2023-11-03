import jsb from "@sandwich-go/jsb";
import {mustCtrlData, xidRow} from "./table";



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
    return {
        isLocalData:true,
        deleteConfirmConfig:null,
        item2Row: (options && options.item2Row) ? options.item2Row : (v) => {
            return v
        },
        row2Item: (options && options.row2Item) ? options.row2Item : (v) => {
            return v
        },
        query:query,
        delete({row}) {
            jsb.remove(parent[fieldName], item => xidRow(item) === xidRow(row))
            if(optionSaveTable){
                return optionSaveTable(parent[fieldName])
            }
        },
        deleteRows({rows}) {
            jsb.remove(parent[fieldName], item => jsb.find(rows, v => xidRow(v) === xidRow(item)))
            if(optionSaveTable){
                return optionSaveTable(parent[fieldName])
            }
        },
        // inPlace模式下不会调用该接口，只是通过query返回的数据直接push，push的时候数据中带着ctrl数据
        save: ({row}) => {
            const index = jsb.findIndexOf(parent[fieldName], item => xidRow(item) === xidRow(row))
            if (index === -1) {
                parent[fieldName].push(row)
            } else {
                parent[fieldName][index] = row
            }
            if(optionSaveTable){
                return optionSaveTable(parent[fieldName])
            }
        },
        saveTableData: ({tableData}) => {
            parent[fieldName] = tableData
            if(optionSaveTable){
                return optionSaveTable(parent[fieldName])
            }
        },
    }
}