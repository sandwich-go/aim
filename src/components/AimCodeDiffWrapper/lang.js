// 插件默认支持语言
const langSupportedList = [
    'plaintext',
    'xml',
    'html',
    'javascript',
    'json',
    'yaml',
    'python',
    'java',
    'bash',
    'sql'
]
// const langToToRegister = {
//     'protobuf':'protobuf',
//     'lua':'lua',
//     'mysql':'sql',
//     'shell':'shell',
//     'ini':'ini',
//     'toml':'ini',
//     'scala':'scala',
//     'rego':'scala',
// }
//
// jsb.each(langToToRegister,(moduleName,langName)=>{
//     // eslint-disable-next-line no-undef
//     const module = require(`highlight.js/lib/languages/${moduleName}`);
//     CodeDiffWrapper.hljs.registerLanguage(langName, module);
//     langSupportedList.push(langName)
// })

export function getLang(inLang) {
    if(!inLang){
        return "json"
    }
    inLang = inLang.toLowerCase()
    if(langSupportedList.includes(inLang)){
        return inLang
    }
    return "plaintext"
}
