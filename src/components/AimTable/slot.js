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

export function commentSlotName(fs){
    return jsb.pathGet(fs,'commentSlot')
}

export function formSlotName(fs){
    return jsb.pathGet(fs,'formSlot')
}

export function tipSlotName(fs){
    return jsb.pathGet(fs,'tipSlot')
}

