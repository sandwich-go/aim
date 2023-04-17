<template>
  <div>
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <el-alert v-if="debug"
              style="height: 28px;margin-bottom: 9px;font-weight: bold"
              :title="`CgTable debug enabled : `+debugMessage"
              effect="light"
              show-icon
              :closable="false"
              type="info">
    </el-alert>
    <el-row :style="toolbarConfigData.style">
      <!-- header toolbar -->
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="toolbarSpan(toolbarConfigData,direction)">
        <cg-cells
            :style="toolbarConfigData[direction+'ColumnStyle']"
            :cells="toolbarConfigData[direction+'Cells']"
            :should-toolbar-item-hide="privateShouldToolbarItemHide"
            :should-toolbar-item-disable="privateShouldToolbarItemDisable"
            @code-cell-click="privateCodeItemClickForToolbar"
        >
          <!-- 透传使用逻辑层定义的slot组件 -->
          <template v-for="item in toolbarConfigData[direction+'Cells']" v-slot:[getProxySlotName(item.slot)]="{}">
            <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
          </template>
        </cg-cells>
      </el-col>
    </el-row>

    <el-row class="cg-component-flex-end" style="align-items: start;gap: 3px">
      <el-table
          ref="table"
          :height="tableHeight()"
          :data="tableData"
          :border="tablePropertyData.border"
          :stripe="tablePropertyData.stripe"
          :class="tablePropertyData.class"
          :show-header="tablePropertyData.showHeader"
          :empty-text="tablePropertyData.emptyText"
          :header-cell-style="tablePropertyData.headerCellStyle"
          :highlight-current-row="tablePropertyData.highlightCurrentRow"
          :cell-style="cellStyleWrapper"
          :row-style="tablePropertyData.rowStyle"
          @current-change="currentChange"
          @row-dblclick="rowDblClick"
          @row-click="rowClick"
          :row-key="xidRow"
      >
        <el-table-column v-if="selection" key="cgt_auto_column_selection" width="50" type="selection" align="center"/>
        <el-table-column v-if="radio" key="cgt_auto_column_radio" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row === currentRow" @change="(val)=>radioRowChanged(scope.row,val)"></el-checkbox>
          </template>
        </el-table-column>
        <template v-for="(fs,fieldIndex) in schema">
          <el-table-column
              :key="fieldIndex"
              :prop="fs.field"
              :width="fs.width"
              :min-width="fs.min_width"
              :max-width="fs.max_width"
              :show-overflow-tooltip="fs.showOverflowTooltip"
              :label="fs.name"
              :fixed="fs.fixed"
              :align="fs.align || 'left'"
          >
            <template slot-scope="scope">
            <span :set="celllName = cellTableName(fs)">
              <template v-if="celllName">
                <!-- CgCells列表组件单独处理 -->
                <cg-cells
                    v-if="celllName=== CellTableCells"
                    :style="{'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}"
                    :cells="cellTableConfig(scope.row,fs)"
                    :should-toolbar-item-hide="privateShouldToolbarItemHide"
                    :should-toolbar-item-disable="privateShouldToolbarItemDisable"
                    @code-cell-click="({code,jsEvent})=>privateCodeItemClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                ></cg-cells>
                <component
                    v-else-if="registeredComponentMap[celllName]"
                    :is="registeredComponentMap[celllName]"
                    :data="scope.row"
                    :options="fs.options || []"
                    :disabled="privateShouldFieldDisable({row:scope.row,fieldSchema:fs})"
                    :field-name="fs.field"
                    :cell-config="cellTableConfig(scope.row,fs)"
                    @code-cell-click="({code,jsEvent})=>privateCodeItemClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                ></component>
                <slot
                    v-else
                    :name="fs.slot"
                    :row="scope.row"
                    :field-schema="fs"
                    :disabled="privateShouldFieldDisable({row:scope.row,fieldSchema:fs})"
                    :fieldValue="scope.row[fs.field]"
                    :fieldValueVirtual="cellTableConfig(scope.row,fs)"
                    @code-cell-click="({code,jsEvent})=>privateCodeItemClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                ></slot>
              </template>
              <span v-else>
                  {{ cellTableConfig(scope.row,fs) }}
                </span>
            </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="cg-table-shortcuts-button">
        <div style="float:right">
          <cg-cells
              :cells="rightBarConfigData.cells"
              :div-style="{'padding-bottom':'6px'}"
              :should-toolbar-item-hide="privateShouldToolbarItemHide"
              :should-toolbar-item-disable="privateShouldToolbarItemDisable"
              @code-cell-click="privateCodeItemClickForToolbar">
            <template v-for="item in rightBarConfigData.cells" v-slot:[getProxySlotName(item.slot)]="{}">
              <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
            </template>
          </cg-cells>
        </div>
      </div>
    </el-row>

    <el-row :style="footerConfigData.style">
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="toolbarSpan(footerConfigData,direction)" :style="footerConfigData[direction+'ColumnStyle']">
        <cg-cells
            :cells="footerConfigData[direction+'Cells']"
            :style="footerConfigData[direction+'ColumnStyle']"
            :should-toolbar-item-hide="privateShouldToolbarItemHide"
            :should-toolbar-item-disable="privateShouldToolbarItemDisable"
            @code-cell-click="privateCodeItemClickForToolbar"
        >
          <template v-for="item in footerConfigData[direction+'Cells']" v-slot:[getProxySlotName(item.slot)]="{}">
            <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
          </template>
        </cg-cells>
      </el-col>

    </el-row>

    <el-dialog modal width="80%"
               @close="rowFormEditorClose"
               :visible.sync="rowFormEditorVisible">
      <cg-form-input
          v-if="currentRow && rowFormEditorVisible"
          :key="xidRow(currentRow)"
          :schema="validSchema(schema)"
          :data="currentRow"
          :should-field-disable="privateShouldFieldDisable"
          :alert-info="rowEditorAlert"
          :mode="rowEditorMode"
          :row-top="currentRow"
      ></cg-form-input>
      <span slot="footer" class="dialog-footer">
        <template v-if="rowEditorMode=== CgFormInputModeView">
        <el-button  size="mini" type="info" @click="()=>rowFormEditorVisible=false">关闭</el-button>
        </template>
        <template v-else>
        <cg-cells
            :style="flexEndStyle"
            :shortcut-button-options="{circle:false}"
            :cells="editConfigData.formEditorCells"
            :should-toolbar-item-hide="privateShouldToolbarItemHide"
            :should-toolbar-item-disable="privateShouldToolbarItemDisable"
            @code-cell-click="privateCodeItemClickForToolbar"
        >
          <template v-for="item in editConfigData.formEditorCells" v-slot:[getProxySlotName(item.slot)]="{}">
            <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
          </template>
        </cg-cells>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  cleanData,
  EditTriggerClick,
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitcher,
  EditTriggerSwitchButton,
  EventCurrentRowChange,
  getProxySlotName, isRowInEdit, mustCtrlData,
  RowEditorInplace, setRowInEdit,
  ToolbarShortcutCodeAdd,
  ToolbarShortcutCodeCopyField,
  ToolbarShortcutCodeRefresh, ToolbarShortcutCodeRowEdit,
  xidRow
} from "@/components/CgTable/table";
import MixinCgPager from "@/components/mixins/MixinCgPager.vue";
import {
  flexEndStyle,
  flexStartStyle,
  NewDefaultProxyConfigData,
  NewDefaultTableProperty,
  NewEitConfigData, NewPagerConfig,
  validSchema,
} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CgCells from "@/components/cells/CgCells.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {CgFormInputModeEdit, CgFormInputModeInsert, CgFormInputModeView} from "@/components/CgFormInput";
import CgFormInput from "@/components/CgFormInput/index.vue";
import {CellTableCells, cellTableConfig, cellTableName} from "@/components/CgTable/cell";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  computed: {
    flexEndStyle() {
      return flexEndStyle
    }
  },
  mixins: [MixinCgPager, MixinComponentMap],
  components: {CgFormInput, CgCells, Loading},
  props: {
    selection: Boolean,// 是否支持选择
    radio: Boolean,// 是否支持radio选择
    debug: Boolean,
    tableDivStyle: Object,
    tableProperty: Object,
    cellStyle: Function,
    rowStyle: Function,
    localData: Array,
    schema: Array,
    toastError:{
      type:Function,
      default:jsb.cc().toastError
    },
    editConfig: Object,
    readOnly: Boolean,
    proxyConfig: Object,
    pagerConfig: Object,
    toolbarConfig: Object,
    footerConfig: Object,
    rightBarConfig:Object,
    // eslint-disable-next-line no-unused-vars
    shouldToolbarItemDisable: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
        return false
      },
    },
    // eslint-disable-next-line no-unused-vars
    shouldToolbarItemHide: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
        return false
      },
    },
    shouldFieldDisable: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({row, fieldSchema}) {
        return false
      },
    },
    codeItemClick: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope, row, fieldSchema, fieldValue, fieldValueVirtual}) {
      },
    }
  },
  data() {
    return {
      CgFormInputModeView:CgFormInputModeView,
      CellTableCells:CellTableCells,
      inLoading: false,
      debugMessage: '',
      tableData: [],
      radioRow: null,
      // 当前选中的行
      currentRow: null,
      rowInEdit: null,
      rowFormEditorReadonly: false,
      rowFormEditorVisible: false,
      rowEditorAlert: null,
      rowEditorMode: CgFormInputModeView,

      proxyConfigData: this.proxyConfig,
      tablePropertyData: this.tableProperty,
      editConfigData:this.editConfig,
      pagerConfigData:this.pagerConfig,

      toolbarConfigData: {
        enable: true,
        style: {'padding-bottom': '9px'},
        leftSpan: 19,
        leftCells: [],
        leftColumnStyle: flexStartStyle,
        rightSpan: 0,
        rightCells: [],
        rightColumnStyle: flexEndStyle,
      },
      footerConfigData: {
        style: {'padding-top': '9px'},
        leftSpan: 19,
        leftCells: [],
        leftColumnStyle: flexStartStyle,
        rightSpan: 0,
        rightCells: [],
        rightColumnStyle: flexEndStyle,
      },
      rightBarConfigData: {
        cells:[],
      }
    }
  },
  created() {
    console.log(1)
    jsb.objectAssignNX(this.editConfigData,NewEitConfigData())
    console.log(2)
    jsb.objectAssignNX(this.tablePropertyData,NewDefaultTableProperty())
    console.log(3)
    jsb.objectAssignNX(this.proxyConfigData,NewDefaultProxyConfigData())

    this.initPager()
    this.initHeader()
    this.initFooter()
    this.initRighter()

    cleanData(this.tableData, this.schema, this.proxyConfigData.item2Row)
    this.tryProxyQueryData()

    // fixme ide问题，错误标注getProxySlotName未被使用
    this.getProxySlotName()
  },
  methods: {
    validSchema,
    cellTableName,
    cellTableConfig,
    xidRow,
    getProxySlotName,
    setDebugMessage(msg) {
      this.debugMessage = msg
    },
    initHeader() {
      this.toolbarConfigData = Object.assign(this.toolbarConfigData, this.toolbarConfig)
    },
    initRighter(){
      this.rightBarConfigData = Object.assign(this.rightBarConfigData, this.rightBarConfig)
    },
    initFooter() {
      const _this = this
      this.footerConfigData = Object.assign(this.footerConfigData, this.footerConfig)
      let pagerFound = false
      if (this.pagerConfigData.enable) {
        jsb.each(['leftCells', 'rightCells'], function (val) {
          jsb.each(_this.footerConfigData[val], function (codeOrItem) {
            if (codeOrItem.slot === 'CgPager') {
              pagerFound = true
              codeOrItem.data = _this.thisTarget()
            }
          })
        })
        if (!pagerFound) {
          this.footerConfigData.rightCells.push({slot: 'CgPager', data: _this.thisTarget()})
        }
      }
    },
    initPager() {
      this.pagerConfigData = jsb.objectAssignNX(this.pagerConfigData,NewPagerConfig())
      if (this.pagerConfigData.enable) {
        this.PagerInit(this.tryProxyQueryData)
      }
    },
    thisTarget() {
      return this
    },
    radioRowChanged(row, selected) {
      this.radioRow = selected ? row : null
      this.debug && this.setDebugMessage(`rowSelectionChanged row ${this.summaryRow(row)}`)
    },
    toolbarSpan(configData, direction) {
      if (direction === 'left') {
        return configData.leftCells.length === 0 ? 0 : configData.leftSpan
      }
      return configData.leftCells.length === 0 ? 24 : (configData.rightSpan || 24 - configData.leftSpan)
    },
    tableHeight() {
      if (!this.tablePropertyData.heightSubVH) {
        // null或者0根据内容自适应高度
        if (jsb.isNull(this.tablePropertyData.height) || parseInt(this.tablePropertyData.height) === 0) {
          return null
        }
        if (!jsb.isEmpty(this.tablePropertyData.height)) {
          return this.tablePropertyData.height
        }
      }
      let sub = 70 + this.tablePropertyData.heightSubVH
      sub += this.toolbarConfigData.enable ? 40 : 0
      sub += this.pagerConfigData.enable ? 40 : 0
      sub += this.debug ? 37 : 0
      return `${jsb.clientHeight(sub)}px`
    },
    // 每一个cell的属性
    cellStyleWrapper({row, column}) {
      return this.cellStyle ? this.cellStyle({row, column}) : null;
    },
    // current-change 回调
    currentChange(row) {
      // this.debug && this.setDebugMessage(`currentChange row ${this.summaryRow(row)}`)
      this.currentRow = row;
      this.$emit(EventCurrentRowChange, {row})
    },
    rowDblClick(row) {
      this.rowClickWithTriggerName(row, EditTriggerDBLClick)
    },
    rowClick(row) {
      this.rowClickWithTriggerName(row, EditTriggerClick)
    },
    // isTriggerAccepted triggerName是否符合设定的编辑策略
    isEditTriggerAccepted(triggerName) {
      if (this.readOnly || !this.editConfigData || !this.editConfigData.enable) {
        return false;
      }
      if (this.editConfigData.trigger === triggerName) {
        return true
      }
      return this.editConfigData.trigger === EditTriggerDBLClickOrSwitcher && (triggerName === EditTriggerSwitchButton || triggerName === EditTriggerDBLClick);
    },
    privateShouldFieldDisable({row, fieldSchema}){
      if(this.editConfigData.rowEditor === RowEditorInplace) {
        return !isRowInEdit(row)
      }
      return this.shouldFieldDisable({row, fieldSchema})
    },
    rowClickWithTriggerName(row, triggerName) {
      this.currentChange(row)
      if (!this.isEditTriggerAccepted(triggerName)) {
        return;
      }
      const triggerRet = this.editConfigData.triggerRowFunc({row: row})

      this.rowEditorMode = CgFormInputModeEdit
      this.rowEditorAlert = null

      if (jsb.isString(triggerRet)) {
        // 如果只是返回字符串则：view状态，显示alert信息
        this.rowEditorMode = CgFormInputModeView
        this.rowEditorAlert = triggerRet
      } else if (jsb.isObjectOrMap(triggerRet)) {
        // 如果返回的是一个object，索引其中的:active与alert字段
        // active默认为true, 如为true则进入edit状态
        // 可根据需求定制返回alert的样式
        if (jsb.pathGet(triggerRet, 'active', true)) {
          this.rowEditorMode = CgFormInputModeEdit
        }
        this.rowEditorAlert = jsb.pathGet(triggerRet, 'alert')
      } else if (!triggerRet) {
        // 不允许编辑
        return;
      }
      if(this.isInplaceEditor() && this.rowEditorMode === CgFormInputModeView && this.rowEditorAlert) {
        this.toastError(this.rowEditorAlert,{timeout:3000})
        return
      }
      this.setEditRow(row)
    },
    // eslint-disable-next-line no-unused-vars
    privateCodeItemClickForRow({code, row, fieldSchema, jsEvent}) {
      this.privateCodeItemClick({code, row, fieldSchema, jsEvent,fieldValue:row[fieldSchema.field]})
    },
    // header或者footer的item点击时间事件
    privateCodeItemClickForToolbar({code}) {
      this.privateCodeItemClick({code})
    },
    privateCodeItemClick({code, row, fieldSchema, fieldValue, jsEvent}) {
      this.debug && this.setDebugMessage(`privateCodeItemClick code: ${code}`)
      if (this.codeItemClick({code, row, fieldSchema, fieldValue})) {
        return
      }
      this.defaultCodeItemClick({code,row, fieldValue, jsEvent})
    },
    // 默认的code处理逻辑
    defaultCodeItemClick({code,row, fieldValue, jsEvent}) {
      switch (code) {
        case ToolbarShortcutCodeRefresh:
          this.tryProxyQueryData()
          break
        case ToolbarShortcutCodeCopyField:
          jsb.clipCopy(fieldValue, jsEvent)
          break
        case ToolbarShortcutCodeAdd:
          this.addRow()
          break
        case ToolbarShortcutCodeRowEdit:
          this.rowClickWithTriggerName(row,EditTriggerSwitchButton)
          break
      }
    },
    privateShouldToolbarItemDisable({code, scope}) {
      if (scope.disable || scope.disabled) {
        return true
      }
      if (!this.shouldToolbarItemDisable) {
        return false
      }
      return this.shouldToolbarItemDisable({code, scope})
    },
    privateShouldToolbarItemHide({code, scope}) {
      if (scope.hide || jsb.pathGet(scope, 'show', true)) {
        return true
      }
      if (!this.shouldToolbarItemHide) {
        return false
      }
      return this.shouldToolbarItemHide({code, scope})
    },
    isInplaceEditor(){
      return this.editConfigData.rowEditor === RowEditorInplace
    },
    updateRowInEdit(row){
      if(this.rowInEdit) {
        setRowInEdit(this.rowInEdit,false)
      }
      this.rowInEdit = row
      if(this.rowInEdit) {
        setRowInEdit(this.rowInEdit,true)
      }
    },
    // 设定当前编辑的行
    setEditRow(row) {
      this.debug && this.setDebugMessage(`setEditRow row  ${this.summaryRow(row)}`)
      this.currentRow = row
      this.updateRowInEdit(row)
      if (!this.isInplaceEditor()) {
        // form 表单编辑逻辑
        this.rowFormEditorVisible = true
      }
    },
    addRow() {
      if (jsb.eqNull(this.tableData)) {
        this.tableData = []
      }
      this.rowEditorAlert = ''
      this.rowEditorMode = CgFormInputModeInsert
      let newRow = mustCtrlData(this.editConfigData.newRow(this.schema))
      this.currentRow = newRow
      this.updateRowInEdit(newRow)

      if (this.isInplaceEditor()) {
        // inplace编辑模式
        this.tableData.push(newRow)
      }else{
        // form 表单编辑逻辑
        this.rowFormEditorVisible = true
      }
    },
    summaryRow(row) {
      let info = [`xid(${xidRow(row)})`]
      jsb.each(this.schema, function (fieldSchema) {
        if (fieldSchema.summary) {
          info.push(`${fieldSchema.name}(${row[fieldSchema.field]})`)
        }
      })
      return info.join(" , ")
    },
    tryProxyQueryData() {
      this.debug && (this.debugMessage = `tryProxyQueryData called`)
      const queryFunc = this.proxyConfigData.query
      if (!queryFunc) {
        return
      }
      let params = {}
      this.inLoading = true
      Promise.resolve(queryFunc({params: params})).catch(e => {
        console.error("CgTable tryProxyQueryData got err:", e)
      }).then((ret) => {
        this.tableData = cleanData(jsb.pathGet(ret, 'Data'))
        this.PagerTotal = jsb.pathGet(ret, 'Total', this.tableData.length)
      }).finally(() => {
        this.inLoading = false
      })
    },
    rowFormEditorClose() {
      this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
  }
}
</script>

<style>
.cg-table-shortcuts-button {
  position: sticky;
  top: 0;
}
.cg-component-flex-end {
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 10;
  justify-content: flex-end;
}
.el-table.cg-table-normal-padding td, .el-table.cg-table-normal-padding th {
}

.el-table.cg-table-medium-padding td, .el-table.cg-table-medium-padding th {
  padding: 6px
}

.el-table.cg-table-small-padding td, .el-table.cg-table-small-padding th {
  padding: 3px
}

.el-table.cg-table-mini-padding td, .el-table.cg-table-mini-padding th {
  padding: 1px
}
</style>