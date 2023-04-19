const jsb = require("@sandwich-go/jsb")

export const CellNameButton = 'CgButton'
export const CellNameLink = 'CgViewerLink'
export const CellNameLabel = 'CgViewerLabel'

export const CodeButtonRefresh = "btnRefresh"
export const CodeButtonCustom = "btnCustom"
export const CodeButtonPrint = "btnPrint"
export const CodeButtonAdd = "btnAdd"
export const CodeButtonExpandAll = "btnExpandAll"

export const CodeButtonRowEdit = "btnRowEdit"
export const CodeButtonRowDelete = "btnRowDelete"
export const CodeButtonRowCopy = "btnRowCopy"
export const CodeButtonRowSaveLocal = "btnRowSaveLocal"
export const CodeButtonRowSaveRemote = "btnRowSaveRemote"
export const CodeButtonRowHistory = "btnRowHistory"


export const CodeLinkFieldCopy = "linkFieldCopy"
export const CodeLinkFieldJump = "linkFieldJump"


// 快捷方式按钮属性映射
export const code2OptionsMapping = {}
code2OptionsMapping[CodeButtonAdd] = {icon: 'el-icon-plus', type: 'primary', circle: true, label: '新建'}
code2OptionsMapping[CodeButtonRefresh] = {icon: 'el-icon-refresh', type: 'primary', circle: true, label: '刷新'}
code2OptionsMapping[CodeButtonPrint] = {icon: 'el-icon-s-grid', type: 'primary', circle: true, label: '导出'}
code2OptionsMapping[CodeButtonCustom] = {icon: 'el-icon-printer', type: 'primary', circle: true, label: '配置'}
code2OptionsMapping[CodeButtonExpandAll] = {icon: 'el-icon-more', type: 'primary', circle: true, label: '展开所有'}

code2OptionsMapping[CodeButtonRowEdit] = {icon: 'el-icon-edit', label: '编辑', type: 'warning', circle: true}
code2OptionsMapping[CodeButtonRowDelete] = {icon: 'el-icon-delete', label: '删除', type: 'danger', circle: true}
code2OptionsMapping[CodeButtonRowCopy] = {icon: 'el-icon-copy-document', label: '拷贝', type: 'primary', circle: true}
code2OptionsMapping[CodeButtonRowSaveLocal] = {
    icon: 'el-icon-s-promotion',
    label: '保存到本地',
    type: 'primary',
    circle: true
}
code2OptionsMapping[CodeButtonRowSaveRemote] = {
    icon: 'el-icon-s-promotion',
    label: '保存',
    type: 'primary',
    circle: true
}
code2OptionsMapping[CodeButtonRowHistory] = {icon: 'el-icon-date', label: '历史', type: 'success', circle: true}

code2OptionsMapping[CodeLinkFieldCopy] = {icon: 'el-icon-document-copy', type: 'primary'}
code2OptionsMapping[CodeLinkFieldJump ] = {icon: 'el-icon-link', type: 'primary'}

jsb.each(code2OptionsMapping, function (ss, code) {
    ss.code = code
    if (ss.code.startsWith('btn')) {
        ss.cell = CellNameButton
        ss.plain = false
    }
    if (ss.code.startsWith('link')) {
        ss.cell = CellNameLink
    }
})
