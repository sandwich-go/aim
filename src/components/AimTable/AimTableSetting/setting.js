export const fieldSettingSchema  = [
    {field: 'field', name: '字段名',type:'input',sortable:false,width:200},
    {field: 'name', name: '名称',type:'input',sortable:false,width:200},
    {field: 'width', name: '宽度',  type: 'input_number',width:130,sortable:false},
    {field: 'min_width', name: '最小宽度',  type: 'input_number',width:130,sortable:false},
    {field: 'max_width', name: '最大宽度', type: 'input_number',width:130,sortable:false},
    {field: 'show', name: '默认显示', type: 'switch',align:'center',width:100,sortable:false},
    // {field: 'groupCouldView', name: '可查看(组)', type: 'select_multiple',default:["*"]},
    // {field: 'groupCouldEdit', name: '可编辑(组)', type: 'select_multiple',default:["*"]},
    // {field: 'userCouldView', name: '可查看(人)', type: 'select_multiple',default:["*"]},
    // {field: 'userCouldEdit', name: '可编辑(人)', type: 'select_multiple',default:["*"]},
    {field: 'tips', name: '字段说明', type: 'html',sortable:false},
]
import jsb from "@cg-devcenter/jsb";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";
export function fieldSetting(schema,settingFields) {
    const ret = []
    // 返回数据优先按照 settingFields 中的顺序
    jsb.each(settingFields,sf=>{
        const schemaField = jsb.find(schema,v=>v.field === sf.field)
        if(!schemaField){
            // 原始schema不存在该字段则移除
            return
        }
        ret.push(sf)
    })
    // 查找settingFields中缺失的字段
    jsb.each(schema,fs=>{
        const tmp = jsb.find(settingFields,v=>v.field === fs.field)
        if(tmp){
            // 已在settingFields中存在的字段
            return
        }
        const v = FillDefaultDataWithSchema(fieldSettingSchema)
        jsb.each(fieldSettingSchema,tmpField=>{
            if(fs[tmpField.field]){
                v[tmpField.field] = fs[tmpField.field]
            }
        })
        if(jsb.isUndefined(fs['show'])||jsb.isNull(fs['show'])){
            v['show'] = true
        }
        ret.push(v)
    })
    return ret
}