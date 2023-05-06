const jsb = require("@sandwich-go/jsb")


// 基础类型到form编辑组件映射
export const type2FormCellName = {
    input: 'CellInput',
    input_number: 'CellInputNumber',
    textarea: 'CellInputTextArea',
    select: 'CellSelect',
    select_input: 'CellSelectInput',
    select_multiple: 'CellSelectMultiple',
    select_group: 'CellSelectGroup',
    element_icon: 'CellIconSelectorInput',
    color: 'CellColorPicker',
    datetime: 'CellDatePicker',
    switch: 'CellSwitch',
    checkbox: 'CellCheckbox',
    // 复杂类型
    table: 'AimTable',
    object: 'AimFormInput',
}

export function formatValue(fieldType,fieldValue) {
    if(fieldType === 'input_number') {
        return Number(fieldValue)
    }
    if(jsb.isString(fieldValue)){
        return fieldValue.trim()
    }
    return fieldValue
}

export const type2DefaultVal = {
    input: '',
    input_number: 0,
    textarea: '',
    select: (fs) => {
        return jsb.pathGet(fs, 'options.0.value')
    },
    select_input: (fs) => {
        return jsb.pathGet(fs, 'options.0.value')
    },
    select_multiple: [],
    select_group: (fs) => {
        return jsb.pathGet(fs, 'options.0.options.0.value')
    },
    element_icon: '',
    color: '',
    datetime: () => jsb.dateTime(),
    switch: false,
    checkbox: false,
    // 复杂类型
    table: () => [],
    object: () => ({})
}

// 基础类型到table显示组件的映射
export const types2TableCellName = {
    input: 'CellViewLabel',
    input_number: 'CellViewLabel',
    textarea: 'CellViewLabel',
    select: 'CellViewTag',
    select_input: 'CellViewTag',
    select_multiple: 'CellViewTag',
    select_group: 'CellViewTag',
    element_icon: 'CellViewIcon',
    color: 'CellViewColor',
    datetime: 'CellViewLabel',
    switch: 'CellViewBoolean',
    checkbox: 'CellViewBoolean',
    table: 'CellTriggerTable',
    object: 'CellTriggerFormInput',
}

// 基础类型到table显示组件的映射
export const types2TableInplaceCellName = jsb.clone(type2FormCellName)
types2TableInplaceCellName.table = 'CellTriggerTable'
types2TableInplaceCellName.object = 'CellTriggerFormInput'

// cellNameForTableInplaceByType 由基础类型获取table内的组件名称
export function cellNameForTableInplaceByType(sType, defaultVal = 'CellInput') {
    return jsb.pathGet(types2TableInplaceCellName, sType, defaultVal)
}

// cellNameForTableByType 由基础类型获取table内的组件名称
export function cellNameForTableByType(sType, defaultVal = 'CellViewLabel') {
    return jsb.pathGet(types2TableCellName, sType, defaultVal)
}

// cellNameForFormByType 由基础类型获取table内的组件名称
export function cellNameForFormByType(sType, defaultVal = 'CellInput') {
    return jsb.pathGet(type2FormCellName, sType, defaultVal)
}


// eslint-disable-next-line no-unused-vars
const sample_field_schema = {
    field: '',      // 字段名
    name: '',       // table-column 名称
    width: 100,      // table-column width，单位px
    min_width: 100,  // table-column min_width，单位px
    max_width: 100,  // table-column max_width，单位px
    align: 'center', // table-column align
    sortable: false, // table-column sortable

    options: [],     // 类型为select*时的候选项，或者显示为tag列表时的候选项
    fields: [],      // 类型为object或table时的元素schema

    readOnly: false,   // 是否为只读
    insertOnly: false, // 是否只允许insert,
    rules: [],         // form editor rule，table目前不适用
    uniq: false,       // 字段是否为在当前表内唯一
    required: false,   // 字段是否必需

    type: '',          // 字段类型，简化table和form的配置，同时根据type类推导默认值

    // table内使用的cell名称或者名称获取的方法, 便于根据row内的字段决定当前的组件类型
    // eslint-disable-next-line no-unused-vars
    cell: [String, function ({row}) {
        return ''
    }],
    // table内cell组件的配置
    // 返回配置+数据(数据为显示数据，如显示为一个label) 或组件配置(editor组件时数据为字段真实数据),具体返回的数据根据组件进行适配
    // function 根据具体的组件需求返回恰当的数据格式
    // eslint-disable-next-line no-unused-vars
    cellConfig: [Object, Array, function ({row}) {
    }],
    slot: '', // table使用的slot名称
    header: [], // column的cell list

    // form内组件设定
    cellFrom: [String, Function],
    cellFromConfig: [String, Function],
    slotForm: '', // table使用的slot名称
}