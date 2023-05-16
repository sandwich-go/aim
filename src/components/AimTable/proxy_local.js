import jsb from "@sandwich-go/jsb";
import {xidRow} from "@/components/AimTable/table";


// newLocalDataProxyWithFieldName 本地数据代理,form表单内使用
export function newLocalDataProxyWithFieldName(parent,fieldName, options = {}) {
    if(!parent[fieldName]){
        parent[fieldName] = []
    }
    return {
        isLocalData:true,
        deleteConfirmConfig:null,
        item2Row: (options && options.item2Row) ? options.item2Row : (v) => {
            return v
        },
        row2Item: (options && options.row2Item) ? options.row2Item : (v) => {
            return v
        },
        query() {
            console.log("proxy local data query",parent[fieldName])
            return new Promise((resolve) => {
                resolve({
                    Data: parent[fieldName],
                    Total: parent[fieldName].length,
                })
            })
        },
        delete({row}) {
            jsb.remove(parent[fieldName], item => xidRow(item) === xidRow(row))
        },
        deleteRows({rows}) {
            jsb.remove(parent[fieldName], item => jsb.find(rows, v => xidRow(v) === xidRow(item)))
        },
        save: ({row}) => {
            const index = jsb.findIndexOf(parent[fieldName], item => xidRow(item) === xidRow(row))
            if (index === -1) {
                parent[fieldName].push(row)
            } else {
                parent[fieldName][index] = row
            }
        },
        saveTableData: ({tableData}) => {
            parent[fieldName] = tableData
        },
    }
}