const jsb = require("@sandwich-go/jsb")

export function pathGet(obj, path, defaultVal) {
    return jsb.pathGet(obj, path, defaultVal)
}

export function isString(s) {
    return jsb.isString(s)
}