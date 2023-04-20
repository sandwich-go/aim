const jsb = require("@sandwich-go/jsb")

export function pathGet(obj, path, defaultVal) {
    return jsb.pathGet(obj, path, defaultVal)
}

export function isString(s) {
    return jsb.isString(s)
}

export function wrapArray(data) {
    return jsb.wrapArray(data)
}

export function isPlainObject(s) {
    return jsb.isPlainObject(s)
}

export function wrapAsTagList(val, options) {
    let tagList = []
    for (const v of jsb.wrapArray(val)) {
        if (jsb.isPlainObject(val)) {
            tagList.push(val)
            continue
        }
        let found = false
        for (const item of options) {
            if (item.value === v) {
                tagList.push(Object.assign({
                    type: 'primary',
                    effect: 'light',
                    label: item.label
                }, jsb.pathGet(item, 'asTag', {})))
                found = true
            }
        }
        if (!found) {
            tagList.push(Object.assign({
                type: 'primary',
                effect: 'light',
                label: v
            }))
        }
    }
    return tagList
}