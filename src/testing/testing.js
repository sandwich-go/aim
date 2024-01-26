const jsb = require("@sandwich-go/jsb")

export const EnvVarsTableFields = [
    {field: 'Key', name: 'Key', type:'input',uniq:true,
        headerLinkList: [
            {
                'icon': 'el-icon-refresh',
                'style': {'padding-left': '9px'},
                underline: false,
                click:'CASE_SWITCH'
            }
        ],
    },
    {field: 'Value', name: 'Value', type:'input'},
    {field: 'Comment', name: '注释', type:'input'},
]

export function getEvnVarsFieldList(aimEdit=false) {
    const fields = jsb.clone(EnvVarsTableFields)
    if(aimEdit){
        fields.push({
            field: 'virtualButtons',
            virtual: true,
            backgroundAsHeader: true,
            fixed: 'right',
            name: '操作',
            width: 90,
            align:'center',
            sortable: false,
            cell: 'CellList',
            cellConfig: ['btn@btnRowEdit@l_编辑']
        })
    }
    return fields
}

export function getEvnVarsField(property={}) {
    return  Object.assign( {
        field: 'EnvVars', name: '环境变量', type: 'table', show: false,
        cellFormConfig:{
            tableProperty:{autoWidth:true,stripe:false},
            editConfig:{mode:'inplaceNoTrigger'},
            popupAppendToBody:true,
            formPopupUsingDrawer:false,
        },
        fields: getEvnVarsFieldList()
    },property || {})
}