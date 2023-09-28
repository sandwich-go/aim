import jsb from "@sandwich-go/jsb";
import {mustCtrlData, xidRow} from "./table";


// newLocalDataProxyWithFieldName 本地数据代理,form表单内使用
// 不能依赖xid，删除数据，数据存储后应该将xid删除，此时再次加载数据删除数据导致xid丢失
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
            // 为每一个数据添加xid
            jsb.each(parent[fieldName],v=>mustCtrlData(v))
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
        // inPlace模式下不会调用该接口，只是通过query返回的数据直接push，push的时候数据中带着ctrl数据
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