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
        :enable-debug="true"
        :schema="schema"
        :group-config="groupConfig"
        :should-cell-disable="shouldCellDisable"
        :should-cell-hide="shouldCellHide"
        :header-config="toolbarConfig()"
        :selection="true"
        :expand-config="{}"
        :editor-proxy-config="editorProxyConfig"
        :edit-config="editConfig"
        :table-property="tableProperty"
        :footer-config="footConfig"
        :sort-config="{remote:false,orders:[{field:'name',order:'desc'}],sortIdxField:'SortIdx'}"
        :righter-config="rightBarConfig"
        :visitor-config="tableVisitorData"
        :pager-config="{}"
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
      <template v-slot:password_tip>
        <el-table
            :data="tipTableData"
            style="width: 100%">
          <el-table-column
              prop="date"
              label="日期"
              width="180">
          </el-table-column>
          <el-table-column
              prop="name"
              label="姓名"
              width="180">
          </el-table-column>
          <el-table-column
              prop="address"
              label="地址">
          </el-table-column>
        </el-table>
      </template>
    </aim-table>
  </div>
</template>

<script>
import AimTable from "@/components/AimTable/index.vue";
import {
  EditTriggerDBLClick,
  EditTriggerManualAndDBLClick,
  EditTriggerManual,
  EditModeFormInput,
  EditModeInplace, EditModeInplaceNoTrigger, xidRow
} from "@/components/AimTable/table";
import {
  CodeButtonAdd,
  CodeButtonCustom, CodeButtonDebug, CodeButtonExpandAll,
  CodeButtonPrint,
  CodeButtonRefresh, CodeButtonRowClose,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowHistory, CodeButtonRowSave,
  CodeButtonRowSelectedMinus, CodeButtonSaveTableData, CodeButtonTableSetting,
  CodeLinkFieldCopy,
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
      cascader: [{
        value: 'zhinan',
        label: '指南',
        children: [{
          value: 'shejiyuanze',
          label: '设计原则',
          children: [{
            value: 'yizhi',
            label: '一致'
          }, {
            value: 'fankui',
            label: '反馈'
          }, {
            value: 'xiaolv',
            label: '效率'
          }, {
            value: 'kekong',
            label: '可控'
          }]
        }, {
          value: 'daohang',
          label: '导航',
          children: [{
            value: 'cexiangdaohang',
            label: '侧向导航'
          }, {
            value: 'dingbudaohang',
            label: '顶部导航'
          }]
        }]
      }, {
        value: 'zujian',
        label: '组件',
        children: [{
          value: 'basic',
          label: 'Basic',
          children: [{
            value: 'layout',
            label: 'Layout 布局'
          }, {
            value: 'color',
            label: 'Color 色彩'
          }, {
            value: 'typography',
            label: 'Typography 字体'
          }, {
            value: 'icon',
            label: 'Icon 图标'
          }, {
            value: 'button',
            label: 'Button 按钮'
          }]
        }, {
          value: 'form',
          label: 'Form',
          children: [{
            value: 'radio',
            label: 'Radio 单选框'
          }, {
            value: 'checkbox',
            label: 'Checkbox 多选框'
          }, {
            value: 'input',
            label: 'Input 输入框'
          }, {
            value: 'input-number',
            label: 'InputNumber 计数器'
          }, {
            value: 'select',
            label: 'Select 选择器'
          }, {
            value: 'cascader',
            label: 'Cascader 级联选择器'
          }, {
            value: 'switch',
            label: 'Switch 开关'
          }, {
            value: 'slider',
            label: 'Slider 滑块'
          }, {
            value: 'time-picker',
            label: 'TimePicker 时间选择器'
          }, {
            value: 'date-picker',
            label: 'DatePicker 日期选择器'
          }, {
            value: 'datetime-picker',
            label: 'DateTimePicker 日期时间选择器'
          }, {
            value: 'upload',
            label: 'Upload 上传'
          }, {
            value: 'rate',
            label: 'Rate 评分'
          }, {
            value: 'form',
            label: 'Form 表单'
          }]
        }, {
          value: 'data',
          label: 'Data',
          children: [{
            value: 'table',
            label: 'Table 表格'
          }, {
            value: 'tag',
            label: 'Tag 标签'
          }, {
            value: 'progress',
            label: 'Progress 进度条'
          }, {
            value: 'tree',
            label: 'Tree 树形控件'
          }, {
            value: 'pagination',
            label: 'Pagination 分页'
          }, {
            value: 'badge',
            label: 'Badge 标记'
          }]
        }, {
          value: 'notice',
          label: 'Notice',
          children: [{
            value: 'alert',
            label: 'Alert 警告'
          }, {
            value: 'loading',
            label: 'Loading 加载'
          }, {
            value: 'message',
            label: 'Message 消息提示'
          }, {
            value: 'message-box',
            label: 'MessageBox 弹框'
          }, {
            value: 'notification',
            label: 'Notification 通知'
          }]
        }, {
          value: 'navigation',
          label: 'Navigation',
          children: [{
            value: 'menu',
            label: 'NavMenu 导航菜单'
          }, {
            value: 'tabs',
            label: 'Tabs 标签页'
          }, {
            value: 'breadcrumb',
            label: 'Breadcrumb 面包屑'
          }, {
            value: 'dropdown',
            label: 'Dropdown 下拉菜单'
          }, {
            value: 'steps',
            label: 'Steps 步骤条'
          }]
        }, {
          value: 'others',
          label: 'Others',
          children: [{
            value: 'dialog',
            label: 'Dialog 对话框'
          }, {
            value: 'tooltip',
            label: 'Tooltip 文字提示'
          }, {
            value: 'popover',
            label: 'Popover 弹出框'
          }, {
            value: 'card',
            label: 'Card 卡片'
          }, {
            value: 'carousel',
            label: 'Carousel 走马灯'
          }, {
            value: 'collapse',
            label: 'Collapse 折叠面板'
          }]
        }]
      }, {
        value: 'ziyuan',
        label: '资源',
        children: [{
          value: 'axure',
          label: 'Axure Components'
        }, {
          value: 'sketch',
          label: 'Sketch Templates'
        }, {
          value: 'jiaohu',
          label: '组件交互文档'
        }]
      }],
      tipTableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      alertTitle: '',
      toolbarOptionServer: '',
      tableProperty: {
        heightSubVH: 80,
        autoWidth: true
      },
      editConfig: {
        mode: EditModeFormInput,
        trigger: EditTriggerManualAndDBLClick,
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
        rightCells: [{
          cell: 'CellViewAlert',
          label: "标题内容",
          style: {width: 'fit'}
        }, CodeButtonRefresh],
      },
      rightBarConfig: {
        cells: [CodeButtonAdd, CodeButtonRowSelectedMinus, CodeButtonRefresh, CodeButtonCustom, CodeButtonPrint],
      },
      groupConfig: [
        {type: 'inline', fields: ['id', 'name'], after: '@start'},
        {type: 'tab', fields: ['AuthInfo', 'AuthInfoObject', 'code']},
        {type: 'divider', 'content-position': "left", label: '分割线', after: 'Link'}
      ],
      schema: [
        {
          field: 'id', name: 'ID',
          type: 'input',
          show: true,
          //min_width: 180,
          sortable: true,
          locked: true,
          placeholder: "xxx.xx",
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          summary: true,
          readOnly: true,
          fixed: "left",
          filter: {
            placeholder: '请输入ID', format: (v) => {
              return Number(v)
            }
          }
        },
        {field: 'SortIdx', name: 'SortIdx', type: 'input_number', sortable: true, align: 'center',default:0},
        {
          field: 'name', name: 'Name', sortable: true, uniq: true,
          placeholder: "xxx.xx",
          shortcuts: {
            copy: true, jump: true, filter: true, edit: {
              click: ({row}) => {
                jsb.cc.toastWarning(`${xidRow(row)} edit shortcut click`)
              }
            }
          },
          comment: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true
          , options: function () {
            return _this.cascader
          },
          filter: {placeholder:'name'},
          watch: function ({row, newValue}) {
            console.log("watch changed", row, newValue)
          },
        },
        {
          field: 'password', name: 'password', sortable: true, uniq: true,
          placeholder: "xxx.xx",
          commentHTML: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          tipSlot: 'password_tip',
          required: true,
          cellFormConfig: {
            checkPermission: () => {
              return false
            }
          },
          type: 'password',
        },
        {
          field: 'AuthInfo',
          name: 'AuthInfo',
          tips: '列表支持',
          width: 160,
          type: 'table',
          cellConfig: {
            table: {
              tableProperty: {autoWidth: false},
              editConfig: {mode: EditModeInplace},
            },
            trigger: {label: "查看"}
          },
          cellFormConfig: {
            tableProperty: {autoWidth: false},
            editConfig: {mode: EditModeFormInput, trigger: EditTriggerManualAndDBLClick, name: "testing"},
          },
          fields: [
            {field: 'UseSystemSSH', name: '系统SSH秘钥', type: 'switch', cellForm: 'CellSwitch', width: 160,},
            {field: 'UserName', name: 'UserName', type: 'input', cellForm: 'CellInput', width: 300},
            {field: 'Password', name: 'Password', type: 'input', cellForm: 'CellInput',}
          ],
        },
        {
          field: 'AuthInfoObject', name: 'AuthInfoObject',
          type: 'object',
          tips: '对象支持',
          cellFormConfig: {
            table: {
              tableProperty: {autoWidth: false},
              editConfig: {mode: EditModeInplace},
            },
          },
          cell: 'CellViewBoolean',
          formatter: ({value}) => {
            return value && value.UseSystemSSH
          },
          fields: [
            {field: 'UseSystemSSH', name: '系统SSH秘钥', cellForm: 'CellSwitch', cell: 'CellSwitch', width: 160,},
            {field: 'UserName', name: 'UserName', cellForm: 'CellInput', cell: 'CellInput', width: 300},
            {field: 'Password', name: 'Password', cellForm: 'CellInput', cell: 'CellInput'}
          ],
        },
        {
          field: 'code',
          name: 'code',
          type: 'code',
          tips: '代码编辑支持',
          watch: ({row, newValue, oldValue}) => {
            console.log("watch code change ", row, newValue, oldValue)
          },
          cellConfig: {
            codeMirror: {
              infoConfig: {mode: 'go'},
              headerConfig: {rightCells: ['btnLint', 'btnCopy']}
            }
          },
          cellFormConfig: {
            infoConfig: {mode: 'json'},
            headerConfig: {rightCells: ['btnLint', 'btnCopy']}
          },
        },
        {
          field: 'Version', name: 'Version', type: 'select', sortable: false,
          required: true,
          options: [{label: "v1", value: "v1"}, {label: "v2", value: "v2"}],
        },
        {
          field: 'Link',
          name: 'Link',
          showOverflowTooltip: true,
          sortable: true,
          align: 'center',
          cell: 'CellList',
          cellConfig: function ({fieldValue}) {
            if (!fieldValue) {
              return []
            }
            return [CodeLinkFieldCopy, {href: fieldValue, label: 'PMT地址', cell: 'CellViewLink'}, CodeButtonRowEdit]
          }
        },
        {
          field: 'Number', name: 'InputNumber', type: 'input', sortable: true,
          placeholder: "xxx.xx",
          //min_width: 180,
          tips: "用户名不要携带@centurygame.com后缀",
          tips_show_icon: true,
          required: true,
          cell: 'CellInputNumber',
          cellForm: 'CellInputNumber',
        },
        {
          field: 'Icon', name: 'Icon', type: 'element_icon', sortable: true,
          placeholder: "xxx.xx",
          //min_width: 180,
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
          name: '是否在线',
          type: 'switch',
          sortable: false,
          align: 'center',
          tips: '当前玩家是否在线',
          readOnly: true,
          default: false,
          cellForm: 'CellSwitch',
        },
        {
          field: 'Tag',
          //min_width: 180,
          name: 'Tag',
          type: 'select',
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
          //min_width: 180,
          sortable: true,
          align: 'center',
          cell: 'CellCheckbox',
          cellForm: 'CellCheckbox',
        },
        {
          field: 'Datetime',
          type: 'datetime',
          name: 'Datetime',
          cell: 'CellDatePicker',
          cellForm: 'CellDatePicker',
          filter: {},
        },
        {
          field: 'DatetimeRange',
          type: 'datetime_range',
          name: 'Datetime',
          cell: 'CellDateRangePicker',
          cellForm: 'CellDateRangePicker',
        },
        {
          field: 'Color',
          name: 'Color',
          //min_width: 180,
          cell: 'CellViewColor',
          cellForm: 'CellColorPicker',
        },
        {
          field: 'virtualLinks',
          virtual: true,
          name: '操作',
          // min_width: 50,
          align: 'center',
          fixed: 'right',
          sortable: false,
          cell: 'CellList',
          cellConfig: ['link@' + CodeButtonRowClose]
        },
        {
          field: 'virtualButtons',
          virtual: true,
          backgroundAsHeader: true,
          fixed: 'right',
          name: '操作',
          width: 200,
          sortable: false,
          cell: 'CellList',
          cellConfig: [`link@${CodeButtonRowEdit}`, 'link@' + CodeButtonRowSave, CodeButtonRowDelete, CodeButtonRowCopy, CodeButtonRowHistory]
        },
      ],

      editorProxyConfig: {
        query() {
          return new Promise((resolve) => {
            resolve({
              Data: jsb.clone(_this.tableVisitorData), //模拟数据返回
            })
          })
        },
        saveTableData({tableData}) {
          console.log(tableData)
          _this.tableVisitorData = tableData
        }
      },
      proxyConfig: {
        query({params}) {
          const dataRet = jsb.clone(_this.tableData)
          if (params && params.id) {
            jsb.remove(dataRet, item => item.id !== params.id)
          }
          if (params && params.name) {
            jsb.remove(dataRet, item => item.name !== params.name)
          }
          return new Promise((resolve) => {
            resolve({
              Data: dataRet, //模拟数据返回
              Total: dataRet.length,
            })
          })
        },
        delete({row}) {
          jsb.remove(_this.tableData, item => item.id === row.id)
        },
        deleteRows({rows}) {
          jsb.remove(_this.tableData, item => jsb.find(rows, v => v.id === item.id))
        },
        saveField:({tableData,field})=>{
          jsb.each(_this.tableData, function (itemLocal) {
            jsb.each(tableData, function (item) {
              if (item.id === itemLocal.id) {
                itemLocal[field] = item[field]
              }
            })
          })
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
              console.log("_this.tableData_this.tableData", _this.tableData)
            }
            resolve(true)
          })
        },
      },
      tableVisitorData: {
        fieldMap: {
          id: {show: true, groupCouldView: ['*'], groupCouldEdit: ['server']},
          name: {show: true, userCouldView: ['*'], groupCouldEdit: ['server']},
          Link: {show: true, userCouldView: ['*'], groupCouldEdit: ['server']},
        }
      },
      tableData: [
        {
          id: 4,
          name: '1111http://sample.pmt.centurygame.io/pmt#/dashboardhttp://sample.pmt.centurygame.io/pmt#/dashboard',
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
    shouldCellDisable({code, row, fieldSchema}) {
      if (row && code === CodeButtonRowDelete) {
        return row.Online
      }
      if (row && fieldSchema) {
        return fieldSchema.field === 'name' && row[fieldSchema.field] < 2000
      }
      return false
    },
    shouldCellHide({code, row}) {
      if (row && code === CodeButtonRowDelete) {
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
          {paddingLeft: 80},
          {
            cell: 'CellSelect',
            options: [
              {label: "按钮切换: CodeButtonRowEdit", value: EditTriggerManual},
              {label: "双击编辑", value: EditTriggerDBLClick},
              {label: "双击或按钮切换", value: EditTriggerManualAndDBLClick},
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
              {label: "行内编辑(无需trigger)", value: EditModeInplaceNoTrigger},
              {label: "行内编辑", value: EditModeInplace},
              {label: "Form表单编辑", value: EditModeFormInput},
            ],
            field: 'mode',
            data: _this.editConfig,
            change: function (val) {
              _this.editConfig.mode = val
              _this.toolbarAlert('CellSelect mode', val)
            },
            style: {'padding-right': '10px', width: '160px'},
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
        rightCells: [CodeButtonSaveTableData, CodeButtonAdd, CodeButtonRefresh, CodeButtonCustom, CodeButtonPrint, CodeButtonExpandAll, CodeButtonTableSetting, CodeButtonDebug],
        style: {}
      }
    }
  }
}
</script>
