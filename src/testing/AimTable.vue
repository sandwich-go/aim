<template>
  <div>
    <el-alert
        style="height: 28px;margin-bottom: 9px;font-weight: bold"
        :title="alertTitle"
        show-icon
        :closable="false"
        type="info"></el-alert>
    <aim-table
        ref="table"
        :debug="true"
        :schema="schema"
        :should-cell-disable="shouldCellDisable"
        :should-cell-hide="shouldCellHide"
        :header-config="toolbarConfig()"
        :selection="true"
        :expand-config="{}"
        :editor-proxy-config="editorProxyConfig"
        :edit-config="editConfig"
        :table-property="tableProperty"
        :footer-config="footConfig"
        :sort-config="{remote:false,orders:[{field:'name',order:'desc'}]}"
        :righter-config="rightBarConfig"
        :visitor-config="tableVisitorData"
        :proxy-config="proxyConfig">
      <template v-slot:SlotOptionsUseDefineSlot="{cellConfig}">
        <el-select v-model="toolbarOptionServer" size="mini" @change="cellConfig.change">
          <el-option
              v-for="option of cellConfig.options"
              :label="option.label"
              :value="option.value"
              :key="option.value"
          ></el-option>
        </el-select>
      </template>
    </aim-table>
  </div>
</template>

<script>
import AimTable from "@/components/AimTable/index.vue";
import {
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitcher, EditTriggerInplaceNone,
  EditTriggerSwitchButton,
  RowEditorFormInput,
  RowEditorInplace
} from "@/components/AimTable/table";
import {
  CodeButtonAdd,
  CodeButtonCustom, CodeButtonExpandAll,
  CodeButtonPrint,
  CodeButtonRefresh, CodeButtonRowClose,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowHistory,
  CodeButtonRowSaveRemote, CodeButtonRowSelectedMinus, CodeButtonSaveTableData, CodeButtonTableSetting,
  CodeLinkFieldCopy, CodeLinkFieldJump
} from "@/components/cells/const";

