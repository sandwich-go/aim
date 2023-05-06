import jsb from "@sandwich-go/jsb";

export const AimFormInputModeInsert = "AimFormInputModeInsert"
export const AimFormInputModeEdit = "AimFormInputModeEdit"
export const AimFormInputModeCopy = "AimFormInputModeCopy"
export const AimFormInputModeView = "AimFormInputModeView"

export const AimFormInputMode2Title = {}

AimFormInputMode2Title[AimFormInputModeInsert] = '新建'
AimFormInputMode2Title[AimFormInputModeEdit] = '编辑'
AimFormInputMode2Title[AimFormInputModeCopy] = '复制'
AimFormInputMode2Title[AimFormInputModeView] = '查看'

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