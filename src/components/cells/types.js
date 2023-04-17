import jsb from "@sandwich-go/jsb";

export function makeButton(options){
    let btn =  {
        code: '',
        icon: '',
        label: '',
        type: 'primary',
        plain: false,
        disabled: false,
        show: true,
        circle:false,
        style: {},
        slot:'CgButton',
    }
    if(!jsb.isEmpty(options)) {
        btn = Object.assign(btn,options)
    }
    if(!btn.code){
        btn.code = "CODE_INVALID"
    }
    if(!btn.icon && !btn.label){
        btn.label = btn.code
    }
    return btn
}