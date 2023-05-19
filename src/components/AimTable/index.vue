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
          :data="tableData"
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
      >
        <el-table-column v-if="expandConfig" type="expand" key="aim-table-column-expand" width="30"
                         class-name="aim-column-fixed-width" fixed="left">
          <template slot-scope="scope">
            <column-expand :expand-config-data="expandConfigRef" :key="xidRow(scope.row)"
                           :row="scope.row"></column-expand>
          </template>
        </el-table-column>
        <el-table-column v-if="dragConfigRef.row" fixed="left" align="center" width="50"
                         class-name="aim-column-fixed-width">
          <template slot-scope="{}" slot="header">
            <el-tooltip class="item" effect="light" content="拖拽以调整显示顺序" placement="top-start">
              <span>{{ dragConfigRef.header }}<i></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="{}"><i class="el-icon-menu"></i></template>
        </el-table-column>
        <el-table-column v-if="selection" fixed="left" class-name="aim-column-fixed-width"
                         key="aim_table_auto_column_selection" width="50"
                         type="selection" align="center"/>
        <el-table-column v-if="radio" key="aim_table_auto_column_radio" width="50" align="center">
          <template slot-scope="scope">
            <el-checkbox :value="scope.row === currentRow"
                         @change="(val)=>radioRowChanged(scope.row,val)"></el-checkbox>
          </template>
        </el-table-column>
        <template v-for="(fs,fieldIndex) in schema">
          <el-table-column
              v-if="fieldShow(fs)"
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
              <column-header :field-schema="fs">
                <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
                  <slot :name="tipSlotName(fs)" :field-schema="fs"/>
                </template>
              </column-header>
            </template>
            <template slot-scope="scope">

              <column-shortcuts
                  :row="scope.row"
                  :field-schema="fs"
              >
              </column-shortcuts>

              <template v-if="cellName(fs,scope.row)">
                <!-- CellList列表组件单独处理 -->
                <template v-if="cellName(fs,scope.row)==='CellList'">
                  <cell-list
                      :style="{'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}"
                      :cells="cellConfig(fs,scope.row)"
                      :should-cell-hide="({cell,code})=>privateShouldCellHide({cell,code,row:scope.row,fieldSchema:fs})"
                      :should-cell-disable="({cell,code})=>privateShouldCellDisable({cell,code,row:scope.row,fieldSchema:fs})"
                      @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                  ></cell-list>
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
                <span v-else-if="cellName(fs,scope.row)">
                    {{`${cellName(fs,scope.row)} not supported`}}
                  </span>
                <span v-else>{{ cellShowWhenGetLostForTable(scope.row, fs) }}</span>
              </template>
              <span v-else>
                    {{ cellShowWhenGetLostForTable(scope.row, fs) }}
                  </span>
            </template>
          </el-table-column>
        </template>
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
    <aim-popup
        v-if="rowInEditForm"
        :title="rowFormEditorTitle(rowEditState)"
        :drawer="popupAppendToBody?false:editConfigRef.formWrapperDrawer"
        :is-show.sync="rowFormEditorVisible"
        :config="getFormPopupConfig(rowInEditForm)">
      <template v-slot:aim-popup-body>
        <aim-form-input
            style="padding-right: 9px"
            ref="aimFormInput"
            v-if="rowInEditForm && rowFormEditorVisible"
            :key="xidRow(rowInEditForm)"
            :schema="validSchema(schema)"
            :group-config="groupConfig"
            :data="rowInEditForm"
            :popup-append-to-body="true"
            :should-cell-disable="({row,fieldSchema,cell})=>privateShouldCellDisable({cell,row,fieldSchema})"
            :alert-info="rowEditorAlert"
            :mode="rowEditState"
            :rules="formRulesFromSchema(schema,{row:rowInEditForm,data:tableData})"
            :row-top="rowInEditForm"
            :enable-watcher="false"
        >
          <template v-for="fs in schema" v-slot:[getProxyTipSlotName(fs)]="{}">
            <slot :name="tipSlotName(fs)" :field-schema="fs"/>
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
        <aim-table-editor
            editor-table-key="aim-table-editor"
            :editor-group-options="editorGroupOptions"
            :editor-user-options="editorUserOptions"
            :editor-proxy-config="editorProxyConfig"
            :schema="cloneSchema()">
        </aim-table-editor>
      </template>
    </aim-popup>
  </div>
