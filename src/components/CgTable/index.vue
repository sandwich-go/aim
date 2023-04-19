<template>
  <div @keyup.esc="escKey">
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
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar"
        >
          <!-- 透传使用逻辑层定义的slot组件 -->
          <template v-for="item in toolbarConfigData[direction+'Cells']" v-slot:[getProxySlotName(item.cell)]="{}">
            <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
          </template>
        </cg-cells>
      </el-col>
    </el-row>

    <el-row class="cg-component-flex-end" style="align-items: start;gap: 3px">
      <el-table
          v-fit-columns="{
            enabled:tablePropertyData.autoWidth,
            doLayout:(done)=> {$nextTick(()=>{$refs.table.doLayout();done && done()})},
          }"
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
        <el-table-column v-if="expandConfig" type="expand" key="cg-table-column-expand" width="30"
                         class-name="cg-column-fixed-width" fixed="left">
          <template slot-scope="scope">
            <column-expand :expand-config-data="expandConfigData" :key="xidRow(scope.row)"
                           :row="scope.row"></column-expand>
          </template>
        </el-table-column>
        <el-table-column v-if="dragConfigData.enable" fixed="left" align="center" width="50" class-name="cg-column-fixed-width">
          <template slot-scope="{}" slot="header">
            <el-tooltip class="item" effect="light" content="拖拽以调整显示顺序" placement="top-start">
              <span>{{ dragConfigData.label }}<i></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="{}"><i class="el-icon-menu"></i></template>
        </el-table-column>
        <el-table-column v-if="selection" fixed="left" class-name="cg-column-fixed-width" key="cgt_auto_column_selection" width="50"
                         type="selection" align="center"/>
        <el-table-column v-if="radio" key="cgt_auto_column_radio" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row === currentRow"
                         @change="(val)=>radioRowChanged(scope.row,val)"></el-checkbox>
          </template>
        </el-table-column>
        <template v-for="(fs,fieldIndex) in schema">
          <el-table-column
              :key="fieldIndex"
              :prop="fs.field"
              :class-name="columnClass(fs)"
              :width="fs.width"
              :min-width="fs.min_width"
              :max-width="fs.max_width"
              :show-overflow-tooltip="fs.showOverflowTooltip"
              :label="fs.name"
              :fixed="fs.fixed"
              :sortable="fs.sortable||fs.sortable===undefined"
              :align="fs.align || 'left'"
              :fied-schema="fs"
          >
            <template slot="header">
              <column-header :field-schema="fs"/>
            </template>
            <template slot-scope="scope">
              <span :set="celllName = cellTableName(fs,scope.row)">
                <template v-if="celllName">
                  <!-- CgCells列表组件单独处理 -->
                  <div style="padding-top: 6px">
                    <cg-cells
                        v-if="celllName=== CellTableCells"
                        :style="{'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}"
                        :cells="cellTableConfig(scope.row,fs)"
                        :should-cell-hide="privateShouldCellHide"
                        :should-cell-disable="privateShouldCellDisable"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                    ></cg-cells>
                      <component
                          v-else-if="registeredComponentMap[celllName]"
                          :is="registeredComponentMap[celllName]"
                          :data="scope.row"
                          :options="fs.options || []"
                          :disabled="privateShouldFieldDisable({row:scope.row,fieldSchema:fs})"
                          :field-name="fs.field"
                          :cell-config="cellTableConfig(scope.row,fs)"
                          @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                      ></component>
                    <slot
                        v-else
                        :name="celllName"
                        :row="scope.row"
                        :field-schema="fs"
                        :disabled="privateShouldFieldDisable({row:scope.row,fieldSchema:fs})"
                        :fieldValue="scope.row[fs.field]"
                        :fieldValueVirtual="cellTableConfig(scope.row,fs)"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                    ></slot>
                  </div>
                </template>
              <span v-else>
                  {{ cellTableConfig(scope.row, fs) }}
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
              :should-cell-hide="privateShouldCellHide"
              :should-cell-disable="privateShouldCellDisable"
              @code-cell-click="privateCellClickForToolbar">
            <template v-for="item in rightBarConfigData.cells" v-slot:[getProxySlotName(item.cell)]="{}">
              <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
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
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar"
        >
          <template v-for="item in footerConfigData[direction+'Cells']" v-slot:[getProxySlotName(item.cell)]="{}">
            <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
          </template>
        </cg-cells>
      </el-col>
    </el-row>

    <el-dialog
        modal
        width="80%"
        :title="rowFormEditorTitle(rowEditorMode)"
        :close-on-press-escape="true"
        @close="rowFormEditorClose"
        :visible.sync="rowFormEditorVisible">
      <cg-form-input
          ref="cgFrom"
          v-if="rowInEdit && rowFormEditorVisible"
          :key="xidRow(rowInEdit)"
          :schema="validSchema(schema)"
          :data="rowInEdit"
          :should-field-disable="privateShouldFieldDisable"
          :alert-info="rowEditorAlert"
          :mode="rowEditorMode"
          :rules="formRulesFromSchema(schema,{row:rowInEdit,data:tableData})"
          :row-top="rowInEdit"
      ></cg-form-input>
      <span slot="footer" class="dialog-footer">
        <template v-if="rowEditorMode=== CgFormInputModeView">
        <el-button size="mini" type="info" @click="()=>rowFormEditorVisible=false">关闭</el-button>
        </template>
        <template v-else>
        <cg-cells
            :style="flexEndStyle"
            :shortcut-button-options="{circle:false}"
            :cells="editConfigData.formEditorCells({row:rowInEdit})"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:rowInEdit,code,jsEvent,fromForm:true})"
        >
          <template v-for="item in editConfigData.formEditorCells" v-slot:[getProxySlotName(item.cell)]="{}">
            <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
          </template>
        </cg-cells>
        </template>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue';
