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

function  tag(item){
    return Object.assign({
        type: item.type || item.tagType|| 'info',
        effect: item.effect || item.tagEffect || 'light',
        label: item.label,
        tooltip:item.tooltip,
        style:item.style,
    }, jsb.pathGet(item, 'asTag', {}))
}

export function wrapAsTagList(val, options) {
    let tagList = []
    for (const v of jsb.wrapArray(val)) {
        if (jsb.isPlainObject(v)) {
            tagList.push(v)
            continue
        }
        let found = false
        for (const item of options) {
            if (item.value === v) {
                tagList.push(tag(item))
                found = true
                break
            }
        }
        if(!found){
            for (const groupItem of options) {
                for (const item of groupItem.options || []) {
                    if (item.value === v) {
                        tagList.push(tag(item))
                        found = true
                        break
                    }
                }
                if(found){
                    break
                }
            }
        }

        if (!found) {
            tagList.push(Object.assign({
                type: 'info',
                effect: 'light',
                label: v
            }))
        }
    }
    return tagList
}