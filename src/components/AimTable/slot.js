import jsb from "@sandwich-go/jsb";

export function getProxySlotName(slotName){
    return `aim-proxy-slot-${slotName}`
}


export function getProxyTipSlotName(fs){
    return `aim-proxy-slot-${tipSlotName(fs)}`
}

export function tipSlotName(fs){
    return jsb.pathGet(fs,'tipSlot')
}