import AutoWidth from './AutoWidth';
import {
  cleanData,
  EditTriggerClick,
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitcher,
  EditTriggerSwitchButton,
  EventCurrentRowChange,
  getProxySlotName,
  mustCtrlData,
  removeCtrlData,
  RowEditorInplace,
  rowFormEditorTitle,
  xidRow
} from "@/components/CgTable/table";
import MixinCgPager from "@/components/mixins/MixinCgPager.vue";
import {
  flexEndStyle,
  flexStartStyle, headerBackgroundColor,
  NewDefaultProxyConfigData,
  NewDefaultTableProperty,
  NewEitConfigData,
  NewPagerConfig,
  validSchema,
} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CgCells from "@/components/cells/CgCells.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {
  CgFormInputModeCopy,
  CgFormInputModeEdit,
  CgFormInputModeInsert,
  CgFormInputModeView
} from "@/components/CgFormInput";
import CgFormInput from "@/components/CgFormInput/index.vue";
import {CellTableCells, cellTableConfig, cellTableName} from "@/components/CgTable/cell";
import {
  CodeButtonAdd, CodeButtonExpandAll,
  CodeButtonRefresh,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowSaveRemote,
  CodeLinkFieldCopy
} from "@/components/cells/const";
import {formRulesFromSchema} from "@/components/CgTable/validate";
import {deleteConfirmConfig} from "@/components/CgTable/confirm";
import CgViewerLabelTooltip from "@/components/cells/viewer/CgViewerTooltip.vue";
import ColumnHeader from "@/components/CgTable/ColumnHeader.vue";
import ColumnExpand from "@/components/CgTable/ColumnExpand.vue";
import {setRowDrag} from "@/components/CgTable/drag";

