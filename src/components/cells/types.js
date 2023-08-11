const jsb = require("@sandwich-go/jsb")


// 基础类型到form编辑组件映射
export const typeDefaults = {
    input: {
        table:'CellViewLabel',
        form:'CellInput',
        default:'',
        label:'单行文本输入'
    },

    input_number:{
        table:'CellViewLabel',
        form:'CellInputNumber',
        default:0,
        minTableColumnWidth:90,
        label:'数组输入'
    },
    textarea: {
        table:'CellViewLabel',
        form:'CellInputTextArea',
        default:'',
        label:'多行文本输入'
    },
    select: {
        table:'CellViewTag',
        form:'CellSelect',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value')
        },
        label:'下拉单选'
    },
    select_input:{
        table:'CellViewLabel',
        form:'CellSelectInput',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value')
        },
        label:'下拉单选 或 单行文本输入'
    },
    select_input_tag:{
        table:'CellViewTag',
        form:'CellSelectInput',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value')
        },
        label:'下拉单选 或 标签输入'
    },
    select_multiple: {
        table:'CellViewTag',
        form:'CellSelectMultiple',
        default: () => [],
        label:'下拉多选'
    },
    select_multiple_input: {
        table:'CellViewTag',
        form:'CellSelectMultipleInput',
        default: () => [],
        label:'下拉多选 或 标签输入'
    },
    select_group:  {
        table:'CellViewTag',
        form:'CellSelectGroup',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.options.0.value')
        },
        label:'下拉单选，候选项分组显示'
    },
    element_icon: {
        table:'CellViewIcon',
        form:'CellIconSelectorInput',
        default: '',
        minTableColumnWidth:180,
        label:'Element icon选择'
    },
    color: {
        table:'CellViewColor',
        form:'CellColorPicker',
        default: '',
        label:'颜色选择'
    },
    datetime:  {
        table:'CellViewLabel',
        form:'CellDatePicker',
        default: () => jsb.dateTime(),
        minTableColumnWidth:200,
        label:'日期时间选择'
    },
    datetime_range:  {
        table:'CellDateRangePicker',
        form:'CellDateRangePicker',
        default: () => jsb.dateTime(),
        minTableColumnWidth:360,
        label:'日期时间范围选择'
    },
    switch:  {
        table:'CellViewBoolean',
        form:'CellSwitch',
        default:false,
        label:'状态开关'
    },
    checkbox: {
        table:'CellViewBoolean',
        form:'CellCheckbox',
        default:false,
        label:'单选状态开关'
    },
    // 复杂类型
    table: {
        table:'CellTriggerTable',
        form:'AimTable',
        default:() => [],
        label:'表格'
    },
    object: {
        table:'CellTriggerFormInput',
        form:'AimFormInput',
        default:() => {},
        label:'对象'
    },
    code:{
        table:'CellTriggerCodeMirror',
        form:'CellCodeMirror',
        default:'',
        label:'代码'
    },
    password:{
        table:'CellViewLabel',
        form:'CellPassword',
        default:'',
        label:'密码'
    },
    image:{
        table:'CellViewImage',
        table_inplace:'CellTriggerImageSelect',
        form:'CellInputImage',
        default:'',
        label:'图像'
    }
}

export const TypeOptions = []
jsb.each(typeDefaults,(item,key)=>{
    TypeOptions.push({label:item.label,value:key})
})

// 基础类型到table显示组件的映射
export const types2TableCellName = {}
jsb.each(typeDefaults,(val,key)=>{
    types2TableCellName[key] = val.table
})

// 基础类型到form编辑组件映射
export const type2FormCellName = {}
jsb.each(typeDefaults,(val,key)=>{
    type2FormCellName[key] = val.form
})

export const type2DefaultVal = {}
jsb.each(typeDefaults,(val,key)=>{
    type2DefaultVal[key] = val.default
})


export function minWidthTableColumn(fieldType) {
    return jsb.pathGet(typeDefaults,`${fieldType}.minTableColumnWidth`,80)
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
    options:{}, // 可选数据源，当组件为select类型时

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