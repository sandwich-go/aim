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
        :toolbar-config="toolbarConfig"
        :table-property="{class:'cg-table-mini-padding',heightSubVH:70}"
        :footer-config="footConfig"
        :edit-config="editConfig"
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

export default {
  name: 'TestingCgTable',
  components: {CgTable},
  props: {
    msg: String
  },
  data() {
    return {
      alertTitle: '',
      toolbarOptionServer: '',
      toolbarConfig: {
        leftSpan:21,
        leftItems: [
          {slot: 'CgAlert', label: "标题内容",showIcon:false, style: {width: 'fit'}},
          {},
          {
            slot: 'CgSelect',
            options: [{label: "s1", value: "s1"}, {label: "s2", value: "s2"}],
            style: {'padding-right': '10px',width:'120px'},
            change: (val) => this.toolbarAlert('CgSelect', val)
          },
          {
            slot: 'SlotOptionsUseDefineSlot',
            options: [{label: "action1", value: "action1"}, {label: "action2", value: "action2"}],
            change: (val) => this.toolbarAlert('SlotOptionsUseDefineSlot', val)
          },
          {},
          {slot: 'CgCheckbox', label: "Checkbox", change: (val) => this.toolbarAlert('CgCheckbox', val)},
          {},
          {slot: 'CgDateRangePicker', change:  (val) => this.toolbarAlert('CgDateRangePicker', val)},
          {slot: 'CgInput', change: (val) => this.toolbarAlert('CgInput', val),style:{width:"120px"}},

          {slot: 'CgSelectGroup',options:[
              {label:"g1",options:[{label:"s1",value:"s1"}]},{label:"g2",options:[{label:"s2",value:"s2"}]}],
            change: (val) => this.toolbarAlert('SlotSelectGroup', val)},

          {label: "导入", code: 'codeImport'},
          {label: "导出", code: 'codeExport', icon: 'el-icon-check', show: false},
          {},
          {label: "查找", code: 'codeSearch', icon: 'el-icon-search', type: 'warning'},
          {label: "新建", code: 'codeNew', icon: 'el-icon-check'},
        ],
        rightItems:['add','refresh','custom','print'],
        style: {'padding-bottom': '20px'}
      },
      editConfig:{
        triggerRowFunc:({row})=>{
          if(row.Online){
            return "用户在线，不允许调整数据"
          }
          return {alert:{type:'success',title:'用户不在线，改吧改吧'}}
        }
      },
      footConfig:{
        leftSpan:12,
        leftItems:[{slot: 'CgAlert', label: "标题内容", style: {width: 'fit'}},'add','custom','print'],
        rightItems:[{slot:'CgPager'},{slot: 'CgAlert', label: "标题内容", style: {width: 'fit'}},'refresh'],
      },
      schema: [
        {
          field: 'id', name: 'ID', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          summary:true,
          slotForm:'CgInput',
          readOnly: true
        },
        {
          field: 'name', name: 'Name', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slot:'CgInput',
          slotForm:'CgSelect'
        },
        {
          field: 'Link',
          name: 'Link',
          showOverflowTooltip:true,
          sortable: true,
          width: 200,
          align: 'center',
          slot:'CgInput',
          slotForm:'CgInput',
          cellTable: function () {
            return {label:'PMT地址',icon:'el-icon-heavy-rain',code:'copyField'}
          }
        },
        {
          field: 'Number', name: 'InputNumber', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slot:'CgInputNumber',
          slotForm:'CgInputNumber',
          CgFormInput:{min:10,max:100,step:2}
        },
        {
          field: 'Icon', name: 'Icon', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slot:'CgIconSelectorInput',
          slotForm:'CgIconSelectorInput',
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
          slot: 'CgCells',
          slotForm:'CgSwitch',
          cellTable: function ({fieldValue}) {
            return [{slot: 'CgAlert', label: fieldValue, style: {width: 'fit'}},{slot:"CgButton",label: "查找", code: 'codeSearch', icon: 'el-icon-search', type: 'warning'}]
          }
        },
        {
          field: 'Tag',
          name: 'Tag',
          type: 'switch',
          sortable: true,
          align: 'center',
          summary:true,
          slot: 'CgViewerTag',
          slotForm:'CgSelectInput',
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
          slotForm:'CgCheckbox',
        },
        {
          field: 'Datetime',
          name: 'Datetime',
          slotForm:'CgDatePicker',
        },
        {
          field: 'DatetimeRange',
          name: 'Datetime',
          slotForm:'CgDateRangePicker',
        },
        {
          field: 'Color',
          name: 'Color',
          slot:'RowSlotColor',
          slotForm:'CgColorPicker',
        },
      ],
      proxyConfig: {
        query() {
          return {
            Data: [
              {id: 4, name: '1111',Link:"http://sample.pmt.centurygame.io/pmt#/dashboard",Icon:'el-icon-user-solid', Online: true, Tag:"g1",Color:'red'},
              {id: 5, name: '2222',Link:"http://sample.pmt.centurygame.io/pmt#/dashboard",Icon:'', Online: false, Tag: "g2",Color:'blue'}
            ],
            Total: 100,
          }
        },
      }
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
    }
  }
}
</script>
