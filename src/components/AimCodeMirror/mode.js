const jsb = require("@sandwich-go/jsb")

export const CodeMirrorModeShell = "text/x-sh"
export const CodeMirrorModeYAML = "text/x-yaml"
export const CodeMirrorModeMySQL = "text/x-mysql"
export const CodeMirrorModeJSON = "application/json"
export const CodeMirrorModeTOML = "text/x-toml"
export const CodeMirrorModeGolang = "text/x-go"
export const CodeMirrorModeLua = "text/x-lua"
export const CodeMirrorModePHP = "application/x-httpd-php"
export const CodeMirrorModeVerilog = "text/x-verilog"
export const CodeMirrorModeMarkdown = "text/x-markdown"
export const CodeMirrorModeJavascript = "text/javascript"
export const CodeMirrorModeProtobuf = "text/x-protobuf"

let modeOptions = []
modeOptions.push({label: 'Shell', value: CodeMirrorModeShell})
modeOptions.push({label: 'YAML', value: CodeMirrorModeYAML})
modeOptions.push({label: 'MySQL', value: CodeMirrorModeMySQL})
modeOptions.push({label: 'JSON', value: CodeMirrorModeJSON})
modeOptions.push({label: 'TOML', value: CodeMirrorModeTOML})
modeOptions.push({label: 'Go', value: CodeMirrorModeGolang})
modeOptions.push({label: 'Lua', value: CodeMirrorModeLua})
modeOptions.push({label: 'PHP', value: CodeMirrorModePHP})
modeOptions.push({label: 'Verilog', value: CodeMirrorModeVerilog})
modeOptions.push({label: 'Markdown', value: CodeMirrorModeMarkdown})
modeOptions.push({label: 'Javascript', value: CodeMirrorModeJavascript})
modeOptions.push({label: 'Protobuf', value: CodeMirrorModeProtobuf})

let mapping = {}
for(const item of modeOptions) {
    mapping[item.label.toLowerCase()] = item.value
}

export var CodeMirrorModeMapping = mapping

export function getCodeMirrorMode(s) {
    return CodeMirrorModeMapping[s.toLowerCase()] ? CodeMirrorModeMapping[s.toLowerCase()] : s
}

export const CodeMirrorModeOptions = modeOptions;
export const CodeMirrorThemeIDEA = "idea";
export const CodeMirrorThemeBase16Dark = "base16-dark";
export const CodeMirrorThemeMonoKai = "monokai";
export const CodeMirrorThemeMbo = "mbo";
export const CodeMirrorThemeRubyBlue = "rubyblue";

export const CodeMirrorSettingDefault = {
    Theme:CodeMirrorThemeMbo,
    FontSize:13,
    LineHeight:150,
}

export function UserCodeMirrorSetting() {return jsb.cc['CodeMirrorSetting'] || CodeMirrorSettingDefault}

export const CodeMirrorThemeOptions = [
    {label:CodeMirrorThemeRubyBlue,value:CodeMirrorThemeRubyBlue},
    {label:CodeMirrorThemeIDEA,value:CodeMirrorThemeIDEA},
    {label:CodeMirrorThemeBase16Dark,value:CodeMirrorThemeBase16Dark},
    {label:CodeMirrorThemeMonoKai,value:CodeMirrorThemeMonoKai},
    {label:CodeMirrorThemeMbo,value:CodeMirrorThemeMbo},
]


export var defaultOptions = {
    mode: CodeMirrorModeYAML,
    fontSize : 13,
    lineHeight : 150,
    tabSize: 4,
    indentUnit: 2, // 缩进单位，默认2
    smartIndent: true, // 是否智能缩进
    lineNumbers: true,
    theme: CodeMirrorThemeBase16Dark,
    readOnly: true,
    autofocus: true,
    gutters: [
        "CodeMirror-lint-markers",
        "CodeMirror-linenumbers",
        "CodeMirror-foldgutter"
    ],
    autoCloseBrackets: true,
    autoCloseTags: true,
    matchTags: {bothTags: true},
    matchBrackets: true,
    styleActiveLine: true,
    autoRefresh: true,
    line: true,
    // CodeMirror-lint-markers是实现语法报错功能
    lint: true,
    // 开启代码折叠
    lineWrapping: true,
    foldGutter: true,
    highlightSelectionMatches: {
        minChars: 2,
        style: "codemirror-matchhighlight",
        showToken: true
    },
    // 全屏模式
    fullScreen: false,
    // // 额外快捷键
    // extraKeys: {
    //   F1: (cm) => {
    //     cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    //   },
    //   Esc: (cm) => {
    //     if (cm.getOption("fullScreen")) {
    //       cm.setOption("fullScreen", false);
    //     }
    //   },
    // },
}

export function getDefaultOptions() {
    return jsb.clone(defaultOptions)
}
