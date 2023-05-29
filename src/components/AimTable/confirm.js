const jsb = require("@sandwich-go/jsb")

export function deleteConfirmConfig(proxyConfig,{row,rows}) {
    let config
    const deleteConfirmConfig = jsb.pathGet(proxyConfig, 'deleteConfirmConfig', {})
    if (jsb.isFunction(deleteConfirmConfig)) {
        config = deleteConfirmConfig({row,rows})
    } else {
        config = deleteConfirmConfig
    }
    if(!config){
        return {enable:false}
    }
    config.enable = config.enable===undefined?true:config.enable
    return config
}