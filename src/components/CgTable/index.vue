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
    <el-row :style="headerConfigRef.style">
      <!-- header toolbar -->
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="directionToolbarSpan(headerConfigRef,direction)">
        <cg-cells
            :style="headerConfigRef[direction+'ColumnStyle']"
            :cells="headerConfigRef[direction+'Cells']"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar"
        >
          <!-- 透传使用逻辑层定义的slot组件 -->
          <template v-for="item in headerConfigRef[direction+'Cells']" v-slot:[getProxySlotName(item.cell)]="{}">
            <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
          </template>
        </cg-cells>
      </el-col>
    </el-row>

    <el-row class="cg-component-flex-end" style="align-items: start;gap: 3px">
      <el-table
          v-fit-columns="{
            enabled:tablePropertyRef.autoWidth,
            doLayout:(done)=> {$nextTick(()=>{doLayout();done && done()})},
          }"
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
          @current-change="currentChange"
          @row-dblclick="rowDblClick"
          @row-click="rowClick"
          :row-key="xidRow"
      >
        <el-table-column v-if="expandConfig" type="expand" key="cg-table-column-expand" width="30"
                         class-name="cg-column-fixed-width" fixed="left">
          <template slot-scope="scope">
            <column-expand :expand-config-data="expandConfigRef" :key="xidRow(scope.row)"
                           :row="scope.row"></column-expand>
          </template>
        </el-table-column>
        <el-table-column v-if="dragConfigRef.row" fixed="left" align="center" width="50"
                         class-name="cg-column-fixed-width">
          <template slot-scope="{}" slot="header">
            <el-tooltip class="item" effect="light" content="拖拽以调整显示顺序" placement="top-start">
              <span>{{ dragConfigRef.header }}<i></i></span>
            </el-tooltip>
          </template>
          <template slot-scope="{}"><i class="el-icon-menu"></i></template>
        </el-table-column>
        <el-table-column v-if="selection" fixed="left" class-name="cg-column-fixed-width"
                         key="cgt_auto_column_selection" width="50"
                         type="selection" align="center"/>
        <el-table-column v-if="radio" key="cgt_auto_column_radio" width="50" align="center">
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
              <column-header :field-schema="fs"/>
            </template>
            <template slot-scope="scope">
              <span :set="celllName = cellTableName(fs,scope.row)">
                <span :set="celllConfig = cellTableConfig(scope.row,fs)">
                  <template v-if="celllName">
                  <!-- CgCells列表组件单独处理 -->
                  <div style="padding-top: 6px">
                    <cg-cells
                        v-if="celllName=== CellTableCells"
                        :style="{'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}"
                        :cells="celllConfig"
                        :should-cell-hide="({cell,code})=>privateShouldCellHide({cell,code,row:scope.row,fieldSchema:fs})"
                        :should-cell-disable="({cell,code})=>privateShouldCellDisable({cell,code,row:scope.row,fieldSchema:fs})"
                        @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                    ></cg-cells>
                    <template v-else-if="registeredComponentMap[celllName]">
                      <component
                          v-if="!privateShouldCellHide({cell:celllConfig,code:celllConfig.code||'',row:scope.row,fieldSchema:fs})"
                          :is="registeredComponentMap[celllName]"
                          :data="scope.row"
                          :options="fs.options || []"
                          :disabled="privateShouldCellDisable({cell:celllConfig,code:celllConfig.code||'',row:scope.row,fieldSchema:fs})"
                          :field-name="fs.field"
                          :cell-config="celllConfig"
                          @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                      ></component>
                    </template>
                    <slot
                        v-else-if="!privateShouldCellHide({cell:celllConfig,code:celllConfig.code||'',row:scope.row,fieldSchema:fs})"
                        :name="celllName"
                        :row="scope.row"
                        :field-schema="fs"
                        :disabled="privateShouldCellDisable({row:scope.row,fieldSchema:fs})"
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
            </span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="cg-table-shortcuts-button">
        <div style="float:right">
          <cg-cells
              :cells="righterConfigRef.cells"
              :div-style="{'padding-bottom':'6px'}"
              :should-cell-hide="privateShouldCellHide"
              :should-cell-disable="privateShouldCellDisable"
              @code-cell-click="privateCellClickForToolbar">
            <template v-for="item in righterConfigRef.cells" v-slot:[getProxySlotName(item.cell)]="{}">
              <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
            </template>
          </cg-cells>
        </div>
      </div>
    </el-row>

    <el-row :style="footerConfigRef.style">
      <el-col v-for="direction of ['left','right']"
              :key="direction"
              :span="directionToolbarSpan(footerConfigRef,direction)" :style="footerConfigRef[direction+'ColumnStyle']">
        <cg-cells
            :cells="footerConfigRef[direction+'Cells']"
            :style="footerConfigRef[direction+'ColumnStyle']"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="privateCellClickForToolbar"
        >
          <template v-for="item in footerConfigRef[direction+'Cells']" v-slot:[getProxySlotName(item.cell)]="{}">
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
        :append-to-body="popupAppendToBody"
        @close="rowFormEditorClose"
        :visible.sync="rowFormEditorVisible">
      <cg-form-input
          ref="cgFrom"
          v-if="rowInEdit && rowFormEditorVisible"
          :key="xidRow(rowInEdit)"
          :schema="validSchema(schema)"
          :data="rowInEdit"
          :popup-append-to-body="true"
          :should-cell-disable="({row,fieldSchema,cell})=>privateShouldCellDisable({cell,row,fieldSchema})"
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
            :cells="editConfigRef.formEditorCells({row:rowInEdit})"
            :should-cell-hide="privateShouldCellHide"
            :should-cell-disable="privateShouldCellDisable"
            @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:rowInEdit,code,jsEvent,fromForm:true})"
        >
          <template v-for="item in editConfigRef.formEditorCells" v-slot:[getProxySlotName(item.cell)]="{}">
            <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
          </template>
        </cg-cells>
        </template>
      </span>
    </el-dialog>


    <cg-drawer :is-show.sync="visitSettingDrawerVisible" :config="{appendToBody:popupAppendToBody}">
      <template v-slot:cg-drawer-body>
        <cg-table-editor
            editor-table-key="TestTable"
            :editor-group-options="editorGroupOptions"
            :editor-user-options="editorUserOptions"
            :editor-proxy-config="editorProxyConfig"
            :schema="schema">
        </cg-table-editor>
      </template>
    </cg-drawer>
  </div>
