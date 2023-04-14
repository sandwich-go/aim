<template>
  <div>
    <el-alert v-if="alertTitle"
              style="height: 28px;margin-bottom: 30px;font-weight: bold"
              :title="alertTitle"
              effect="dark"
              :closable="false"
              type="success"></el-alert>
    <cg-table
        :debug="true"
        :schema="schema"
        :should-button-disable="shouldButtonDisable"
        :should-button-hide="shouldButtonHide"
        :toolbar-config="toolbarConfig"
        :table-property="{}"
        :footer-config="footConfig"
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

const jsb = require("@sandwich-go/jsb")

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
          {slot: 'SlotAlert', label: "标题内容", style: {width: 'fit'}},
          {},
          {
            slot: 'SlotOptions',
            options: [{label: "s1", value: "s1"}, {label: "s2", value: "s2"}],
            style: {'padding-right': '10px',width:'120px'},
            change: (val) => this.toolbarAlert('SlotOptions', val)
          },
          {
            slot: 'SlotOptionsUseDefineSlot',
            options: [{label: "action1", value: "action1"}, {label: "action2", value: "action2"}],
            change: (val) => this.toolbarAlert('SlotOptionsUseDefineSlot', val)
          },
          {},
          {slot: 'SlotCheckbox', label: "Checkbox", change: (val) => this.toolbarAlert('SlotCheckbox', val)},
          {},
          {slot: 'SlotDateTimeRange', change:  (val) => this.toolbarAlert('SlotDateTimeRange', val)},
          {slot: 'SlotInput', change: (val) => this.toolbarAlert('SlotInput', val)},

          {slot: 'SlotSelectGroup',options:[
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
      footConfig:{
        leftSpan:12,
        leftItems:[{slot: 'SlotAlert', label: "标题内容", style: {width: 'fit'}},'add','custom','print'],
        rightItems:[{slot:'SlotPager'},{slot: 'SlotAlert', label: "标题内容", style: {width: 'fit'}},'refresh'],
      },
      schema: [
        {
          field: 'id', name: 'ID', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slotForm:'FormInput',
          readOnly: true
        },
        {
          field: 'name', name: 'Name', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slotForm:'FormInput'
        },
        {
          field: 'Number', name: 'InputNumber', type: 'input', width: 200, sortable: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          slotForm:'FormInputNumber',
          formConfig:{min:10,max:100,step:2}
        },
        {
          field: 'Online',
          name: '在线',
          type: 'switch',
          sortable: true,
          align: 'center',
          readOnly: true,
          default: false,
          slot: 'ColumnSlots',
          slotForm:'FormSwitch',
          valueVirtual: function () {
            return [{slot: 'SlotAlert', label: "标题内容", style: {width: 'fit'}},{slot:"SlotButton",label: "查找", code: 'codeSearch', icon: 'el-icon-search', type: 'warning'}]
          }
        },
        {
          field: 'Tag',
          name: 'Tag',
          type: 'switch',
          sortable: true,
          align: 'center',
          slot: 'RowSlotTag',
          slotForm:'FormSelectInput',
          valueVirtual: function ({fieldValue}) {
            let tags = []
            for (const item of fieldValue) {
              tags.push({label: item, type: jsb.randomModIsZero(2) ? 'primary' : 'success'})
            }
            return tags
          },options:[
            {label:"g1",options:[{label:"s1",value:"s1"}]},{label:"g2",options:[{label:"s2",value:"s2"}]}]
        },
        {
          field: 'Checkbox',
          name: 'Checkbox',
          type: 'switch',
          sortable: true,
          align: 'center',
          slotForm:'FormCheckbox',
        },
        {
          field: 'Datetime',
          name: 'Datetime',
          slotForm:'FormDatePicker',
        },
        {
          field: 'DatetimeRange',
          name: 'Datetime',
          slotForm:'FormDateRangePicker',
        },
        {
          field: 'Color',
          name: 'Color',
          slot:'RowSlotColor',
          slotForm:'FormColorPicker',
        },
      ],
      proxyConfig: {
        query() {
          return {
            Data: [{id: 4, name: 'hui.wang', Online: true, Tag: ["Server", "HPA", "定时收缩"]}],
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
