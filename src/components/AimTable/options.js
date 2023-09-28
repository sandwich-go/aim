import jsb from "@sandwich-go/jsb";

export function aimTableOptionPromise(target,optionFetcher,optionLoaderProcess){
    const optionLoadedTo = `options_${jsb.xid()}`
    const optionLoaded = `${optionLoadedTo}_loaded`
    const optionLoader = ()=>{
        return optionFetcher().then(ret=>{
            target[optionLoadedTo] = optionLoaderProcess(ret)
            return target[optionLoadedTo]
        }).finally(()=>{
            target[optionLoaded] = true
        })
    }
    const optionsPromise = ({force})=>{
        if(force){
            return optionLoader()
        }
        return jsb.waitFor(()=>target[optionLoaded] === true).then(()=>{
                return target[optionLoadedTo]
            }
        )
    }
    optionLoader()
    return optionsPromise
}