const jsb = require("@cg-devcenter/jsb")

// aimTableOptionPromise 外部使用，当table的field.option是一个Promise，防止多次产生loader行为
// eslint-disable-next-line no-unused-vars
export function aimTableOptionPromise(target,optionFetcher,optionLoaderProcess,until=jsb.until){
    const optionLoadedTo = `options_${jsb.xid()}`
    const optionLoaded = `${optionLoadedTo}_loaded`
    target[optionLoaded] = false
    const optionLoader = ()=>{
        return optionFetcher().then(ret=>{
            target[optionLoadedTo] = optionLoaderProcess(ret)
            return target[optionLoadedTo]
        }).finally(()=>{
            target[optionLoaded] = true
        })
    }
    const optionsPromiseProvider = function ({force}){
        if(force){
            return optionLoader()
        }
        return until(()=>target[optionLoaded] === true).then(()=>{
                return target[optionLoadedTo]
            }
        )
    }
    optionLoader()
    return optionsPromiseProvider
}