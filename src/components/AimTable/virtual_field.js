import jsb from "@cg-devcenter/jsb";

export function isVirtualField(fs) {
    return !fs.field || fs.virtual
}

// filterVirtualField 过滤虚拟列
export function filterVirtualField(schema) {
    let schemaValid = []
    jsb.each(schema, function (fieldSchema) {
        if (isVirtualField(fieldSchema)) {
            return;
        }
        schemaValid.push(fieldSchema)
    })
    return schemaValid
}