const jsb = require("@sandwich-go/jsb")


// 基础类型到form编辑组件映射
export const typeDefaults = {
    input: {
        table:'CellViewLabel',
        form:'CellInput',
        default:'',
        label:'单行文本输入',
        placeholderSupport:true,
        valueTypeSupport:true, // 无法区分是字符串或者数字
    },
    slider:{
        table:'CellViewLabel',
        form:'CellSlider',
        default:0,
        label:'Slider',
        placeholderSupport:false,
    },
    input_number:{
        table:'CellViewLabel',
        form:'CellInputNumber',
        default:0,
        minTableColumnWidth:90,
        label:'数字输入',
        placeholderSupport:true,
    },
    textarea: {
        table:'CellViewLabel',
        form:'CellInputTextArea',
        default:'',
        label:'多行文本输入',
        placeholderSupport:true,
    },
    select: {
        table:'CellViewTag',
        form:'CellSelect',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value','')
        },
        label:'下拉单选',
        placeholderSupport:true,
        valueTypeSupport:true, // 无法区分是字符串或者数字
    },
    select_input:{
        table:'CellViewLabel',
        form:'CellSelectInput',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value','')
        },
        label:'下拉单选 或 单行文本输入',
        placeholderSupport:true,
        valueTypeSupport:true, // 无法区分是字符串或者数字
    },
    select_input_tag:{
        table:'CellViewTag',
        form:'CellSelectInput',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.value','')
        },
        label:'下拉单选 或 标签输入',
        placeholderSupport:true,
    },
    select_multiple: {
        table:'CellViewTag',
        form:'CellSelectMultiple',
        default: () => {return []},
        label:'下拉多选',
        placeholderSupport:true,
    },
    select_multiple_input: {
        table:'CellViewTag',
        form:'CellSelectMultipleInput',
        default: () => {return []},
        label:'下拉多选 或 标签输入',
        placeholderSupport:true,
    },
    select_group:  {
        table:'CellViewTag',
        form:'CellSelectGroup',
        default: (fs) => {
            return jsb.pathGet(fs, 'options.0.options.0.value','')
        },
        label:'下拉单选，候选项分组显示',
        placeholderSupport:true,
    },
    element_icon: {
        table:'CellViewIcon',
        form:'CellIconSelectorInput',
        default: '',
        minTableColumnWidth:180,
        label:'Element icon选择',
        placeholderSupport:true,
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
        label:'日期时间选择',
        placeholderSupport:true,
    },
    datetime_range:  {
        table:'CellDateRangePicker',
        form:'CellDateRangePicker',
        default: () => jsb.dateTime(),
        minTableColumnWidth:360,
        label:'日期时间范围选择',
        placeholderSupport:true,
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
        default: () => {return []},
        label:'表格',
        tagType:"warning",
        tagEffect:"light"
    },
    object: {
        table:'CellTriggerFormInput',
        form:'AimFormInput',
        default: () => {return {}},
        label:'对象',
        tagType:"warning",
        tagEffect:"light"
    },
    code:{
        table:'CellViewCode',
        form:'CellCodeMirror',
        default:'',
        label:'代码',
        placeholderSupport:true,
    },
    password:{
        table:'CellViewLabel',
        form:'CellPassword',
        default:'',
        label:'密码',
        placeholderSupport:true,
    },
    address:{
        table:'CellViewLink',
        form:'CellInput',
        default:'',
        label:'链接',
        placeholderSupport:true,
    },
    image:{
        table:'CellViewImage',
        table_inplace:'CellTriggerImageSelect',
        form:'CellInputImage',
        default:'',
        label:'图像',
        placeholderSupport:true,
    },
    html:{
        table:'CellViewHTML',
        table_inplace:'CellViewHTML',
        form:'CellEditorHTML',
        default:'',
        label:'HTML',
        placeholderSupport:false,
    },
    html_popup:{
        table:'CellViewHTMLPopup',
        table_inplace:'CellViewHTML',
        form:'CellEditorHTML',
        default:'',
        label:'HTMLPopup',
        placeholderSupport:false,
    }
}

export const TypeOptions = []
jsb.each(typeDefaults,(item,key)=>{
    TypeOptions.push({
        label:item.label,
        value:key,
        tagType:item.tagType,
        tagEffect:item.tagEffect,
        comment:item.comment,
    })
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

export function numberProcess({value,pathSlice,fieldName}) {
    if(!value){
        return 0
    }
    let num = parseFloat(value);
    if (isNaN(num)) {
        pathSlice = pathSlice || []
        throw `value: ${value} at ${pathSlice.join(".")}.${fieldName} is not number`
    }
    return num;
}
export function objectProcess({value}) {
    return jsb.isNull(value)||jsb.isUndefined(value)?{}:value
}
export function arrayProcess({value}) {
    return jsb.isNull(value)||jsb.isUndefined(value)?[]:value
}
export function stringProcess({value}) {
    if(!value){
        value = ''
    }
    return  String(value).trim().replace(/^\s+|\s+$/g, '')
}
export function boolProcess({value}) {
    if(jsb.isBoolean(value)){
        return value
    }
    const strVal = String(value).toLowerCase()
    return !(value === false || strVal === "false" || strVal === "0" || strVal === "null" || strVal === "undefined" ||jsb.isEmpty(value));
}

export function formatValue(fieldType,fieldValue) {
    if(fieldType === 'input_number') {
        return numberProcess({value:fieldValue})
    }
    if(fieldType === 'switch' || fieldType === 'checkbox') {
        return boolProcess({value:fieldValue})
    }
    if(jsb.isString(fieldValue)){
        return stringProcess({value:fieldValue})
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