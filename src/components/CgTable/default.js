const jsb = require("@sandwich-go/jsb")

export const  headerBackgroundColor = '#dcdee2'
export const headerColor = '#606266'

export const flexStartStyle = {
    'justify-content': 'flex-start',
    'display': 'flex',
    'align-items': 'center',
    'gap': '3px'
}
export const flexEndStyle = {'justify-content': 'flex-end', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}

export function isVirtualField(fs) {
    return !fs.field || fs.virtual
}

export function validSchema(schema) {
    let schemaValid = []
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        schemaValid.push(fieldSchema)
    })
    return schemaValid
}

export function defaultRow(schema, row) {
    row = row || {}
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        const fieldName = fieldSchema.field
        if (!jsb.isUndefined(row[fieldName])) {
            return
        }
        const defaultVal = jsb.pathGet(fieldSchema, 'default', undefined)
        if (!jsb.isUndefined(defaultVal)) {
            row[fieldName] = jsb.isFunction(defaultVal) ? defaultVal() : defaultVal
            return
        }
        // fixme 抽象类型以辅助默认的default逻辑
        row[fieldName] = undefined
    })
    return row
}