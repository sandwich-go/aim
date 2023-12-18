<template>
  <div @keyup.esc="escKey" :style="tablePropertyRef.divStyle">
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <el-row v-if="headerConfigRef.enable" :style="headerConfigRef.style">
      <!-- header toolbar -->
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="directionToolbarSpan(headerConfigRef,direction)">
        <cell-list
            :style="headerConfigRef[direction+'Style']"
            :cells="headerConfigRef[direction+'Cells']"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar">
          <!-- 透传使用逻辑层定义的slot组件 -->
          <template v-for="cell in headerConfigRef[direction+'Cells']" v-slot:[getProxySlotName(cell.slot)]="{}">
            <slot v-if="cell.slot" :name="cell.slot"
                  :cell-config="cell"
                  :should-cell-hide="privateShouldCellHide"
                  :should-cell-disable="privateShouldCellDisable"
                  @code-cell-click="privateCellClickForToolbar"/>
          </template>
        </cell-list>
      </el-col>
    </el-row>
    <el-row class="aim-component-flex-end" style="align-items: start;gap: 3px">
      <el-table
          ref="table"
          :height="tableHeight()"
          :data="tableDataFiltered ? tableDataFiltered : tableData"
          :border="tablePropertyRef.border"
          :stripe="tablePropertyRef.stripe"
          :class="tablePropertyRef.class"
          :show-header="tablePropertyRef.showHeader"
          :empty-text="tablePropertyRef.emptyText"
          :header-cell-style="tablePropertyRef.headerCellStyle"
          :highlight-current-row="tablePropertyRef.highlightCurrentRow"
          :cell-style="cellStyleWrapper"
          :row-style="tablePropertyRef.rowStyle"
          :row-class-name="tablePropertyRef.rowClassName"
          @current-change="currentChange"
          @row-dblclick="rowDblClick"
          @row-click="rowClick"
          :row-key="xidRow"
          @selection-change="selectionChange"
      >
        <el-table-column v-if="expandConfig" type="expand" key="aim-table-column-expand" width="30"
                         class-name="aim-column-fixed-width" :fixed="inSortIndexEdit?false:'left'">
          <template slot-scope="scope">
            <column-expand :expand-config-data="expandConfigRef" :key="xidRow(scope.row)"
                           :row="scope.row"></column-expand>
          </template>
        </el-table-column>
        <el-table-column v-if="dragConfigRef.row" :fixed="inSortIndexEdit?false:'left'" align="center" width="50"
                         class-name="aim-column-fixed-width">
          <template slot-scope="{}" slot="header">
            <el-tooltip class="item" effect="light" content="拖拽以调整显示顺序" placement="top-start">
              <span>{{ dragConfigRef.header }}<i></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="{}"><i class="el-icon-menu"></i></template>
        </el-table-column>
        <el-table-column v-if="selection"
                         :selectable="selectionEnable"
                         :fixed="inSortIndexEdit?false:'left'"
                         class-name="aim-column-fixed-width"
                         key="aim_table_auto_column_selection" width="50"
                         type="selection"
                         align="center"
        />
        <el-table-column v-if="radio" key="aim_table_auto_column_radio" width="50" align="center">
          <template slot-scope="scope">