</template>

<script>
import {
  EditTriggerManual,
  EventCurrentRowChange,
  xidRow, isModeInplace, EditModeInplace, copyRow, aimTableWarn, aimTableLog, rowFormEditorTitle
} from "@/components/AimTable/table";
import {filterVirtualField,} from "@/components/AimTable/schema";
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
  CodeButtonSaveTableData,
  CodeButtonTableSetting,
  CodeLinkFieldCopy
} from "@/components/cells/const";
import {formRulesFromSchema} from "@/components/AimTable/validate";
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
import MixinTableEditorConfig from "@/components/AimTable/mixins/MixinTableEditorConfig.vue";
import MixinVisitor from "@/components/AimTable/mixins/MixinVisitor.vue";
import CellList from "@/components/cells/CellList.vue";
import AimTableEditor from "@/components/AimTable/AimTableEditor/index.vue";
import {
  cellConfigForTable,
  cellShowWhenLostForTable,
  cellNameForTable,
  formatterFunction
} from "@/components/AimTable/cell";
import {getProxySlotName, getProxyTipSlotName, tipSlotName} from "@/components/AimTable/slot";
import AimFormInput from "@/components/AimFormInput/index.vue";
import {flexEndStyle} from "@/components/AimTable/style";
import {cellNameForFormByType} from "@/components/cells/types";
import MixinSort from "@/components/AimTable/mixins/MixinSort.vue";
import {AimFormInputView} from "@/components/AimFormInput";
import {flexColumnWidth} from "@/components/AimTable/AutoWidth";
import AimPopup from "@/components/AimPopup/index.vue";
import ColumnShortcuts from "@/components/AimTable/Column/ColumnShortcuts.vue";
const jsb = require("@sandwich-go/jsb")

