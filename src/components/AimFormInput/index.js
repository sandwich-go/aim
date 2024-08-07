import jsb from "@cg-devcenter/jsb";

export const AimFormInputInsert = "AimFormInputInsert"
export const AimFormInputEdit = "AimFormInputEdit"
export const AimFormInputCopy = "AimFormInputCopy"
export const AimFormInputView = "AimFormInputView"
export const AimFormInputTemplate = "AimFormInputTemplate"

export const AimFormInputMode2Title = {}

AimFormInputMode2Title[AimFormInputInsert] = '新建'
AimFormInputMode2Title[AimFormInputEdit] = '编辑'
AimFormInputMode2Title[AimFormInputCopy] = '复制'
AimFormInputMode2Title[AimFormInputView] = '查看'
AimFormInputMode2Title[AimFormInputTemplate] = '模版编辑'

export function calcLabelWidth(schema) {
    let nameList = schema.map(function (element) {
        return jsb.pathGet(element,'nameForm',element['name'])
    })
    jsb.each(schema,(fs)=>{
        const nameSub = jsb.pathGet(fs,'nameSubForm',fs['nameSub'])
        if(nameSub){
            nameList.push(nameSub)
        }
    })


    jsb.each(schema,(fs)=>{
        if(fs.type ==='object' && fs.squash) {
            jsb.each(fs.fields,(subFs)=>{
                nameList.push(jsb.pathGet(subFs,'nameForm',subFs['name']))
                const nameSub = jsb.pathGet(subFs,'nameSubForm',subFs['nameSub'])
                if(nameSub){
                    nameList.push(nameSub)
                }
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


export function comment(row,parent,fieldSchema, commentField = 'comment') {
    const commentVal = fieldSchema[commentField]
    return jsb.isFunction(commentVal)?commentVal({row,parent,fieldSchema, fieldValue: row[fieldSchema.field]}):commentVal
}

export function errorMessage(fieldSchema) {
    const errorMessageVal = fieldSchema['errorMessage']
    return jsb.isFunction(errorMessageVal)?errorMessageVal():errorMessageVal
}

export function showForm(row,fieldSchema,parent){
    const showForm = jsb.pathGet(fieldSchema,'showForm',true)
    if(jsb.isFunction(showForm)){
        return showForm({row,fieldSchema,parent})
    }
    return showForm
}
export function disableForm(row,fieldSchema,parent){
    const disableForm = jsb.pathGet(fieldSchema,'disableForm',false)
    if(jsb.isFunction(disableForm)){
        return disableForm({row,fieldSchema,parent})
    }
    return disableForm
}