</template>

<script>
import Vue from 'vue';
import AutoWidth from './AutoWidth';
import {
  cleanData, EditTriggerInplaceNone,
  EditTriggerSwitchButton,
  EventCurrentRowChange,
  getProxySlotName,
  mustCtrlData,
  removeCtrlData, RowEditorInplace,
  rowFormEditorTitle,
  xidRow
} from "@/components/CgTable/table";
import {flexEndStyle, validSchema,} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CgCells from "@/components/cells/CgCells.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {
  CgFormInputModeView
} from "@/components/CgFormInput";
import CgFormInput from "@/components/CgFormInput/index.vue";
import {CellTableCells, cellTableConfig, cellTableName} from "@/components/CgTable/cell";
import {
  CodeButtonAdd,
  CodeButtonExpandAll,
  CodeButtonRefresh,
  CodeButtonRowClose,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowMinus,
  CodeButtonRowSaveRemote,
  CodeButtonRowSelectedClose,
  CodeButtonRowSelectedDelete,
  CodeButtonRowSelectedMinus,
  CodeButtonSaveTableData,
  CodeButtonTableSetting,
  CodeLinkFieldCopy
} from "@/components/cells/const";
import {formRulesFromSchema} from "@/components/CgTable/validate";
import CgViewerLabelTooltip from "@/components/cells/viewer/CgViewerTooltip.vue";
import ColumnHeader from "@/components/CgTable/ColumnHeader.vue";
import ColumnExpand from "@/components/CgTable/ColumnExpand.vue";
import CgDrawer from "@/components/CgDrawer/index.vue";
import CgTableEditor from "@/components/CgTable/CgTableEditor/index.vue";
import MixinDataProxy from "@/components/CgTable/mixins/MixinDataProxy.vue";
import MixinBasicProperty from "@/components/CgTable/mixins/MixinBasicProperty.vue";
import MixinExpand from "@/components/CgTable/mixins/MixinExpand.vue";
import MixinDrag from "@/components/CgTable/mixins/MixinDrag.vue";
import MixinEdit from "@/components/CgTable/mixins/MixinEdit.vue";
import MixinHeader from "@/components/CgTable/mixins/MixinHeader.vue";
import MixinFooter from "@/components/CgTable/mixins/MixinFooter.vue";
import MixinRighter from "@/components/CgTable/mixins/MixinRighter.vue";
import MixinState from "@/components/CgTable/mixins/MixinState.vue";
import {directionToolbarSpan} from "@/components/CgTable/mixins/toolbar";
import MixinTableEditorConfig from "@/components/CgTable/mixins/MixinTableEditorConfig.vue";
import MixinVisitor from "@/components/CgTable/mixins/MixinVisitor.vue";