<!--            <el-checkbox v-model="scope.row[CtrlDataInRowData].selected" @change="(val)=>{radioRowChanged(val,scope.row)}"></el-checkbox>-->
            <el-checkbox :value="scope.row === radioRow"
                         @change="(val)=>{radioRowChanged(val,scope.row)}"></el-checkbox>
          </template>
        </el-table-column>
        <template v-for="(fs,fieldIndex) in schema">
          <el-table-column
              v-if="fieldShow(fs)"
              :key="fieldIndex"
              :prop="fs.field"
              :class-name="columnClass(fs)"
              :width="fs.width"
              :min-width="fs.min_width || fs.min_width_dynamic"
              :max-width="fs.max_width"
              :show-overflow-tooltip="fs.showOverflowTooltip"
              :label="fs.name"
              :fixed="inSortIndexEdit?false:fs.fixed"
              :sortable="fs.sortable||fs.sortable===undefined"
              :align="fs.align || 'left'"
              :fied-schema="fs"
          >
            <template slot="header">
              <column-header :field-schema="fs" :name="fs['name']" :show-static-help="true"
                             :sub="isModeInplace()?fs['nameSub']:''"
                             :container-style-for-sub="{'margin-bottom':'16px'}">
                <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
                  <slot :name="tipSlotName(fs)" :field-schema="fs"/>
                </template>
              </column-header>
              <el-link
                  v-for="(link,index) in fs['headerLinkList']"
                  :key="index"
                  @click="link.click({tableData:tableData})"
                  v-bind="link">
                <span v-if="link.label">{{link.label}}</span>
              </el-link>
            </template>
            <template slot-scope="scope">
              <div :style="columnStyle(fs)">
                <column-shortcuts :row="scope.row" :field-schema="fs"/>
                <template v-if="cellName(fs,scope.row)">
                  <!-- CellList列表组件单独处理 -->
                  <template v-if="cellName(fs,scope.row)==='CellList'">
                    <cell-list
                        :style="columnStyle(fs)"
                        :cells="cellConfig(fs,scope.row)"
                        :should-cell-hide="({cell,code})=>privateShouldCellHide({cell,code,row:scope.row,fieldSchema:fs})"
                        :should-cell-disable="({cell,code})=>privateShouldCellDisable({cell,code,row:scope.row,fieldSchema:fs})"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                    ></cell-list>
                  </template>
                  <template v-else-if="fs.slot">
                    <slot
                        v-if="!privateShouldCellHide({
                                            cell : cellConfig(fs,scope.row),
                                           row : scope.row,fieldSchema : fs})"
                        :disabled="privateShouldCellDisable({cell: cellConfig(fs,scope.row),row:scope.row,fieldSchema:fs})"
                        :name="fs.slot"
                        :row="scope.row"
                        :cell-config="cellConfig(fs,scope.row)"
                        :options="fs.options || []"
                        :field-schema="fs"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                    ></slot>
                  </template>
                  <template v-else-if="registeredComponentMap[cellName(fs,scope.row)]">
                    <component
                        v-if="!privateShouldCellHide({
                            cell : cellConfig(fs,scope.row),
                            row : scope.row,
                            fieldSchema:fs
                        })"
                        :disabled="privateShouldCellDisable({
                            cell: cellConfig(fs,scope.row),
                            row :scope.row,
                            fieldSchema : fs
                        })"
                        :is="registeredComponentMap[cellName(fs,scope.row)]"
                        :data="scope.row"
                        :field-name="fs.field"
                        :formatter="formatterFunction(fs)"
                        :cell-config="cellConfig(fs,scope.row)"
                        :options="fs.options || []"
                        :field-schema="fs"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,fieldSchema:fs,jsEvent})"
                    ></component>
                  </template>
                  <span v-else-if="cellName(fs,scope.row)">
                    {{ `${cellName(fs, scope.row)} not supported` }}
                  </span>
                  <span v-else>{{ cellShowWhenGetLostForTable(scope.row, fs) }}</span>
                </template>
                <span v-else>
                    {{ cellShowWhenGetLostForTable(scope.row, fs) }}
                  </span>
              </div>
            </template>
          </el-table-column>
        </template>
        <el-table-column key="shortcut_row_remove" v-if="rowRemoveShortcut" width="40" align="center">
          <template slot-scope="{row}">
            <el-link :disabled="rowRemoveDisable(row)" @click="tryProxyDelete(row)"><i class="el-icon-close"></i>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="aim-table-shortcuts-button">
        <div style="float:right">
          <cell-list
              :cells="righterConfigRef.cells"
              :div-style="{'padding-bottom':'6px'}"
              :should-cell-hide="privateShouldCellHide"
              :should-cell-disable="privateShouldCellDisable"
              @code-cell-click="privateCellClickForToolbar">
            <template v-for="cell in righterConfigRef.cells" v-slot:[getProxySlotName(cell.slot)]="{}">
              <slot v-if="cell.slot" :name="cell.slot"
                    :cell-config="cell"
                    :should-cell-hide="privateShouldCellHide"
                    :should-cell-disable="privateShouldCellDisable"
                    @code-cell-click="privateCellClickForToolbar"/>
            </template>
          </cell-list>
        </div>
      </div>
    </el-row>
    <el-row :style="footerConfigRef.style">
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="directionToolbarSpan(footerConfigRef,direction)" :style="footerConfigRef[direction+'Style']">
        <cell-list
            :cells="footerConfigRef[direction+'Cells']"
            :style="footerConfigRef[direction+'Style']"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar"
        >
          <template v-for="cell in footerConfigRef[direction+'Cells']" v-slot:[getProxySlotName(cell.slot)]="{}">
            <slot v-if="cell.slot" :name="cell.slot"
                  :cell-config="cell"
                  :should-cell-hide="privateShouldCellHide"
                  :should-cell-disable="privateShouldCellDisable"
                  @code-cell-click="privateCellClickForToolbar"/>
          </template>
        </cell-list>
      </el-col>
    </el-row>
    <!--    popupAppendToBody 依赖该字段决定使用drawer 或者dialog显示编辑界面，对于table的一级默认显示drawer-->
    <aim-popup
        :title="rowFormEditorTitle(rowEditState)"
        :drawer="formPopupUsingDrawer"
        :is-show.sync="rowFormEditorVisible"
        :config="{appendToBody:popupAppendToBody,close:rowFormEditorClose,footer: true,}">
      <template v-slot:aim-popup-body>
        <aim-form-input
            style="padding-right: 9px"
            ref="aimFormInput"
            v-if="rowInEditForm && rowFormEditorVisible"
            :key="xidRow(rowInEditForm)"
            :schema="validSchema(schema)"
            :group-config="groupConfig"
            :data="rowInEditForm"
            :table-data-getter="()=>{return tableData}"
            :should-cell-disable="({row,fieldSchema,cell})=>privateShouldCellDisable({cell,row,fieldSchema})"
            :alert-info="rowEditorAlert"
            :mode="rowEditState"
            :rules="FormRulesFromSchema(schema,{row:rowInEditForm,data:tableData})"
            :row-top="rowInEditForm"
            :enable-watcher="true"
            :submit-remove-field-not-in-schema="submitRemoveFieldNotInSchema"
        >
          <template v-for="fs in schema" v-slot:[getProxyTipSlotName(fs)]="{}">
            <slot v-if="tipSlotName(fs)" :name="tipSlotName(fs)" :field-schema="fs"/>
          </template>
          <template v-for="fs in schema" v-slot:[getProxyFormSlotName(fs)]="{row}">
            <slot v-if="formSlotName(fs)" :name="formSlotName(fs)" :field-schema="fs" :row="row"/>
          </template>
          <template v-for="name in allCommentSlotName"
                    v-slot:[getProxyCommentSlotNameWithName(name)]="{fieldSchema,row}">
            <slot :name="name" :field-schema="fieldSchema" :row="row"/>
          </template>
        </aim-form-input>
      </template>
      <template v-slot:aim-popup-footer>
        <template v-if="rowEditState=== AimFormInputView">
          <el-button size="mini" type="info" @click="()=>rowFormEditorVisible=false">关闭</el-button>
        </template>
        <template v-else>
          <cell-list
              :style="flexEndStyle"
              :shortcut-button-options="{circle:false}"
              :cells="editConfigRef.formEditorCells({row:rowInEditForm})"
              :should-cell-hide="privateShouldCellHide"
              :should-cell-disable="privateShouldCellDisable"
              @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:rowInEditForm,code,jsEvent,fromForm:true})">
            <template v-for="item in editConfigRef.formEditorCells" v-slot:[getProxySlotName(item.cell)]="{}">
              <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
            </template>
          </cell-list>
        </template>
      </template>
    </aim-popup>
    <aim-popup :drawer="true" :is-show.sync="visitSettingDrawerVisible" :config="{appendToBody:popupAppendToBody}">
      <template v-slot:aim-popup-body>
        <aim-table-setting
            :schema="schema"
            :group-config="groupConfig"
            :proxy="proxyConfigRef"
        />
      </template>
    </aim-popup>
  </div>
