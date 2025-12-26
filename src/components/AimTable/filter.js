import jsb from "@cg-devcenter/jsb";

export const FilterModeStartWith = "startsWith"
export const FilterModeIncludes = "includes"
export const FilterModeEqual = "equal"

export const FilterModeOptions= [
    {label:FilterModeStartWith,value:FilterModeStartWith},
    {label:FilterModeIncludes,value:FilterModeIncludes},
    {label:FilterModeEqual,value:FilterModeEqual},
]

// localFilter 本地化过滤数据,filterMode为字段到采用的过滤方式的映射，默认 FilterModeStartWith
export function localFilter(data,conditions,filterMode) {
    return jsb.filter(data, (row)=>{
        let valid = true
        jsb.each(conditions,(v,k)=>{
            // 如果值是 null 或 undefined，跳过
            if (v === null || v === undefined || v === '') {
                return
            }
            // 如果是字符串类型，才调用 trim，否则直接转换为字符串
            const filterVal = typeof v === 'string' ? v.trim() : String(v)
            const rowVal = String(row[k] ||'')
            const mode = jsb.pathGet(filterMode,k,FilterModeIncludes)
            // 如果已经不符合条件，跳过后续检查
            if(!valid){
                return
            }
            if(mode === FilterModeStartWith){
                valid = rowVal.toLowerCase().startsWith(filterVal.toLowerCase())
            }else if(mode === FilterModeIncludes) {
                valid = rowVal.toLowerCase().includes(filterVal.toLowerCase())
            }else{
                valid = rowVal.toLowerCase() === filterVal.toLowerCase()
            }
        })
        return valid
    })
}