const jsb = require("@sandwich-go/jsb")
export default {
  name: 'TestingAimTable',
  components: {AimTable},
  props: {
    msg: String
  },
  data() {
    const _this = this
    return {
      alertTitle: '',
      toolbarOptionServer: '',
      tableProperty: {
        heightSubVH: 80,
        autoWidth: false
      },
      editConfig: {
        rowEditor: RowEditorFormInput,
        trigger: EditTriggerDBLClickOrSwitcher,
        triggerRowFunc: ({row}) => {
          if (row.Online) {
            return "用户在线，不允许调整数据"
          }
          return {alert: {type: 'success', title: '用户不在线，改吧改吧'}}
        }
      },
      footConfig: {
        leftSpan: 12,
        leftCells: [{
          cell: 'CellViewAlert',
          label: "标题内容",
          style: {width: 'fit'}
        }, CodeButtonAdd, CodeButtonRefresh, CodeButtonCustom, CodeButtonPrint],
        rightCells: [{cell: 'CellPager'}, {cell: 'CellViewAlert', label: "标题内容", style: {width: 'fit'}}, CodeButtonRefresh],
      },
      rightBarConfig: {
        cells: [CodeButtonAdd,CodeButtonRowSelectedMinus, CodeButtonRefresh, CodeButtonCustom, CodeButtonPrint],
      },
      schema: [
        {
          field: 'id', name: 'ID',
          type: 'input',
          sortable: true,
          locked:true,
          cellHeader:[CodeLinkFieldJump],
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          summary: true,
          readOnly: true,
          fixed:"left",
          backgroundAsHeader: true,
          filter:{}
        },
        {
          field: 'name', name: 'Name', sortable: true, uniq: true,
          placeholder: "xxx.xx",
          comment: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cell: function ({row}) {
            return row.id < 5 ? 'CellInput' : 'CellSelect'
          },
          cellForm: function ({row}) {
            return !row.id || row.id < 5 ? 'CellInput' : 'CellSelect'
          },
        },
        {
          field: 'AuthInfo',
          name: 'AuthInfo',
          width: 100,
          type:'table',
          cellConfig:{
            trigger:{
              label:'编辑',
            },
            tableConfig:{
              tableProperty:{autoWidth: false},
              editConfig:{rowEditor: RowEditorInplace,trigger:EditTriggerInplaceNone},
            }
          },
          cellFormConfig:{
            tableConfig:{
              tableProperty:{autoWidth: false},
              editConfig:{rowEditor: RowEditorInplace,trigger:EditTriggerInplaceNone},
            },
          },
          fields:[
            {field:'UseSystemSSH',name:'系统SSH秘钥',cellForm: 'CellSwitch',cell:'CellSwitch',width:160,},
            {field:'UserName',name:'UserName',cellForm: 'CellInput',cell:'CellInput',width:300},
            {field:'Password',name:'Password',cellForm: 'CellInput',cell:'CellInput'}
          ],
        },

        {
          field: 'AuthInfoObject', name: 'AuthInfoObject', width: 100,
          type:'object',
          cellFormConfig:{
            tableProperty:{autoWidth: false},
            editConfig:{rowEditor: RowEditorInplace,trigger:EditTriggerInplaceNone},
          },
          fields:[
            {field:'UseSystemSSH',name:'系统SSH秘钥',cellForm: 'CellSwitch',cell:'CellSwitch',width:160,},
            {field:'UserName',name:'UserName',cellForm: 'CellInput',cell:'CellInput',width:300},
            {field:'Password',name:'Password',cellForm: 'CellInput',cell:'CellInput'}
          ],
        },
        {
          field: 'Link',
          name: 'Link',
          showOverflowTooltip: true,
          sortable: true,
          align: 'center',
          cell: 'CellList',
          cellConfig: function ({fieldValue}) {
            if(!fieldValue){
              return []
            }
            return [CodeLinkFieldCopy, {href: fieldValue, label: 'PMT地址', cell: 'CellViewLink'},CodeButtonRowEdit]
          }
        },
        {
          field: 'Number', name: 'InputNumber', type: 'input', sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cell: 'CellInputNumber',
          cellForm: 'CellInputNumber',
        },
        {
          field: 'Icon', name: 'Icon', type: 'input', sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cell: 'CellIconSelectorInput',
          cellForm: 'CellIconSelectorInput',
          cellConfig: function ({fieldValue}) {
            return {class: fieldValue, label: fieldValue}
          }
        },
        {
          field: 'Online',
          name: '在线',
          type: 'switch',
          sortable: true,
          align: 'center',
          readOnly: true,
          default: false,
          cellForm: 'CellSwitch',
        },
        {
          field: 'Tag',
          name: 'Tag',
          type: 'switch',
          sortable: true,
          align: 'center',
          summary: true,
          cellForm: 'CellSelectInput',
          options: [
            {label: "g1", value: "g1"}, {label: "g2", value: "g2"}
          ]
        },

        {
          field: 'Checkbox',
          name: 'Checkbox',
          type: 'switch',
          sortable: true,
          align: 'center',
          cell: 'CellCheckbox',
          cellForm: 'CellCheckbox',
        },
        {
          field: 'Datetime',
          type:'datetime',
          name: 'Datetime',
          cell: 'CellDatePicker',
          cellForm: 'CellDatePicker',
          filter:{},
        },
        {
          field: 'DatetimeRange',
          name: 'Datetime',
          cell: 'CellDateRangePicker',
          cellForm: 'CellDateRangePicker',
        },
        {
          field: 'Color',
          name: 'Color',
          width: 80,
          cell: 'CellViewColor',
          cellForm: 'CellColorPicker',
        },
        {
          field:'virtualLinks',
          virtual: true,
          name: '操作',
          width: 50,
          align:'center',
          fixed: 'right',
          sortable:false,
          isAction:true,
          cell: 'CellList',
          cellConfig: ['link@'+CodeButtonRowClose]
        },
        {
          field:'virtualButtons',
          virtual: true,
          backgroundAsHeader:true,
          fixed: 'right',
          name: '操作',
          width: 200,
          sortable:false,
          isAction:true,
          cell: 'CellList',
          cellConfig: [`link@${CodeButtonRowEdit}`, 'link@'+CodeButtonRowSaveRemote, CodeButtonRowDelete, CodeButtonRowCopy, CodeButtonRowHistory]
        },
      ],

      editorProxyConfig:{
        query() {
          return new Promise((resolve) => {
            resolve( {
              Data: jsb.clone(_this.tableVisitorData), //模拟数据返回
            })
          })
        },
        saveTableData({tableData}) {
          _this.tableVisitorData= tableData
        }
      },
      proxyConfig: {
        query() {
          return new Promise((resolve) => {
            resolve( {
              Data: jsb.clone(_this.tableData), //模拟数据返回
              Total: _this.tableData.length,
            })
          })
        },
        delete({row}) {
          jsb.remove(_this.tableData, item => item.id === row.id)
        },
        deleteRows({rows}) {
          jsb.remove(_this.tableData, item => jsb.find(rows,v=>v.id === item.id))
        },
        save: ({row}) => {
          return new Promise((resolve) => {
            if (!row.id) {
              row.id = _this.nextID
              _this.nextID += 1
              //新建数据
              _this.tableData.push(row)
            } else {
              jsb.each(_this.tableData, function (item, index) {
                if (item.id === row.id) {
                  _this.tableData[index] = row
                }
              })
            }
            resolve(true)
          })
        },
      },
      tableVisitorData:{
        id:{show:true,groupCouldView:['*'],groupCouldEdit:['server']},
        name:{show:true,userCouldView:['*'],groupCouldEdit:['server']},
        Link:{show:true,userCouldView:['*'],groupCouldEdit:['server']},
      },
      tableData: [
        {
          id: 4,
          name: '1111',
          Link: "http://sample.pmt.centurygame.io/pmt#/dashboard",
          Icon: 'el-icon-user-solid',
          Online: true,
          Tag: "g1",
          Color: '#ea8271'
        },
        {
          id: 5,
          name: '2222',
          Link: "http://sample.pmt.centurygame.io/pmt#/dashboard",
          Icon: '',
          Online: false,
          Tag: "g2",
          Color: '#4b4ba3',
          Checkbox: true
        },
        {
          id: 6,
          name: 'name6',
          Link: "http://sample.pmt.centurygame.io/pmt#/dashboard",
          Icon: '',
          Online: false,
          Tag: "g2",
          Color: '#c26700',
          Checkbox: true
        }
      ],
      nextID: 1000,
    }
  },
  methods: {
    toolbarAlert(name, val) {
      this.alertTitle = `toolbar ${name} change to ${val}`
    },
    shouldCellDisable({code,row,fieldSchema}) {
      if(row && code===CodeButtonRowDelete){
        return row.Online
      }
      if(row && fieldSchema){
        return fieldSchema.field ==='name' && row[fieldSchema.field]<2000
      }
      return false
    },
    shouldCellHide({code,row}) {
      if(row && code===CodeButtonRowDelete){
        return row.Checkbox
      }
      return false
    },
    toolbarConfig() {
      const _this = this
      return {
        leftSpan: 21,
        leftCells: [
            "filter",
          {},
          {
            cell: 'CellSelect',
            options: [
              {label: EditTriggerSwitchButton, value: EditTriggerSwitchButton},
              {label: EditTriggerDBLClick, value: EditTriggerDBLClick},
              {label: EditTriggerDBLClickOrSwitcher, value: EditTriggerDBLClickOrSwitcher},
            ],
            field: 'trigger',
            data: _this.editConfig,
            style: {'padding-right': '10px', width: '160px'},
            change: function (val) {
              _this.toolbarAlert('CellSelect trigger', val)
            }
          },
          {
            cell: 'CellSelect',
            options: [
              {label: RowEditorInplace, value: RowEditorInplace},
              {label: RowEditorFormInput, value: RowEditorFormInput},
            ],
            field: 'rowEditor',
            data: _this.editConfig,
            change: function (val) {
              _this.editConfig.rowEditor = val
              _this.toolbarAlert('CellSelect rowEditor', val)
            },
            style: {'padding-right': '10px', width: '160px'},
          },
          {
            cell: 'CellCheckbox',
            field: 'autoWidth',
            data: _this.tableProperty,
            label: "自适应列宽", change: (val) => {
              this.toolbarAlert('CellCheckbox', val)
              this.$nextTick(()=>{
                this.$refs.table.doLayout()
              })
            }
          },
          {
            slot: 'SlotOptionsUseDefineSlot',
            options: [{label: "action1", value: "action1"}, {label: "action2", value: "action2"}],
            change: (val) => this.toolbarAlert('SlotOptionsUseDefineSlot', val)
          },
          {},
          {cell: 'CellCheckbox', label: "Checkbox", change: (val) => this.toolbarAlert('CellCheckbox', val)},
          'btn@myImport@label_导入@icon_el-icon-check',
          {label: "导出", code: 'btn@myExport', icon: 'el-icon-check', show: false},
          {label: "新建", code: 'btn@myNew', icon: 'el-icon-check'},
          {},
          {label: "查找", code: 'link@mySearch', icon: 'el-icon-search', type: 'warning'},
        ],
        rightCells: [CodeButtonSaveTableData,CodeButtonAdd, CodeButtonRefresh, CodeButtonCustom, CodeButtonPrint,CodeButtonExpandAll,CodeButtonTableSetting],
        style: {'padding-bottom': '9px'}
      }
    }
  }
}
</script>
