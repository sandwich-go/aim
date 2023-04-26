import jsb from "@sandwich-go/jsb";
import {xidRow} from "@/components/CgTable/table";

// newLocalDataProxyWithFieldName 本地数据代理,form表单内使用
export function newLocalDataProxyWithFieldName(parent,fieldName, options = {}) {
    if(!parent[fieldName]){
        parent[fieldName] = []
    }
    return newLocalDataProxy(parent[fieldName],options)
}

// newLocalDataProxy 本地数据代理
export function newLocalDataProxy(data, options = {}) {
    return {
        isLocalData:true,
        item2Row: (options && options.item2Row) ? options.item2Row : (v) => {
            return v
        },
        row2Item: (options && options.row2Item) ? options.row2Item : (v) => {
            return v
        },
        query() {
            return new Promise((resolve) => {
                resolve({
                    Data: data,
                    Total: data.length,
                })
            })
        },
        delete({row}) {
            jsb.remove(data, item => xidRow(item) === xidRow(row))
        },
        deleteRows({rows}) {
            jsb.remove(data, item => jsb.find(rows, v => xidRow(v) === xidRow(item)))
        },
        save: ({row}) => {
            console.log("row ",row)
            const index = jsb.findIndexOf(data, item => xidRow(item) === xidRow(row))
            if (index === -1) {
                data.push(row)
            } else {
                data[index] = row
            }
        },
        saveTableData: ({tableData}) => {
            data = tableData
        },
    }
}