Vue.use(AutoWidth);

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  computed: {
    flexEndStyle() {
      return flexEndStyle
    }
  },
  mixins: [MixinCgPager, MixinComponentMap],
  components: {ColumnExpand, ColumnHeader, CgViewerLabelTooltip, CgFormInput, CgCells, Loading},
  props: {
    dragConfig: Object,
    selection: Boolean,// 是否支持选择
    radio: Boolean,// 是否支持radio选择
    debug: Boolean,
    tableDivStyle: Object,
    tableProperty: Object,
    cellStyle: Function,
    rowStyle: Function,
    localData: Array,
    schema: Array,
    toastError: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastError(title, {timeout: timeout || 5000, body, id, config})
      }
    },
    toastWarning: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastWarning(title, {timeout: timeout || 3000, body, id, config})
      }
    },
    toastSuccess: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastSuccess(title, {timeout: timeout || 3000, body, id, config})
      }
    },
    editConfig: Object,
    readOnly: Boolean,
    proxyConfig: Object,
    pagerConfig: Object,
    expandConfig: Object,
    toolbarConfig: Object,
    footerConfig: Object,
    rightBarConfig: Object,
    // eslint-disable-next-line no-unused-vars
    shouldCellDisable: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
        return false
      },
    },
    // eslint-disable-next-line no-unused-vars
    shouldCellHide: {
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
      CgFormInputModeView: CgFormInputModeView,
      CellTableCells: CellTableCells,
      inLoading: false,
      debugMessage: '',
      tableData: [],
      radioRow: null,
      // 当前选中的行
      currentRow: null,
      rowInEdit: null,
      expandAll:false,
      rowFormEditorReadonly: false,
      rowFormEditorVisible: false,
      rowEditorAlert: null,
      rowEditorMode: CgFormInputModeView,

      proxyConfigData: this.proxyConfig,
      tablePropertyData: this.tableProperty,
      editConfigData: this.editConfig,
      pagerConfigData: this.pagerConfig,
      dragConfigData: this.dragConfig,
      expandConfigData: this.expandConfig,
      forceUpdateWidthFunc: null,
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
        cells: [],
      },
      sortableObj: null,
    }
  },
  created() {
    jsb.objectAssignNX(this.editConfigData, NewEitConfigData())
    jsb.objectAssignNX(this.tablePropertyData, NewDefaultTableProperty())
    jsb.objectAssignNX(this.proxyConfigData, NewDefaultProxyConfigData())

    this.initDrag()
    this.initPager()
    this.initHeader()
    this.initFooter()
    this.initRighter()
    this.initExpandConfig()

    cleanData(this.tableData, this.schema, this.proxyConfigData.item2Row)
    this.tryProxyQueryData()

    // fixme ide问题，错误标注getProxySlotName未被使用
    this.getProxySlotName()

    if (this.dragConfigData.enable) {
      this.$nextTick(() => {
        this.sortableObj = setRowDrag(this.$refs.table, this.tableData)
      })
    }
  },
  methods: {
    rowFormEditorTitle,
    formRulesFromSchema,
    validSchema,
    cellTableName,
    cellTableConfig,
    xidRow,
    getProxySlotName,
    forceUpdateWidth() {
      this.forceUpdateWidthFunc()
    },
    setDebugMessage(msg) {
      this.debugMessage = msg
    },
    columnClass(fs) {
      if (fs.width || fs.min_width || fs.max_midth) {
        return 'cg-column-fixed-width'
      }
      return ''
    },
    initHeader() {
      this.toolbarConfigData = Object.assign(this.toolbarConfigData, this.toolbarConfig)
    },
    initRighter() {
      this.rightBarConfigData = Object.assign(this.rightBarConfigData, this.rightBarConfig)
    },
    initFooter() {
      const _this = this
      this.footerConfigData = Object.assign(this.footerConfigData, this.footerConfig)
      let pagerFound = false
      if (this.pagerConfigData.enable) {
        jsb.each(['leftCells', 'rightCells'], function (val) {
          jsb.each(_this.footerConfigData[val], function (codeOrItem) {
            if (codeOrItem.cell === 'CgPager') {
              pagerFound = true
              codeOrItem.data = _this.thisTarget()
            }
          })
        })
        if (!pagerFound) {
          this.footerConfigData.rightCells.push({cell: 'CgPager', data: _this.thisTarget()})
        }
      }
    },
    initExpandConfig() {
      this.expandConfigData = jsb.objectAssignNX(this.pagerConfigData, {
        isHTML: false,
        // eslint-disable-next-line no-unused-vars
        expandContent: function ({row}) {
          return JSON.stringify(row)
        }
      })
    },
    doLayout(){
      this.$refs.table.doLayout()
    },
    escKey() {
      if (this.isInplaceEditor()) {
        this.rowInEdit = null
      }
    },
    initDrag() {
      this.dragConfigData = jsb.objectAssignNX(this.dragConfigData, {
        enable: true,
        icon: true,
        label: '',
      })
    },
    initPager() {
      this.pagerConfigData = jsb.objectAssignNX(this.pagerConfigData, NewPagerConfig())
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
      const fs = jsb.find(this.schema,fs => fs.field === column.property)
      if(fs && fs['columnStyle']){
        return fs['columnStyle']
      }
      if(fs && fs['backgroundAsHeader']) {
        return {background:headerBackgroundColor}
      }
      return this.cellStyle ? this.cellStyle({row, column,fieldSchema:fs}) : null;
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
    privateShouldFieldDisable({row, fieldSchema}) {
      if (this.editConfigData.rowEditor === RowEditorInplace) {
        return this.rowInEdit !== row
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
      if (this.isInplaceEditor() && this.rowEditorMode === CgFormInputModeView && this.rowEditorAlert) {
        this.toastError(this.rowEditorAlert, {timeout: 3000})
        return
      }
      this.setEditRow(row)
    },
    // eslint-disable-next-line no-unused-vars
    privateCellClickForRow({code, row, jsEvent, fromForm}) {
      this.privateCellClick({code, row, jsEvent, fromForm})
    },
    privateCellClickForField({code, row, fieldSchema, jsEvent}) {
      this.privateCellClick({code, row, fieldSchema, jsEvent, fieldValue: row[fieldSchema.field]})
    },
    // header或者footer的item点击时间事件
    privateCellClickForToolbar({code}) {
      this.privateCellClick({code})
    },
    privateCellClick({code, row, fieldSchema, fieldValue, jsEvent, fromForm}) {
      this.debug && this.setDebugMessage(`privateCodeItemClick code: ${code}`)
      if (this.codeItemClick({code, row, fieldSchema, fieldValue})) {
        return
      }
      this.defaultCellClick({code, row, fieldValue, jsEvent, fromForm})
    },
    // 默认的code处理逻辑
    defaultCellClick({code, row, fieldValue, jsEvent, fromForm}) {
      const done = (error) => {
        !error && (this.rowFormEditorVisible = false)
      }
      switch (code) {
        case CodeButtonRefresh:
          this.tryProxyQueryData()
          break
        case CodeLinkFieldCopy:
          jsb.clipCopy(fieldValue, jsEvent)
          break
        case CodeButtonAdd:
          this.addRow()
          break
        case CodeButtonRowCopy:
          this.addRow({
            initRow: this.editConfigData.copyRow(mustCtrlData(removeCtrlData(jsb.clone(row)))),
            isCopy: true
          })
          break
        case CodeButtonRowEdit:
          this.rowClickWithTriggerName(row, EditTriggerSwitchButton)
          break
        case CodeButtonRowDelete:
          this.tryProxyDeleteRow(row, {done})
          break
        case CodeButtonExpandAll:
          this.expandAll = !this.expandAll
          if (this.tableData) {
            this.tableData.forEach(row => {
              this.$refs.table.toggleRowExpansion(row, this.expandAll)
            })
          }
          break
        case CodeButtonRowSaveRemote:
          if (fromForm) {
            this.$refs.cgFrom.validate(() => {
              this.tryProxySaveRow(row, {done})
            })
          } else {
            //fixme inplace下无法使用form的validate
            this.tryProxySaveRow(row, {done})
          }
          break
        default:
          this.toastWarning(`code ${code} no handler`)
      }
    },
    privateShouldCellDisable({code, scope}) {
      if (scope.disable || scope.disabled) {
        return true
      }
      if (!this.shouldCellDisable) {
        return false
      }
      return this.shouldCellDisable({code, scope})
    },
    privateShouldCellHide({code, scope}) {
      if (scope.hide || jsb.pathGet(scope, 'show', true)) {
        return true
      }
      if (!this.shouldCellHide) {
        return false
      }
      return this.shouldCellHide({code, scope})
    },
    isInplaceEditor() {
      return this.editConfigData.rowEditor === RowEditorInplace
    },
    updateRowInEdit(row) {
      this.rowInEdit = row
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
    addRow({initRow, isCopy} = {initRow: {}, isCopy: false}) {
      if (jsb.eqNull(this.tableData)) {
        this.tableData = []
      }
      this.rowEditorAlert = ''
      this.rowEditorMode = CgFormInputModeInsert
      if (isCopy) {
        this.rowEditorMode = CgFormInputModeCopy
      }
      let newRow = mustCtrlData(this.editConfigData.newRow(this.schema, initRow))
      this.currentRow = newRow
      this.updateRowInEdit(newRow)

      if (this.isInplaceEditor()) {
        // inplace编辑模式
        this.tableData.push(newRow)
      } else {
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
    // eslint-disable-next-line no-unused-vars
    tryProxyDeleteRow(row, {done} = {}) {
      this.debug && (this.debugMessage = `tryProxyDeleteRow called ${this.summaryRow(row)}`)
      const deleteFunc = this.proxyConfigData.delete
      if (!deleteFunc) {
        this.toastWarning("proxy中未指定delete方法")
        return
      }
      const confirmConfig = deleteConfirmConfig(this.proxyConfigData, row)
      const _this = this
      confirmConfig.doneFunc = () => {
        _this.inLoading = true
        Promise.resolve(deleteFunc({row})).then(() => {
          this.toastSuccess("删除成功")
          this.tryProxyQueryData()
          done && done()
        }).catch(e => {
          this.toastError(e)
          done && done(e)
        }).finally(() => {
          this.inLoading = false
        })
      }
      jsb.cc().confirm(_this, confirmConfig)
    },
    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done} = {}) {
      this.debug && (this.debugMessage = `tryProxySaveData called ${this.summaryRow(row)}`)
      const saveFunc = this.proxyConfigData.save
      if (!saveFunc) {
        this.toastWarning("proxy中未指定save方法")
        return
      }
      this.inLoading = true
      const rowClean = removeCtrlData(jsb.clone(row))
      Promise.resolve(saveFunc({row: rowClean})).then(() => {
        this.toastSuccess("提交成功")
        done && done()
        this.tryProxyQueryData()
      }).catch(e => {
        done && done(e)
        this.toastError(e)
      }).finally(() => {
        this.inLoading = false
      })
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyQueryData({done} = {}) {
      this.debug && (this.debugMessage = `tryProxyQueryData called`)
      const queryFunc = this.proxyConfigData.query
      if (!queryFunc) {
        return
      }
      let params = {}
      this.inLoading = true
      Promise.resolve(queryFunc({params: params})).then((ret) => {
        this.tableData = cleanData(jsb.pathGet(ret, 'Data'))
        this.PagerTotal = jsb.pathGet(ret, 'Total', this.tableData.length)
        done && done()
      }).catch(e => {
        done && done(e)
        this.toastError(e)
      }).finally(() => {
        this.inLoading = false
      })
    },
    rowFormEditorClose() {
      // this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
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

.el-table.cg-table-auto-width .cell {
  display: inline-block;
  white-space: nowrap;
  width: auto;
  overflow-x: auto;
}

.el-table.cg-table-auto-width .el-table__body-wrapper {
  overflow-x: auto;
}

.sortable-ghost {
  opacity: .8 !important;
  color: #fff !important;
  background: #42b983 !important;
}

</style>