Vue.use(AutoWidth);

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  computed: {
    flexEndStyle() {
      return flexEndStyle
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
  ],
  components: {
    CgTableEditor, CgDrawer, ColumnExpand, ColumnHeader, CgViewerLabelTooltip, CgFormInput, CgCells, Loading
  },
  props: {
    selection: Boolean,// 是否支持选择
    radio: Boolean,// 是否支持radio选择
    popupAppendToBody: Boolean,
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
      radioRow: null,
      visitSettingDrawerVisible: false,
    }
  },
  created() {
    cleanData(this.tableData, this.schema, this.proxyConfigRef.item2Row)
    this.tryProxyQueryData()
    this.schemaApplyVisitorData()
  },
  methods: {
    directionToolbarSpan,
    rowFormEditorTitle,
    formRulesFromSchema,
    validSchema,
    cellTableName,
    cellTableConfig,
    xidRow,
    getProxySlotName,
    setDebugMessage(msg) {
      this.debugMessage = msg
    },
    fieldShow(fs){
      return jsb.pathGet(fs,'show',true)
    },
    columnClass(fs) {
      if (fs.width || fs.min_width || fs.max_midth) {
        return 'cg-column-fixed-width'
      }
      return ''
    },

    escKey() {
      if (this.isInplaceEditor()) {
        this.rowInEdit = null
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
      const done = ({error}) => {
        !error && (this.rowFormEditorVisible && (this.rowFormEditorVisible = false))
      }
      switch (code) {
        case CodeButtonRefresh:
          this.tryProxyQueryData()
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
        case CodeButtonRowCopy:
          this.addRow({
            initRow: this.editConfigRef.copyRow(mustCtrlData(removeCtrlData(jsb.clone(row)))),
            isCopy: true
          })
          break
        case CodeButtonRowEdit:
          this.rowClickWithTriggerName(row, EditTriggerSwitchButton)
          break
        case CodeButtonRowDelete:
        case CodeButtonRowMinus:
        case CodeButtonRowClose:
          this.tryProxyDelete(row, {done})
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
    rowFormEditorClose() {
      // this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
    privateShouldCellDisable({code, cell, row, fieldSchema}) {
      if(code === CodeButtonRowSelectedMinus ||
          code === CodeButtonRowSelectedClose ||
          code === CodeButtonRowSelectedDelete) {
        return this.getSelectionRows().length === 0
      }
      if (this.editConfigRef.rowEditor === RowEditorInplace && !this.isEditTriggerAccepted(EditTriggerInplaceNone)) {
        return this.rowInEdit !== row
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

.cg-table-mini-padding .el-table__header tr,
.cg-table-mini-padding .el-table__header th {
  padding: 0;
  height: 12px;
}


.el-table.cg-table-auto-width .cell {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow-x: hidden;
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