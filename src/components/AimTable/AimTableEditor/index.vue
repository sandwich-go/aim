<template>
  <div>
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <cell-view-alert
        style="position: sticky;font-weight: bold;top:0;margin-bottom: 9px;z-index: 1000000;border-radius: 0"
        :cell-config="{label:'配置表格字段显示顺序、显示格式、访问属性授权.',showIcon:true}">
    </cell-view-alert>
    <aim-table
        :schema="editorSchema"
        :proxy-config="proxyConfig()"
        :table-property="{autoWidth:true}"
        :popup-append-to-body="true"
        :drag-config="{icon:true}"
        :header-config="headerConfig"
        :edit-config="{mode: EditModeFormInput,trigger:EditTriggerDBLClick}"
    ></aim-table>
  </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import {CodeButtonRefresh, CodeButtonSaveTableData} from "@/components/cells/const";
import {
  EditTriggerDBLClick, EditTriggerManualAndDBLClick,
  EditTriggerManual,
  EditModeFormInput,
  EditModeInplace, EditModeInplaceNoTrigger
} from "@/components/AimTable/table";
import MixinTableEditorConfig from "@/components/AimTable/mixins/MixinTableEditorConfig.vue";
import CellViewAlert from "@/components/cells/CellViewAlert.vue";
import { typeOptions} from "@/components/cells/types";

const jsb = require("@sandwich-go/jsb")
export default {
  name: 'AimTableEditor',
  mixins: [MixinTableEditorConfig],
  components: {
    CellViewAlert,
    Loading,
    AimTable: () => import("@/components/AimTable/index.vue"),
  },
  props: {
    schema: Array,
  },

  data() {
    const _this = this
    return {
      EditModeFormInput,
      CodeButtonSaveTableData,
      CodeButtonRefresh,
      EditTriggerDBLClick,
      inLoading: false,
      editorSchema: [
        {field: 'field', name: '字段名',type:'input'},
        {field: 'name', name: '名称',type:'input'},
        {
          field: 'type',type:'select',
          name: '类型',options:typeOptions,
        },
        {field: 'width', name: '宽度',  type: 'input_number'},
        {field: 'min_width', name: '最小宽度',  type: 'input_number'},
        {field: 'max_width', name: '最大宽度', type: 'input_number'},
        {
          field: 'show', name: '默认显示', type: 'switch',
        },
        {field: 'groupCouldView', name: '可查看(组)', type: 'select_multiple'},
        {field: 'groupCouldEdit', name: '可编辑(组)', type: 'select_multiple'},
        {field: 'userCouldView', name: '可查看(人)', type: 'select_multiple'},
        {field: 'userCouldEdit', name: '可编辑(人)', type: 'select_multiple'},
        {field: 'tips', name: 'Table字段说明', type: 'input'},
      ],
      visitorData: {fieldMap: {},autoWidth:false,rowDrag:false,columnDrag:false},
      headerConfig: {
        leftStyle:{gap: '9px'},
        leftCells: [
          {paddingLeft:'9px'},
          {cell: 'CellCheckbox', field: 'autoWidth', data: _this.visitorData, label: '自适应列宽',border:true},
          {cell: 'CellCheckbox', field: 'rowDrag', data: _this.visitorData, label: '行拖拽',border:true},
          {cell: 'CellCheckbox', field: 'columnDrag', data: _this.visitorData, label: '列拖拽',border:true},
          {
            field: 'mode', data: _this.visitorData,
            cell: 'CellSelect',
            options: [
              {label: "行内编辑(无需trigger)", value: EditModeInplaceNoTrigger},
              {label: "行内编辑", value: EditModeInplace},
              {label: "Form表单编辑", value: EditModeFormInput},
            ],
          },
          {
            field: 'rowTrigger', data: _this.visitorData,
            cell: 'CellSelect',
            options: [
              {label: "按钮切换: CodeButtonRowEdit", value: EditTriggerManual},
              {label: "双击编辑", value: EditTriggerDBLClick},
              {label: "双击或按钮切换", value: EditTriggerManualAndDBLClick},
            ],
          },
        ],
        rightCells: [CodeButtonSaveTableData, CodeButtonRefresh],
      },
    }
  },
  methods: {
    proxyConfig() {
      const _this = this
      return {
        item2Row(item) {
          item.show = jsb.pathGet(_this.visitorData.fieldMap, `${item.field}.show`,item.show)
          if(jsb.eqNull(item.show)){
            item.show = true
          }
          item.groupCouldView = jsb.pathGet(_this.visitorData.fieldMap, `${item.field}.groupCouldView`, ['*'])
          item.groupCouldEdit = jsb.pathGet(_this.visitorData.fieldMap, `${item.field}.groupCouldEdit`, ['*'])
          item.userCouldView = jsb.pathGet(_this.visitorData.fieldMap, `${item.field}.userCouldView`, ['*'])
          item.userCouldEdit = jsb.pathGet(_this.visitorData.fieldMap, `${item.field}.userCouldEdit`, ['*'])
          return item
        },
        query() {
          _this.inLoading = true
          return new Promise((resolve, reject) => {
            Promise.resolve(_this.editorProxyConfigRef.query({key: _this.editorTableKey})).then((resp) => {
              _this.visitorData = jsb.pathGet(resp, 'Data', {})
              resolve({Data: _this.schema})
            }).catch((e) => {
              reject(e)
            }).finally(() => {
              _this.inLoading = false
            })
          })
        },
        saveTableData: function ({tableData}) {
          let tableVisitorData = jsb.clone(_this.visitorData)
          tableVisitorData.fieldMap = {}
          jsb.each(tableData, function (v, index) {
            tableVisitorData.fieldMap[v.field] = {
              field: v.field,
              show: jsb.pathGet(v, 'show', true),
              sortIndex: index,
              groupCouldView: v.groupCouldView,
              groupCouldEdit: v.groupCouldEdit,
              userCouldView: v.userCouldView,
              userCouldEdit: v.userCouldEdit,
              tips: v.tips
            }
          })
          _this.editorProxyConfigRef.saveTableData({tableData: tableVisitorData})
        }
      }
    }
  }
}
</script>