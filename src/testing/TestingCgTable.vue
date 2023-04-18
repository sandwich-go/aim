<template>
  <div>
    <el-alert
              style="height: 28px;margin-bottom: 9px;font-weight: bold"
              :title="alertTitle"
              show-icon
              :closable="false"
              type="info"></el-alert>
    <cg-table
        :debug="true"
        :schema="schema"
        :should-button-disable="shouldButtonDisable"
        :should-button-hide="shouldButtonHide"
        :toolbar-config="toolbarConfig()"
        :selection="true"
        :table-property="{class:'cg-table-mini-padding',heightSubVH:70}"
        :footer-config="footConfig"
        :edit-config="editConfig"
        :right-bar-config="rightBarConfig"
        :proxy-config="proxyConfig">
      <template v-slot:SlotOptionsUseDefineSlot="{item}">
        <el-select v-model="toolbarOptionServer" size="mini" @change="item.change">
          <el-option
              v-for="option of item.options"
              :label="option.label"
              :value="option.value"
              :key="option.value"
          ></el-option>
        </el-select>
      </template>
    </cg-table>
  </div>
</template>

<script>
import CgTable from "@/components/CgTable";
import {
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitcher,
  EditTriggerSwitchButton, RowEditorFormInput,
  RowEditorInplace
} from "@/components/CgTable/table";
import {
  CodeButtonAdd,
  CodeButtonCustom,
  CodeButtonPrint,
  CodeButtonRefresh, CodeButtonRowCopy, CodeButtonRowDelete,
  CodeButtonRowEdit, CodeButtonRowHistory, CodeButtonRowSaveRemote, CodeLinkFieldCopy
} from "@/components/cells/const";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'TestingCgTable',
  components: {CgTable},
  props: {
    msg: String
  },
  data() {
    const _this = this
    return {
      alertTitle: '',
      toolbarOptionServer: '',
      editConfig:{
        rowEditor:RowEditorFormInput,
        trigger:EditTriggerDBLClickOrSwitcher,
        triggerRowFunc:({row})=>{
          if(row.Online){
            return "用户在线，不允许调整数据"
          }
          return {alert:{type:'success',title:'用户不在线，改吧改吧'}}
        }
      },
      footConfig:{
        leftSpan:12,
        leftCells:[{cell: 'CgAlert', label: "标题内容", style: {width: 'fit'}},CodeButtonAdd,CodeButtonRefresh,CodeButtonCustom,CodeButtonPrint],
        rightCells:[{cell:'CgPager'},{cell: 'CgAlert', label: "标题内容", style: {width: 'fit'}},CodeButtonRefresh],
      },
      rightBarConfig:{
        cells:[CodeButtonAdd,CodeButtonRefresh,CodeButtonCustom,CodeButtonPrint],
      },
      schema: [
        {
          field: 'id', name: 'ID', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          summary:true,
          cellTableName:'CgInput',
          readOnly: true
        },
        {
          field: 'name', name: 'Name', type: 'input', width: 200, sortable: true,uniq:true,
          placeholder: "xxx.xx",
          comment: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cellTableName:function ({row}){
            return row.id <5?'CgInput':'CgSelect'
          },
          cellFormName:function ({row}){
            return !row.id || row.id <5?'CgInput':'CgSelect'
          },
        },
        {
          field: 'Link',
          name: 'Link',
          showOverflowTooltip:true,
          sortable: true,
          width: 300,
          align: 'center',
          cellTableName:'CgCells',
          cellTable:function ({fieldValue}){
            return [CodeLinkFieldCopy, {href:fieldValue,label:'PMT地址',cell:'CgViewerLink'}]
          }
        },
        {
          field: 'Number', name: 'InputNumber', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cellTableName:'CgInputNumber',
          cellFormName:'CgInputNumber',
          CgFormInput:{min:10,max:100,step:2}
        },
        {
          field: 'Icon', name: 'Icon', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cellTableName:'CgIconSelectorInput',
          cellFormName:'CgIconSelectorInput',
          cellTable: function ({fieldValue}) {
            return {class:fieldValue,label:fieldValue}
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
          width: 280,
          cellTableName: 'CgCells',
          cellFormName:'CgSwitch',
          cellTable: function ({fieldValue}) {
            return [{cell: 'CgAlert', label: fieldValue, style: {width: 'fit'}},CodeButtonRowEdit]
          }
        },
        {
          field: 'Tag',
          name: 'Tag',
          type: 'switch',
          sortable: true,
          align: 'center',
          summary:true,
          cellTableName: 'CgSelect',
          cellFormName:'CgSelectInput',
          options:[
            {label:"g1",value:"g1"},{label:"g2",value:"g2"}
          ]
        },
        {
          field: 'Checkbox',
          name: 'Checkbox',
          type: 'switch',
          sortable: true,
          align: 'center',
          cellTableName: 'CgCheckbox',
          cellFormName:'CgCheckbox',
        },
        {
          field: 'Datetime',
          name: 'Datetime',
          cellTableName:'CgDatePicker',
          cellFormName:'CgDatePicker',
        },
        {
          field: 'DatetimeRange',
          name: 'Datetime',
          cellTableName:'CgDateRangePicker',
          cellFormName:'CgDateRangePicker',
        },
        {
          field: 'Color',
          name: 'Color',
          cellTableName:'CgViewerColor',
          cellFormName:'CgColorPicker',
        },
        {
          virtual:true,
          fixed:'right',
          name: '操作',
          width: 200,
          cellTableName:'CgCells',
          cellTable:[CodeButtonRowEdit,CodeButtonRowSaveRemote,CodeButtonRowDelete,CodeButtonRowCopy,CodeButtonRowHistory]
        },
      ],

      proxyConfig: {
        query() {
          return {
            Data: jsb.clone(_this.tableData), //模拟数据返回
            Total: _this.tableData.length,
          }
        },
        delete({row}){
          jsb.remove(this.tableData,item => item.id === row.id)
        },
        save({row}){
          if(!row.id){
            row.id =  _this.nextID
            _this.nextID += 1
            //新建数据
            _this.tableData.push(row)
          }else{
            jsb.each(_this.tableData,function (item,index){
              if(item.id === row.id){
                _this.tableData[index] = row
              }
            })
          }
          return true
        },
      },
      tableData:[
        {id: 4, name: '1111',Link:"http://sample.pmt.centurygame.io/pmt#/dashboard",Icon:'el-icon-user-solid', Online: true, Tag:"g1",Color:'red'},
        {id: 5, name: '2222',Link:"http://sample.pmt.centurygame.io/pmt#/dashboard",Icon:'', Online: false, Tag: "g2",Color:'blue',Checkbox:true}
      ],
      nextID:1000,
    }
  },
  methods: {
    toolbarAlert(name, val) {
      this.alertTitle = `toolbar ${name} change to ${val}`
    },
    shouldButtonDisable({code}) {
      return code === 'codeImport';
    },
    shouldButtonHide({code}) {
      return code === 'codeImport';
    },
    toolbarConfig(){
      const _this = this
      return      {
        leftSpan:21,
            leftCells: [
          {
            cell: 'CgSelect',
            options: [
              {label:EditTriggerSwitchButton, value:EditTriggerSwitchButton},
              {label: EditTriggerDBLClick, value: EditTriggerDBLClick},
              {label: EditTriggerDBLClickOrSwitcher, value: EditTriggerDBLClickOrSwitcher},
            ],
            field:'trigger',
            data:_this.editConfig,
            style: {'padding-right': '10px',width:'160px'},
            change: function (val){
              _this.toolbarAlert('CgSelect trigger', val)
            }
          },
          {
            cell: 'CgSelect',
            options: [
              {label:RowEditorInplace, value:RowEditorInplace},
              {label: RowEditorFormInput, value: RowEditorFormInput},
            ],
            field:'rowEditor',
            data:_this.editConfig,
            change: function (val){
              _this.editConfig.rowEditor = val
              _this.toolbarAlert('CgSelect rowEditor', val)
            },
            style: {'padding-right': '10px',width:'160px'},
          },
          {
            cell: 'SlotOptionsUseDefineSlot',
            options: [{label: "action1", value: "action1"}, {label: "action2", value: "action2"}],
            change: (val) => this.toolbarAlert('SlotOptionsUseDefineSlot', val)
          },
          {},
          {cell: 'CgCheckbox', label: "Checkbox", change: (val) => this.toolbarAlert('CgCheckbox', val)},
          {},
          {cell: 'CgInput', change: (val) => this.toolbarAlert('CgInput', val),style:{width:"120px"}},

          {cell: 'CgSelectGroup',options:[
              {label:"g1",options:[{label:"s1",value:"s1"}]},{label:"g2",options:[{label:"s2",value:"s2"}]}],
            change: (val) => this.toolbarAlert('SlotSelectGroup', val)},

          {label: "导入", code: 'myBtnImport',icon: 'el-icon-check'},
          {label: "导出", code: 'myBtnExport', icon: 'el-icon-check', show: false},
              {label: "新建", code: 'myBtnNew', icon: 'el-icon-check'},
          {},
          {label: "查找", code: 'myLinkSearch', icon: 'el-icon-search', type: 'warning'},

        ],
            rightCells:[CodeButtonAdd,CodeButtonRefresh,CodeButtonCustom,CodeButtonPrint],
            style: {'padding-bottom': '20px'}
      }
    }
  }
}
</script>
