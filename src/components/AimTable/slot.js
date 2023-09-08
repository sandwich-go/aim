import jsb from "@sandwich-go/jsb";

export function getProxySlotName(slotName){
    return `aim-proxy-slot-${slotName}`
}


export function getProxyTipSlotName(fs){
    return `aim-proxy-slot-${tipSlotName(fs)}`
}
export function getProxyFormSlotName(fs){
    return `aim-proxy-slot-${formSlotName(fs)}`
}

export function getProxyCommentSlotName(fs){
    return `aim-proxy-slot-${commentSlotName(fs)}`
}

export function getProxyCommentSlotNameWithName(name){
    return `aim-proxy-slot-${name}`
}

export function commentSlotName(fs){
    return jsb.pathGet(fs,'commentSlot')
}

export function formSlotName(fs){
    return jsb.pathGet(fs,'formSlot')
}

export function tipSlotName(fs){
    return jsb.pathGet(fs,'tipSlot')
}

export function allSlotName(schema,slotFieldName) {
    let slotNameList = []
    if(jsb.isObjectOrMap(schema)){
        if(schema[slotFieldName]){
            slotNameList.push(schema[slotFieldName])
        }
        if(schema.fields){
            jsb.each(allSlotName(schema.fields,slotFieldName),subSlotName=>{
                if(!slotNameList.includes(subSlotName)){
                    slotNameList.push(subSlotName)
                }
            })
        }
    }else{
        jsb.each(schema,subFS=>{
            const subFSGot = allSlotName(subFS,slotFieldName)
            jsb.each(subFSGot,v=>{
                if(!slotNameList.includes(v)){
                    slotNameList.push(v)
                }
            })
        })
    }
    return slotNameList
}

