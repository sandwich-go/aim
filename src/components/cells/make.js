import jsb from "@sandwich-go/jsb";
import {CellNameButton, CellNameLink, code2OptionsMapping} from "@/components/cells/const";

export function makeCell(initVal,...options) {
    let cc = {
        code: '',
        icon: '',
        label: '',
        disabled: false,
        show: true,
        style: {},
        cell:'',
    }
    cc = Object.assign(cc,initVal)
    jsb.each(options, function (opt) {
        cc = Object.assign(cc, opt)
    })
    cc.code = cc.code || "CODE_INVALID"
    if (!cc.icon && !cc.label) {
        cc.label = cc.code
    }
    return cc
}

export function makeCellButton(...options) {
    return makeCell({type: 'primary',plain: false,cell:CellNameButton},...options)
}

export function makeCellLink(...options) {
    return makeCell({type: 'primary',cell:CellNameLink},...options)
}

const userCdeBtnPrefix = 'myBtn'
const userCodeLinkPrefix = 'myLink'
// myBtnXXXXX@icon_@label_@type_
// myBtnXXXXX@i_@l_@t_

// myLinkXXXXX@icon_@label_@type_
// myLinkXXXXX@i_@l_@t_

// makeCellFromString 由字符串构造Cell
export function makeCellFromString(codeOrDescription,...options){
    // 内置快捷方式
    const shortcut = code2OptionsMapping[codeOrDescription]
    if(shortcut){
        return makeCell(shortcut,...options)
    }
    const strList = codeOrDescription.split('@')
    const cellCode = strList[0]
    let initOption = {code:cellCode}
    jsb.each(strList,function (v,index){
        if(index === 0){
            return
        }
        if(v.startsWith("i_") || v.startsWith("icon_")){
            initOption.icon = v.substr([v.indexOf('_')])
        }
        if(v.startsWith("l_") || v.startsWith("label_")){
            initOption.label = v.substr([v.indexOf('_')])
        }
        if(v.startsWith("t_") || v.startsWith("type_")){
            initOption.type = v.substr([v.indexOf('_')])
        }
    })
    options.unshift(initOption)
    if(cellCode.startsWith(userCdeBtnPrefix)){
        return makeCellButton(...options)
    }
    if(cellCode.startsWith(userCodeLinkPrefix)){
        return makeCellLink(...options)
    }
    return makeCellButton(...options)
}