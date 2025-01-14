export const fieldSettingSchema  = [
    {field: 'field', name: '字段名',cell:'CellViewLabel',sortable:false,width:200,},
    {field: 'name', name: '名称',type:'input',sortable:false,width:200,align:'center'},
    {field: 'width', name: '宽度(像素)',  type: 'input_number',width:130,sortable:false,align:'center'},
    {field: 'show', name: '显示', type: 'checkbox',align:'center',width:80,sortable:false},
    {field: 'groupCouldView', name: '可查看',width:100, cell: 'CellViewTag',default:["*"],align:'center'},
    {field: 'groupCouldEdit', name: '可编辑', width:100,cell: 'CellViewTag',default:["*"],align:'center'},
    {field: 'tips', name: '字段说明', type: 'input',sortable:false},
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