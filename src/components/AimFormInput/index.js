import jsb from "@sandwich-go/jsb";

export const AimFormInputInsert = "AimFormInputInsert"
export const AimFormInputEdit = "AimFormInputEdit"
export const AimFormInputCopy = "AimFormInputCopy"
export const AimFormInputView = "AimFormInputView"

export const AimFormInputMode2Title = {}

AimFormInputMode2Title[AimFormInputInsert] = '新建'
AimFormInputMode2Title[AimFormInputEdit] = '编辑'
AimFormInputMode2Title[AimFormInputCopy] = '复制'
AimFormInputMode2Title[AimFormInputView] = '查看'

export function calcLabelWidth(schema) {
    let nameList = schema.map(function (element) {
        return jsb.pathGet(element,'nameForm',element['name'])
    })
    jsb.each(schema,(fs)=>{
        if(fs.type ==='object' && fs.squash) {
            jsb.each(fs.fields,(subFs)=>{
                nameList.push(jsb.pathGet(subFs,'nameForm',subFs['name']))
            })
        }
    })

    let longestTextWidth = jsb.longestTextWidth(nameList)
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

export function showForm(row,fieldSchema){
    const showForm = jsb.pathGet(fieldSchema,'showForm',true)
    if(jsb.isFunction(showForm)){
        return showForm({row,fieldSchema})
    }
    return showForm
}
export function disableForm(row,fieldSchema){
    const disableForm = jsb.pathGet(fieldSchema,'disableForm',false)
    if(jsb.isFunction(disableForm)){
        return disableForm({row,fieldSchema})
    }
    return disableForm
}