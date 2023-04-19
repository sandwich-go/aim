import jsb from "@sandwich-go/jsb";

export const CgFormInputModeInsert = "CgFormInputModeInsert"
export const CgFormInputModeEdit = "CgFormInputModeEdit"
export const CgFormInputModeCopy = "CgFormInputModeCopy"
export const CgFormInputModeView = "CgFormInputModeView"

export const CgFormInputMode2Title = {}

CgFormInputMode2Title[CgFormInputModeInsert] = '新建'
CgFormInputMode2Title[CgFormInputModeEdit] = '编辑'
CgFormInputMode2Title[CgFormInputModeCopy] = '复制'
CgFormInputMode2Title[CgFormInputModeView] = '查看'

export function calcLabelWidth(schema) {
    let longestTextWidth = jsb.longestTextWidth(schema.map(function (element) {
        return `${element.name}`;
    }))
    const extraWidth = new Map();
    for (const item of schema) {
        if (item['tips']) {
            extraWidth.set("tips", true)
        }
        if (item['required']) {
            extraWidth.set("required", true)
        }
    }
    return `${longestTextWidth + extraWidth.size * 20}px`
}


export function comment(row,fieldSchema, commentField = 'comment') {
    const commentVal = fieldSchema[commentField]
    return jsb.isFunction(commentVal)?commentVal({row, fieldSchema, fieldValue: row[fieldSchema.field]}):commentVal
}
export function commentHTML(row,fs) {
    return comment(fs,row,'commentHTML')
}