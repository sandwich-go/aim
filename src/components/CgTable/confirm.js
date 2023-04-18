const jsb = require("@sandwich-go/jsb")

export function deleteConfirmConfig(proxyConfig,row) {
    let config
    const deleteConfirmConfig = jsb.pathGet(proxyConfig, 'deleteConfirmConfig', {})
    if (jsb.isFunction(deleteConfirmConfig)) {
        config = deleteConfirmConfig({row: row})
    } else {
        config = deleteConfirmConfig
    }
    config.message = config.message || "确认操作?"
    return config
}