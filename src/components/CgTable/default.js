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
        class: '',
        showHeader: true,
        highlightCurrentRow: true,
        headerCellStyle: {textAlign: 'center', padding: '0', color: '#606266'},
        emptyText: '',
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
            return true
        },
    })
}