import {EditTriggerDBLClickOrSwitchButton, RowEditorFormInput} from "@/components/CgTable/table";

const jsb = require("@sandwich-go/jsb")


export function NewDefaultProxyConfigData() {
    return jsb.clone({
        item2Row(item) {
            return item
        },
        row2Item(row) {
            return row
        },
        // eslint-disable-next-line no-unused-vars
        query: function ({params}) {
            return new Promise((resolve, reject) => {
                reject("query not implemented")
            })
        },
        // eslint-disable-next-line no-unused-vars
        save: function ({params}) {
            return new Promise((resolve, reject) => {
                reject("save not implemented")
            })
        },
        // eslint-disable-next-line no-unused-vars
        delete: function ({params}) {
            return new Promise((resolve, reject) => {
                reject("delete not implemented")
            })
        },
    })
}

export function NewDefaultTableProperty() {
    return jsb.clone({
        border: true,
        stripe: true,
        class: 'cg-table-small-padding',
        showHeader: true,
        highlightCurrentRow: true,
        headerCellStyle: {textAlign: 'center', padding: '0', color: '#606266',background:'#eceff1'},
        emptyText: '',
        rowStyle:{height:"20px",'padding':0},// object of function
        height:null,
        heightSubVH:0,
    })
}

export function NewEitConfigData() {
    return jsb.clone({
        enable: true,
        trigger: EditTriggerDBLClickOrSwitchButton,
        rowEditor: RowEditorFormInput,
        // 当尝试编辑某一行时回调该方法
        // eslint-disable-next-line no-unused-vars
        triggerRowFunc: function ({row}) {
            // 如果只是返回字符串则：view状态，显示alert信息

            return true
        },
        // 新建一行数据
        newRow(){},
        // 拷贝一行数据,逻辑层替换关键数据
        // eslint-disable-next-line no-unused-vars
        copyRow({row}){}
    })
}

export function defaultRow(schema,row){
    row = row || {}
    jsb.each(schema,function (fieldSchema){
        const fieldName = fieldSchema.field
        if(!jsb.isUndefined(row[fieldName])) {
            return
        }
        const defaultVal = jsb.pathGet(fieldSchema,'default',undefined)
        if(!jsb.isUndefined(defaultVal)){
            row[fieldName] = jsb.isFunction(defaultVal)?defaultVal():defaultVal
            return
        }
    })
}