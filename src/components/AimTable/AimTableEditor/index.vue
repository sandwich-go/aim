<template>
  <div>
    <cell-view-alert style="position: sticky;font-weight: bold;top:0;margin-bottom: 9px;z-index: 1000000;border-radius: 0" :cell-config="{label:'配置表格字段显示顺序、显示格式、访问属性授权.',showIcon:true}">
    </cell-view-alert>
    <aim-table
        :schema="editorSchema"
        :proxy-config="proxyConfig()"
        :table-property="{autoWidth:false}"
        :popup-append-to-body="true"
        :drag-config="{icon:true}"
        :header-config="{rightCells:[CodeButtonSaveTableData,CodeButtonRefresh],style:{'padding-right':'9px'}}"
        :edit-config="{rowEditor: RowEditorInplace,trigger:EditTriggerInplaceNone}"
    ></aim-table>
  </div>
</template>

<script>

import {CodeButtonRefresh, CodeButtonSaveTableData
} from "@/components/cells/const";
import {EditTriggerInplaceNone, RowEditorInplace} from "@/components/AimTable/table";
import MixinTableEditorConfig from "@/components/AimTable/mixins/MixinTableEditorConfig.vue";
import CellViewAlert from "@/components/cells/CellViewAlert.vue";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'AimTableEditor',
  mixins: [MixinTableEditorConfig],
  components: {
    CellViewAlert,
    AimTable: () => import("@/components/AimTable/index.vue"),
  },
  props: {
    schema: Array,
  },

  data() {
    const _this = this
    return {
      RowEditorInplace,
      CodeButtonSaveTableData,
      CodeButtonRefresh,
      EditTriggerInplaceNone,
      editorSchema: [
        {field: 'field', name: '字段名', width: 200},
        {field: 'name', name: '名称', width: 200},
        {
          field: 'cellTableName',
          name: 'Table显示/编辑组件',
          cellTableName:'CellViewTag',
          cellTable: _this.cellNameTag,
          width: 200
        },
        {
          field: 'cellFormName',
          name: 'Form编辑组件',
          cellTableName: 'CellViewTag',
          cellTable: _this.cellNameTag,
          width: 200
        },
        {field: 'width', name: '宽度', width: 130,type:'input_number'},
        {field: 'min_width', name: '最小宽度', width: 160,type:'input_number'},
        {field: 'max_width', name: '最大宽度', width: 160,type:'input_number'},
        {field: 'show', name: '默认显示',type:'switch', width: 120,cellTable:({row})=>{
            return jsb.pathGet(_this.visitorData,`${row.field}.show`,true)
        }},
        {field: 'groupCouldView', width: 300, name: '可查看(组)',type:'select_multiple'},
        {field: 'groupCouldEdit', width: 300, name: '可编辑(组)', type:'select_multiple'},
        {field: 'userCouldView', width: 300, name: '可查看(人)', type:'select_multiple'},
        {field: 'userCouldEdit', width: 300, name: '可编辑(人)', type:'select_multiple'},
        {field: 'tips', width: 300, name: 'Table字段说明', cellTableName:'input'},
      ],
      visitorData: {},
    }
  },
  methods: {
    cellNameTag({fieldValue}, dVal ='CellInput') {
      return jsb.isFunction(fieldValue) ? {label: 'Function', type: 'warning'} : (fieldValue || dVal)
    },
    proxyConfig() {
      const _this = this
      return      {
        item2Row(item){
          item.show = jsb.pathGet(_this.visitorData,`${item.field}.show`,true)
          item.groupCouldView = jsb.pathGet(_this.visitorData,`${item.field}.groupCouldView`,['*'])
          item.groupCouldEdit = jsb.pathGet(_this.visitorData,`${item.field}.groupCouldEdit`,['*'])
          item.userCouldView = jsb.pathGet(_this.visitorData,`${item.field}.userCouldView`,['*'])
          item.userCouldEdit = jsb.pathGet(_this.visitorData,`${item.field}.userCouldEdit`,['*'])
          return item
        },
        query() {
          return new Promise((resolve, reject) => {
            Promise.resolve(_this.editorProxyConfigRef.query({key: _this.editorTableKey})).then((resp) => {
              _this.visitorData = jsb.pathGet(resp, 'Data', {})
              resolve({Data: _this.schema})
            }).catch((e) => {
              reject(e)
            })
          })
        },
        saveTableData:function ({tableData}) {
          let tableVisitorData = {}
          jsb.each(tableData,function (v,index){
            tableVisitorData[v.field] = {
              field:v.field,
              show:jsb.pathGet(v,'show',true),
              sortIndex:index,
              groupCouldView:v.groupCouldView,
              groupCouldEdit:v.groupCouldEdit,
              userCouldView:v.userCouldView,
              userCouldEdit:v.userCouldEdit,
              tips:v.tips
            }
          })
          _this.editorProxyConfigRef.saveTableData({tableData:tableVisitorData})
        }
      }
    }
  }
}
</script>