export default {
  name: "AimTable",
  computed: {
    cellName() {
      return (fs, row) => {
        return cellNameForTable(fs, row,isModeInplace(this.editConfigRef.mode))
      }
    },
    cellConfig() {
      return (fs, row) => {
        return cellConfigForTable(fs, row)
      }
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
    MixinTableEditorConfig,
    MixinVisitor,
    MixinSort,
  ],
  components: {
    ColumnShortcuts,
    AimPopup,
    AimFormInput,
    AimTableEditor,
    CellList,
    ColumnExpand, ColumnHeader,
    Loading
  },
  props: {
    selection: Boolean,// 是否支持选择
    radio: Boolean,// 是否支持radio选择
    popupAppendToBody: Boolean, //如果table为一级页面则为false，否则为true
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
      AimFormInputView,
      flexEndStyle,
      radioRow: null,
      visitSettingDrawerVisible: false,
    }
  },
  created() {
    this.tableData = this.processTableData(this.tableData)
    this.proxyQueryData()
    this.schemaApplyVisitorData()
    this.processSchemaFilter()
    // 占位
    this.getProxySlotName()
    this.getProxyTipSlotName()
    this.tipSlotName()
  },
  methods: {
    rowFormEditorTitle,
    formatterFunction,
    cellShowWhenGetLostForTable: cellShowWhenLostForTable,
    directionToolbarSpan,
    formRulesFromSchema,
    validSchema: filterVirtualField,
    xidRow,
    tipSlotName,
    getProxySlotName,
    getProxyTipSlotName,
    setDebugMessage(title,msg='') {
      aimTableLog(title,msg)
    },
    fieldShow(fs) {
      return jsb.pathGet(fs, 'show', true)
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
    processSchemaFilter(){
      const _this = this
      let schemaFilter = []
      jsb.each(this.schema,function (fieldSchema){
        if(fieldSchema.filter){
          if(!fieldSchema.filter.type){
            fieldSchema.filter.type = fieldSchema.type
          }
          if(!fieldSchema.filter.field){
            fieldSchema.filter.field = fieldSchema.field
          }
          if(!fieldSchema.filter.options){
            fieldSchema.filter.options = fieldSchema.options
          }
          if(!fieldSchema.filter.cell){
            fieldSchema.filter.cell = cellNameForFormByType(fieldSchema.filter.type)
          }
          fieldSchema.filter.data = _this.filterData
          _this.filterTypeMapping[fieldSchema.filter.field] = fieldSchema.filter
          schemaFilter.push(fieldSchema.filter)
        }
      })
      if(schemaFilter.length) {
        schemaFilter.push({code:CodeButtonFilterSearch})
        let leftCells = this.headerConfigRef.leftCells
        jsb.each(leftCells,function (cell,index) {
          if(jsb.isString(cell) && cell.toUpperCase() ==='FILTER') {
            leftCells.splice(index, 1, ...schemaFilter);
          }
        })
      }
    },
    escKey() {
      if (this.isModeInplace()) {
        this.rowInEdit = null
      }
    },
    getFormPopupConfig(){
      return {
        appendToBody:this.popupAppendToBody,
        close:this.rowFormEditorClose,
        footer:true,
      }
    },
    thisTarget() {
      return this
    },
    radioRowChanged(row, selected) {
      this.radioRow = selected ? row : null
      this.debug && this.setDebugMessage(`rowSelectionChanged row ${this.summaryRow(row)}`)
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
      sub += this.debug ? 37 : 0
      return `${jsb.clientHeight(sub)}px`
    },
    // current-change 回调
    currentChange(row) {
      // this.debug && this.setDebugMessage(`currentChange row ${this.summaryRow(row)}`)
      this.currentRow = row;
      this.$emit(EventCurrentRowChange, {row})
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
      if (this.codeItemClick({code, row, fieldSchema, fieldValue})) {
        return
      }
      this.defaultCellClick({code, row, fieldValue, jsEvent, fromForm})
    },
    // 默认的code处理逻辑
    defaultCellClick({code, row, fieldValue, jsEvent, fromForm}) {
      const editDone = ({error}) => {
        if(!error && fromForm) {
          this.rowFormEditorVisible = false
          // form表单编辑完后重新拉取数据
          this.proxyQueryData()
        }
      }
      switch (code) {
        case CodeButtonDebug:
          this.debug = !this.debug
          aimTableWarn(`${this.debug?'opened':'closed'}`)
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
          this.addRow()
          break
        case CodeButtonFilterSearch:
          this.proxyQueryData()
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
          this.tryProxyDelete(row, {done:editDone})
          break
        case CodeButtonRowSelectedMinus:
        case CodeButtonRowSelectedDelete:
        case CodeButtonRowSelectedClose:
          this.tryProxyDeleteRows(this.getSelectionRows(true))
          break
        case CodeButtonTableSetting:
          this.visitSettingDrawerVisible = true
          break
        case CodeButtonExpandAll:
          this.expandAll(this.tableData, this.$refs.table)
          break
        case CodeButtonRowSave:
          if (fromForm) {
            this.$refs.aimFormInput.validate(() => {
              this.tryProxySaveRow(row, {done:editDone})
            })
          } else {
            //fixme inplace下无法使用form的validate
            this.tryProxySaveRow(row, {done:editDone})
          }
          break
        default:
          this.toastWarning(`code ${code} no handler`)
      }
    },
    rowFormEditorClose() {
      // this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
    privateShouldCellDisable({code, cell, row, fieldSchema}) {
      if(this.readOnly) {
        // 按钮的禁用需要根据code区分，暂时全部屏蔽
        return true
      }
      if (code === CodeButtonRowSelectedMinus ||
          code === CodeButtonRowSelectedClose ||
          code === CodeButtonRowSelectedDelete) {
        return this.getSelectionRows().length === 0
      }
      if(row && this.editConfigRef.mode === EditModeInplace && row !== this.rowInEdit) {
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
          item({code, cell, row, fieldSchema})
        })
      }
      return this.shouldCellDisable({code, cell, row, fieldSchema})
    },
    cloneSchema(){
      return jsb.clone(this.schema)
    },
    doLayout(freshAutoWidth=false) {
      if(freshAutoWidth && this.tablePropertyRef.autoWidth){
        flexColumnWidth(this.schema,this.tableData)
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