</template>

<script>
import {
  EditTriggerManual,
  EventCurrentRowChange,
  xidRow,
  isModeInplace,
  EditModeInplace,
  copyRow,
  aimTableWarn,
  aimTableLog,
  rowFormEditorTitle,
  aimTableError,
  mustCtrlData, setRowSelected, CtrlDataInRowData, isRowSelected
} from "@/components/AimTable/table";
import {filterVirtualField,} from "@/components/AimTable/virtual_field";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {
  CodeButtonAdd, CodeButtonDebug,
  CodeButtonExpandAll, CodeButtonFilterSearch,
  CodeButtonRefresh,
  CodeButtonRowClose,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowMinus, CodeButtonRowSave,
  CodeButtonRowSelectedClose,
  CodeButtonRowSelectedDelete,
  CodeButtonRowSelectedMinus,
  CodeButtonSaveTableData, CodeButtonSortIndex,
  CodeButtonTableSetting,
  CodeLinkFieldCopy, CodeLinkFilterSearch, CodeLinkFilterSearchClose
} from "@/components/cells/const";
import {FormRulesFromSchema} from "@/components/AimTable/validate";
import {directionToolbarSpan} from "@/components/AimTable/toolbar";
import ColumnHeader from "@/components/AimTable/Column/ColumnHeader.vue";
import ColumnExpand from "@/components/AimTable/Column/ColumnExpand.vue";
import MixinDataProxy from "@/components/AimTable/mixins/MixinDataProxy.vue";
import MixinBasicProperty from "@/components/AimTable/mixins/MixinBasicProperty.vue";
import MixinExpand from "@/components/AimTable/mixins/MixinExpand.vue";
import MixinDrag from "@/components/AimTable/mixins/MixinDrag.vue";
import MixinEdit from "@/components/AimTable/mixins/MixinEdit.vue";
import MixinHeader from "@/components/AimTable/mixins/MixinHeader.vue";
import MixinFooter from "@/components/AimTable/mixins/MixinFooter.vue";
import MixinRighter from "@/components/AimTable/mixins/MixinRighter.vue";
import MixinState from "@/components/AimTable/mixins/MixinState.vue";
import CellList from "@/components/cells/CellList.vue";
import {
  cellConfigForTable,
  cellShowWhenLostForTable,
  cellNameForTable,
  formatterFunction
} from "@/components/AimTable/cell";
import {
  allSlotName,
  commentSlotName, formSlotName,
  getProxyCommentSlotName, getProxyCommentSlotNameWithName, getProxyFormSlotName,
  getProxySlotName,
  getProxyTipSlotName,
  tipSlotName
} from "@/components/AimTable/slot";
import AimFormInput from "@/components/AimFormInput/index.vue";
import {flexEndStyle} from "@/components/AimTable/style";
import MixinSort from "@/components/AimTable/mixins/MixinSort.vue";
import {AimFormInputCopy, AimFormInputInsert, AimFormInputView} from "@/components/AimFormInput";
import {flexColumnWidth} from "@/components/AimTable/AutoWidth";
import AimPopup from "@/components/AimPopup/index.vue";
import ColumnShortcuts from "@/components/AimTable/Column/ColumnShortcuts.vue";
import MixinFilter from "@/components/AimTable/mixins/MixinFilter.vue";
import AimTableSetting from "@/components/AimTable/AimTableSetting/index.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "AimTable",
  computed: {
    cellName() {
      return (fs, row) => {
        return cellNameForTable(fs, row, isModeInplace(this.editConfigRef.mode))
      }
    },
    cellConfig() {
      return (fs, row) => {
        return cellConfigForTable(fs, row)
      }
    },
    allCommentSlotName() {
      return allSlotName(this.schema, 'commentSlot')
    }
  },
  mixins: [
    MixinState,
    MixinComponentMap,
    MixinDataProxy,
    MixinBasicProperty,
    MixinExpand,
    MixinDrag,
    MixinEdit,
    MixinHeader,
    MixinFooter,
    MixinRighter,
    MixinSort,
    MixinFilter,
  ],
  components: {
    AimTableSetting,
    ColumnShortcuts,
    AimPopup,
    AimFormInput,
    CellList,
    ColumnExpand, ColumnHeader,
    Loading
  },
  props: {
    submitRemoveFieldNotInSchema: Boolean,
    onEventDoLayout: {
      type: String,
      default: 'aim_table_layout'
    },
    selection: Boolean,// 是否支持选择
    // eslint-disable-next-line no-unused-vars
    selectionEnable: {
      type: Function, default: () => {
        return true
      },
    },
    rowRemoveShortcut: {type: Boolean, default: false},// 是否显示当行删除快捷方式
    autoQuery: {type: Boolean, default: true},
    radio: Boolean,// 是否支持radio选择
    formPopupUsingDrawer: {type: Boolean, default: true},
    popupAppendToBody: Boolean, //如果table为一级页面则为false，否则为true，当设定为true时，启用dialog编辑
    onSelectionChange:Function,
    onRadioChange:Function,
    onCurrentChange:Function,
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
      default: function ({code, scope, row, fieldSchema, fieldValue}) {
      },
    }
  },
  data() {
    return {
      CtrlDataInRowData:CtrlDataInRowData,
      AimFormInputView,
      flexEndStyle,
      radioRow: null,
      visitSettingDrawerVisible: false,
      tableSetting:{},
    }
  },

  beforeDestroy() {
    if (this.onEventDoLayout && jsb.cc.emitter) {
      jsb.cc.emitter.off(this.onEventDoLayout, this.doLayoutByEvent)
    }
  },
  created() {
    if (this.onEventDoLayout && jsb.cc.emitter) {
      jsb.cc.emitter.on(this.onEventDoLayout, this.doLayoutByEvent)
    }
    this.tableData = this.processTableData(this.tableData)
    if (this.autoQuery) {
      this.proxyQueryData()
    }
    this.queryTableSetting()
    this.processSchemaFilter()
    // 占位
    this.getProxySlotName()
    this.getProxyTipSlotName()
    this.getProxyCommentSlotName()
    this.tipSlotName()

    let dragCallback = null
    if (this.sortConfigRef.sortIdxField) {
      this.dragConfigRef.row = true
      this.headerConfigRef.rightCells.push(CodeButtonSortIndex)
      dragCallback = () => {
        if (!this.inSortIndexEdit) {
          return
        }
        jsb.each(this.tableData, (v, index) => {
          v[this.sortConfigRef.sortIdxField] = index + 1
        })
        this.sortIndexChanged = true
      }
      if (this.pagerConfigRef.enable) {
        aimTableError(`分页模式 与 ${this.sortConfigRef.sortIdxField} 配置不兼容`)
      }
    }
    this.initDrag(() => {
      if (dragCallback) {
        dragCallback()
      }
      if (jsb.pathGet(this.proxyConfigRef, 'isLocalData', false)) {
        const saveTableData = jsb.pathGet(this.proxyConfigRef, 'saveTableData')
        if (saveTableData) {
          saveTableData({tableData: this.tableData})
        }
      }
    })
  },
  methods: {
    queryTableSetting(){
      const querySetting = jsb.pathGet(this.proxyConfigRef, 'querySetting')
      if (!querySetting) {
        return
      }
      Promise.resolve(querySetting()).then((resp) => {
        this.tableSetting = resp
        this.schemaApplyVisitorData(jsb.pathGet(resp,'fields',[]))
      })
    },
    schemaApplyVisitorData(settingFields){
      if(!settingFields || settingFields.length === 0){
        return
      }
      jsb.each(this.schema,(fs)=>{
        const tmp = jsb.find(settingFields,v=>v.field === fs.field)
        if(!tmp) {
          return
        }
        fs.width = jsb.pathGet(tmp,'width',fs.width)
        fs.min_width = jsb.pathGet(tmp,'min_width',fs.min_width)
        fs.max_width = jsb.pathGet(tmp,'max_width',fs.max_width)
        fs.show  = jsb.pathGet(tmp,'show',fs.show)
        fs.tipsHTML  = jsb.pathGet(tmp,'tips',fs.tipsHTML)

        if(!fs.width){
          delete fs.width
        }
        if(!fs.min_width){
          delete fs.min_width
        }
        if(!fs.max_width){
          delete fs.max_width
        }
      })
      this.doLayoutByEvent(true)
    },
    commentSlotName,
    getProxyCommentSlotNameWithName,
    rowFormEditorTitle,
    formatterFunction,
    cellShowWhenGetLostForTable: cellShowWhenLostForTable,
    directionToolbarSpan,
    FormRulesFromSchema,
    validSchema: filterVirtualField,
    xidRow,
    tipSlotName,
    formSlotName,
    getProxyFormSlotName,
    getProxySlotName,
    getProxyTipSlotName,
    getProxyCommentSlotName,
    columnStyle(field){
      const defaultStyle = { 'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}
      const fieldColumnStyle = jsb.pathGet(field,'columnStyle',{})
      if(field.align === 'center'){
        defaultStyle['justify-content'] = 'center'
      }
      if(field.align === 'left' || field.align === 'start'){
        defaultStyle['justify-content'] = 'flex-start'
      }
      if(field.align === 'right' || field.align === 'end'){
        defaultStyle['justify-content'] = 'flex-end'
      }
      return Object.assign(defaultStyle,fieldColumnStyle)
    },
    rowRemoveDisable(row) {
      if (this.readOnly) {
        return true
      }
      if (this.selectionEnable) {
        if (!this.selectionEnable(row)) {
          return true
        }
      }
      return false
    },
    doLayoutByEvent(freshAutoWidth = false) {
      const _this = this
      _this.$nextTick(() => {
        _this.doLayout(freshAutoWidth)
        setTimeout(function () {
          _this.doLayout(freshAutoWidth)
        }, 50)
      })
    },
    setDebugMessage(title, msg = '') {
      aimTableLog(title, msg)
    },
    fieldShow(fs) {
      const show = jsb.pathGet(fs, 'show', true)
      if (jsb.isFunction(show)) {
        return show()
      }
      return show
    },
    pathGet(data, fieldPath, defaultVal = undefined) {
      return jsb.pathGet(data, defaultVal, true)
    },
    columnClass(fs) {
      if (fs.width || fs.min_width || fs.max_width) {
        return 'aim-column-fixed-width'
      }
      return ''
    },
    escKey() {
      if (this.isModeInplace()) {
        this.rowInEdit = null
      }
    },
    thisTarget() {
      return this
    },
    // 在控制字段中记录数据是否被选中
    selectionChange(selectedRows) {
      const selected = jsb.map(selectedRows, row => xidRow(row))
      jsb.each(this.tableData, v => {
        setRowSelected(v, selected.includes(xidRow(v)))
      })
      if(this.onSelectionChange){
        this.onSelectionChange({rows:selectedRows})
      }
    },
    radioRowChanged(val,row) {
      this.radioRow = null
      jsb.each(this.tableData,v=>{
        setRowSelected(v,false)
      })
      this.radioRow = val?row:null
      setRowSelected(row,val)
      if(this.onRadioChange){
        this.onRadioChange({row:this.radioRow})
      }
      this.debug && this.setDebugMessage(`rowSelectionChanged row ${this.summaryRow(row)}`,isRowSelected(row),)
    },
    tableHeight() {
      if (!this.tablePropertyRef.heightSubVH) {
        // null或者0根据内容自适应高度
        if (jsb.isNull(this.tablePropertyRef.height) || parseInt(this.tablePropertyRef.height) === 0) {
          return null
        }
        if (!jsb.isEmpty(this.tablePropertyRef.height)) {
          return this.tablePropertyRef.height
        }
      }
      let sub = 70 + this.tablePropertyRef.heightSubVH
      sub += this.headerConfigRef.enable ? 40 : 0
      sub += this.pagerConfigRef.enable ? 40 : 0
      return `${jsb.clientHeight(sub)}px`
    },
    // current-change 回调
    currentChange(row) {
      // this.debug && this.setDebugMessage(`currentChange row ${this.summaryRow(row)}`)
      this.currentRow = row;
      this.$emit(EventCurrentRowChange, {row})
      if(this.onCurrentChange){
        this.onCurrentChange({row})
      }
    },
    // eslint-disable-next-line no-unused-vars
    privateCellClickForRow({code, row, jsEvent, fromForm}) {
      this.privateCellClick({code, row, jsEvent, fromForm})
    },
    // header或者footer的item点击时间事件
    privateCellClickForToolbar({code}) {
      this.privateCellClick({code})
    },
    privateCellClick({code, row, fieldSchema, fieldValue, jsEvent, fromForm}) {
      this.debug && this.setDebugMessage(`privateCodeItemClick code: ${code}`)
      const done = () => {
        this.defaultCellClick({code, row, fieldValue, jsEvent, fromForm})
      }
      if (this.codeItemClick({code, row, fieldSchema, fieldValue, done})) {
        return
      }
      this.defaultCellClick({code, row, fieldValue, jsEvent, fromForm})
    },
    // 默认的code处理逻辑
    defaultCellClick({code, row, fieldValue, jsEvent, fromForm}) {
      const _this = this
      const editDone = ({error}) => {
        if (!error && fromForm) {
          this.rowFormEditorVisible = false
          // form表单编辑完后重新拉取数据
          this.proxyQueryData()
        }
      }
      switch (code) {
        case CodeButtonSortIndex:
          if (this.inSortIndexEdit) {
            // 提交index变更
            this.inSortIndexEdit = false
            if (this.sortIndexChanged) {
              this.trySaveField(this.sortConfigRef.sortIdxField)
            }
          } else {
            this.inSortIndexEdit = true
            this.sortIndexChanged = false
          }
          aimTableWarn(`sort index edit  ${this.inSortIndexEdit ? 'opened' : 'closed'}`)
          break
        case CodeButtonDebug:
          this.debug = !this.debug
          aimTableWarn(`${this.debug ? 'opened' : 'closed'}`)
          break
        case CodeButtonRefresh:
          this.proxyQueryData()
          break
        case CodeButtonSaveTableData:
          this.trySaveTableData()
          break
        case CodeLinkFieldCopy:
          jsb.clipCopy(fieldValue, jsEvent)
          break
        case CodeButtonAdd:
          this.addRow({
                initRow:jsb.pathGet(this.tableSetting,'template',{})
              }
          )
          break
        case CodeButtonFilterSearch:
        case CodeLinkFilterSearch:
          this.filterSearch({mode: jsb.pathGet(this.filterConfigRef, 'filterMode', {})})
          break
        case CodeLinkFilterSearchClose:
          jsb.each(this.filterData, (v, k) => {
            _this.filterData[k] = ''
          })
          break
        case CodeButtonRowCopy:
          this.addRow({
            initRow: this.editConfigRef.copyRow(copyRow(row)),
            isCopy: true
          })
          break
        case CodeButtonRowEdit:
          this.rowClickWithTriggerName(row, EditTriggerManual)
          break
        case CodeButtonRowDelete:
        case CodeButtonRowMinus:
        case CodeButtonRowClose:
          this.tryProxyDelete(row, {done: editDone})
          break
        case CodeButtonRowSelectedMinus:
        case CodeButtonRowSelectedDelete:
        case CodeButtonRowSelectedClose:
          // 本地删除依赖ctrl xid数据
          this.tryProxyDeleteRows(this.getSelectionRows(false))
          break
        case CodeButtonTableSetting:
          this.visitSettingDrawerVisible = true
          break
        case CodeButtonExpandAll:
          this.expandAll(this.tableData, this.$refs.table)
          break
        case CodeButtonRowSave:
          if (fromForm) {
            this.$refs.aimFormInput.__validateFromAimTable(() => {
              this.tryProxySaveRow(row, {done: editDone})
            })
          } else {
            //fixme inplace 下无法使用form的validate
            this.tryProxySaveRow(row, {done: editDone})
          }
          break
        default:
          this.toastWarning(`code ${code} no handler`)
      }
    },
    addRow({initRow, isCopy} = {initRow: {}, isCopy: false}) {
      if (jsb.eqNull(this.tableData)) {
        this.tableData = []
      }
      this.rowEditorAlert = ''
      this.rowEditState = AimFormInputInsert
      if (isCopy) {
        this.rowEditState = AimFormInputCopy
      }
      let newRow = mustCtrlData(this.editConfigRef.newRow(this.schema, initRow))
      this.currentRow = newRow
      this.updateRowInEdit(newRow)

      if (this.isModeInplace()) {
        // inplace编辑模式
        this.tableData.push(newRow)
      } else {
        // form 表单编辑逻辑
        this.showFormEditorForRow(newRow)
      }
    },
    rowFormEditorClose() {
      // this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
    privateShouldCellDisable({code, cell, row, fieldSchema}) {
      if (this.readOnly) {
        // 按钮的禁用需要根据code区分，暂时全部屏蔽
        return true
      }
      code = code || jsb.pathGet(cell, 'code')
      if (this.inSortIndexEdit) {
        return code !== CodeButtonSortIndex;
      }
      if (code === CodeButtonRowSelectedMinus ||
          code === CodeButtonRowSelectedClose ||
          code === CodeButtonRowSelectedDelete) {
        return this.getSelectionRows().length === 0
      }
      if (row && this.editConfigRef.mode === EditModeInplace && row !== this.rowInEdit) {
        return true
      }
      if (cell.disable || cell.disabled) {
        return true
      }
      if (!this.shouldCellDisable) {
        return false
      }
      if (jsb.isArray(this.shouldCellDisable)) {
        jsb.each(this.shouldCellDisable, item => () => {
          item({table: this.tableData, code, cell, row, fieldSchema})
        })
      }
      return this.shouldCellDisable({table: this.tableData, code, cell, row, fieldSchema})
    },

    doLayout(freshAutoWidth = false) {
      if (freshAutoWidth && this.tablePropertyRef.autoWidth) {
        flexColumnWidth(this.schema, this.tableData)
      }
      this.debug && this.setDebugMessage(`call doLayout`)
      this.$refs.table && this.$refs.table.doLayout()
    },
    privateShouldCellHide({code, cell, row, fieldSchema}) {
      if (!cell) {
        return false
      }
      if (cell.hide || !jsb.pathGet(cell, 'show', true)) {
        return true
      }
      if (!this.shouldCellHide) {
        return false
      }
      if (jsb.isArray(this.shouldCellHide)) {
        jsb.each(this.shouldCellHide, item => () => {
          item({code, cell, row, fieldSchema})
        })
      }
      return this.shouldCellHide({code, cell, row, fieldSchema})
    },
  }
}
</script>

<style lang="scss">
.aim-table-shortcuts-button {
  position: sticky;
  top: 0;
}

.aim-component-flex-end {
  display: flex;
  align-items: center;
  overflow: hidden;
  z-index: 10;
  justify-content: flex-end;
}

.el-table.aim-table-normal-padding td, .el-table.aim-table-normal-padding th {
}

.el-table.aim-table-medium-padding td, .el-table.aim-table-medium-padding th {
  padding: 6px
}

.el-table.aim-table-small-padding td, .el-table.aim-table-small-padding th {
  padding: 3px
}

.el-table.aim-table-mini-padding td, .el-table.aim-table-mini-padding th {
  padding: 1px
}

.aim-table-mini-padding .el-table__header tr,
.aim-table-mini-padding .el-table__header th {
  padding: 0;
  height: 12px;
}


.el-table.aim-table-auto-width .cell {
  white-space: nowrap;
  width: 100%;
  overflow-x: hidden;
}

.el-table.aim-table-auto-width .el-table__body-wrapper {
  overflow-x: auto;
}

.sortable-ghost {
  opacity: .8 !important;
  color: #fff !important;
  background: #42b983 !important;
}
</style>