import jsb from "@sandwich-go/jsb";

export const FilterModeStartWith = "startsWith"
export const FilterModeIncludes = "includes"
export const FilterModeEqual = "equal"

// localFilter 本地化过滤数据,filterMode为字段到采用的过滤方式的映射，默认 FilterModeStartWith
export function localFilter(data,conditions,filterMode) {
    return jsb.filter(data, (row)=>{
        let valid = true
        jsb.each(conditions,(v,k)=>{
            v = v.trim()
            const rowVal = String(row[k] ||'')
            const mode = jsb.pathGet(filterMode,k,FilterModeStartWith)
            if(!valid){
                return
            }
            if(mode === FilterModeStartWith){
                valid = rowVal.toLowerCase().startsWith(v.toLowerCase())
            }else if(mode === FilterModeIncludes) {
                valid = rowVal.toLowerCase().includes(v.toLowerCase())
            }else{
                valid = rowVal.toLowerCase() === v.toLowerCase()
            }
        })
        return valid
    })
}