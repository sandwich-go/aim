import jsb from "@sandwich-go/jsb";
import {CellNameButton, CellNameLabel, CellNameLink, code2OptionsMapping} from "@/components/cells/const";

export function makeCell(initVal, ...options) {
    let cc = {
        code: '',
        icon: '',
        label: '',
        disabled: false,
        show: true,
        style: {},
        cell: CellNameLabel,
    }
    cc = Object.assign(cc, initVal)
    jsb.each(options, function (opt) {
        cc = Object.assign(cc, opt)
    })
    if (cc.code && !cc.icon && !cc.label) {
        cc.label = cc.code
    }
    return cc
}

export function makeCellButton(...options) {
    options.push({cell: CellNameButton})
    return makeCell({type: 'primary', plain: false}, ...options)
}

export function makeCellLink(...options) {
    options.push({cell: CellNameLink})
    return makeCell({type: 'primary'}, ...options)
}

function parseOptions(options,strList) {
    jsb.each(strList, function (v, index) {
        if (index === 0) {
            return
        }
        if (v.startsWith("i_") || v.startsWith("icon_")) {
            options.icon = v.substr([v.indexOf('_')+1])
        }
        if (v.startsWith("l_") || v.startsWith("label_")) {
            options.label = v.substr([v.indexOf('_')+1])
        }
        if (v.startsWith("t_") || v.startsWith("type_")) {
            options.type = v.substr([v.indexOf('_')+1])
        }
    })
    return options
}

// btn@code@icon_@label_@type_
// btn@code@i_@l_@t_

// link@code@icon_@label_@type_
// link@code@i_@l_@t_

// makeCellFromString 由字符串构造Cell
export function makeCellFromString(codeOrDescription, ...options) {
    // 内置快捷方式
    const shortcut = code2OptionsMapping[codeOrDescription]
    if (shortcut) {
        return makeCell(shortcut, ...options)
    }
    const strList = codeOrDescription.split('@')
    if (strList.length > 1) {
        const cellCode =  strList[1]
        const shortcutOption = code2OptionsMapping[cellCode]
        if(shortcutOption){
            // 快捷方式禁用文字
            options.unshift({label:''},parseOptions(strList))
            options.unshift(shortcutOption)
        }else{
            options.unshift(parseOptions({},strList))
        }
        if (strList[0] === 'link') {
            return makeCellLink(...options)
        } else if (strList[0] === 'btn' || strList[0] === 'button') {
            return makeCellButton(...options)
        }
    }
    return makeCell({label: codeOrDescription}, ...options)
}