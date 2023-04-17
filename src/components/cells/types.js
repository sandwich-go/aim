import jsb from "@sandwich-go/jsb";



export function makeButton(options1=null,options2=null){
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
    if(!jsb.isEmpty(options1)) {
        btn = Object.assign(btn,options1)
    }
    if(!jsb.isEmpty(options2)) {
        btn = Object.assign(btn,options2)
    }
    if(!btn.code){
        btn.code = "CODE_INVALID"
    }
    if(!btn.icon && !btn.label){
        btn.label = btn.code
    }
    return btn
}