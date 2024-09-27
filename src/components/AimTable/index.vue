<template>
  <div @keyup.esc="escKey" :style="tablePropertyRef.divStyle">
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <aim-full-screen-dialog ref="fullscreen" :show-button-exit="false" :show-button-enter="false">
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
            <template v-slot:cell-list-first>
              <span v-if="sortIndexChangedRows.length" style="border-bottom: #ae00ae">
                <span style="font-size: 13px;padding-right: 6px;color:dodgerblue">排序变动，是否保存?</span>
                <el-button size="mini" type="primary" icon="el-icon-sort" @click="saveSortIndexChangedRows">保存</el-button>
              </span>
            </template>
          </cell-list>
        </el-col>
      </el-row>
      <el-row class="aim-component-flex-end" style="align-items: start;gap: 3px;padding-top: 3px">
        <el-table
            ref="table"
            :height="tableHeight"
            :tree-props="pathGet(treeProps,'enable',false)?treeProps:{}"
            :max-height="tablePropertyRef.maxHeight"
            :data="tableDataFiltered ? tableDataFiltered : tableData"
            :border="tablePropertyRef.border"
            :stripe="tablePropertyRef.stripe"
            :class="tableClass"
            :show-header="tablePropertyRef.showHeader"
            :empty-text="tablePropertyRef.emptyText"
            :header-cell-style="tablePropertyRef.headerCellStyle"
            :highlight-current-row="tablePropertyRef.highlightCurrentRow"
            :cell-style="cellStyleWrapper"
            :cell-class-name="cellClassName"
            :default-expand-all="defaultExpandAll"
            :row-style="tablePropertyRef.rowStyle"
            :row-class-name="privateRowClassName"
            @current-change="currentChange"
            @row-dblclick="privateRowDblClick"
            @row-click="privateRowClick"
            @sort-change="handleSortChange"
            :row-key="xidRow"
            :header-cell-class-name="headerCellClassName"
            @selection-change="selectionChange"
            @select="handleSelect"
            @select-all="handleSelectAll"
        >

          <el-table-column v-if="currentIcon" key="aim_table_auto_column_current_icon" width="40" align="center" :fixed="columnCurrentFixed">
            <template v-if="currentIconHeaderIcon" slot="header">
              <i :class="currentIconHeaderIcon"/>
            </template>
            <template slot-scope="scope">
              <i v-if="scope.row===currentRow" :class="currentIcon"/>
              <i v-else-if="defaultIcon" :class="defaultIcon" />
            </template>
          </el-table-column>

          <el-table-column v-if="expandConfig" type="expand" key="aim-table-column-expand" width="30"
                           class-name="aim-column-fixed-width" :fixed="columnExpandFixed">
            <template slot-scope="scope">
              <column-expand :expand-config-data="expandConfigRef" :key="xidRow(scope.row)"
                             :row="scope.row"></column-expand>
            </template>
          </el-table-column>

          <el-table-column v-if="dragConfigRef.row" :fixed="columnDragFixed" align="center" width="50"
                           class-name="aim-column-fixed-width">
            <template slot-scope="{}" slot="header">
              <el-tooltip class="item" effect="light" content="拖拽以调整显示顺序" placement="top-start">
                <span>{{ dragConfigRef.header }}<i></i></span>
              </el-tooltip>
            </template>
            <template slot-scope="{}"><i class="el-icon-menu"></i></template>
          </el-table-column>

          <el-table-column v-if="rowTooltip" key="aim_table_auto_column_tooltip_icon" width="50" align="center"
                           class-name="aim-column-fixed-width" :fixed="columnTooltipFixed">
            <template v-if="rowTooltipHeaderIcon" slot="header">
              <i :class="rowTooltipHeaderIcon"/>
            </template>
            <template slot-scope="scope">
              <div style="display:none;">{{rowTooltipVal = getRowTooltip(scope.row)}}</div>
              <el-tooltip v-if="rowTooltipVal" v-bind="rowTooltipVal.tooltip">
                <template slot="content">
                  <span v-html='rowTooltipVal.content'></span>
                </template>
                <i v-bind="rowTooltipVal.icon"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-if="selection"
                           :selectable="selectionEnable"
                           :fixed="columnSelectionFixed"
                           class-name="aim-column-fixed-width"
                           key="aim_table_auto_column_selection"
                           width="50"
                           type="selection"
                           align="center"
          />
          <el-table-column v-if="radio" key="aim_table_auto_column_radio" width="50" align="center">
            <template slot-scope="scope">
              <el-checkbox :value="scope.row === radioRow"
                           @change="(val)=>{radioRowChanged(scope.row,val)}"></el-checkbox>
            </template>
          </el-table-column>
          <template v-for="(fs,fieldIndex) in schema">
            <el-table-column
                v-if="fieldShow(fs)"
                :key="fieldIndex"
                :prop="fs.field"
                :class-name="columnClass(fs)"
                :width="fs.width"
                :min-width="fs.min_width_dynamic ||fs.min_width"
                :show-overflow-tooltip="fs.showOverflowTooltip"
                :label="fs.name"
                :fixed="fs.fixed"
                :sortable="disableSort?false:pathGet(fs,'sortable',false)"
                :resizable="pathGet(fs,'resizable',true)"
                :sort-method="fs.sortMethod"
                :header-align="fs.headerAlign"
                :align="fs.align || 'left'"
                :fied-schema="fs"
                :type="fs['columnType']"

            >
              <template slot="header">
                <column-header :field-schema="fs" :name="fs['name']" :show-static-help="true"
                               :sub="fs['nameSub']"
                               :container-style-for-sub="{'margin-bottom':'16px'}">
                  <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
                    <slot :name="tipSlotName(fs)" :field-schema="fs"/>
                  </template>
                </column-header>
                <el-link
                    v-for="(link,index) in fs['headerLinkList']"
                    :key="index"
                    @click="(event)=>headerLinkClick(event,link,fs)"
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
                    <template v-if="cellName(fs,scope.row)==='CellDropdown'">
                      <cell-dropdown
                          :style="columnStyle(fs)"
                          :cells="cellConfig(fs,scope.row)"
                          :should-cell-hide="({cell,code})=>privateShouldCellHide({cell,code,row:scope.row,fieldSchema:fs})"
                          :should-cell-disable="({cell,code})=>privateShouldCellDisable({cell,code,row:scope.row,fieldSchema:fs})"
                          @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:scope.row,code,jsEvent,fieldSchema:fs})"
                      ></cell-dropdown>
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
          <el-table-column key="shortcut_row_remove" v-if="rowRemoveShortcut" width="50" align="center">
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
          :drawer="true"
          :is-show.sync="formDiffPanelShow"
          :config="{appendToBody:true,footerStyle:{position:'absolute',bottom:'3px',right:'10px'}}"
      >
        <template v-slot:aim-popup-body>
          <aim-code-diff-wrapper
              language="json"
              :diff-content-list="diffContentList"
          />
        </template>
        <template v-slot:aim-popup-footer>
          <slot name="slot-diff-panel-footer"/>
          <el-button :disabled="jsonRowInEditForm===jsonRowInEditFormBackup" type="primary" size="mini" @click="formDiffPanelSubmit">确认提交</el-button>
        </template>
      </aim-popup>
      <aim-popup
          :title="rowFormEditorTitle(rowEditState)"
          :drawer="formPopupUsingDrawer"
          :is-show.sync="rowFormEditorVisible"
          :config="{appendToBody:popupAppendToBody,close:rowFormEditorClose,footer: true,header:editConfigRef.formHeaderSlot,destroyOnClose:true}">

        <template v-slot:aim-popup-header v-if="rowInEditForm && rowFormEditorVisible">
          <slot v-if="editConfigRef.formHeaderSlot"
                :name="editConfigRef.formHeaderSlot"
                :row="rowInEditForm"
          />
        </template>
        <template v-slot:aim-popup-body>
          <aim-form-input
              v-if="rowInEditForm && rowFormEditorVisible"
              style="padding-right: 9px"
              ref="aimFormInput"
              :key="xidRow(rowInEditForm)"
              :schema="validSchema(schema)"
              :group-config="groupConfig"
              :data="rowInEditForm"
              :table-data-getter="()=>{return tableData}"
              :should-cell-disable="({row,fieldSchema,cell})=>privateShouldCellDisable({cell,row,fieldSchema})"
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
          <slot v-if="editConfigRef.formFooterSlot"
                :name="editConfigRef.formFooterSlot"
                :row="rowInEditForm"
          />
          <template v-if="formFooterEditState=== AimFormInputView">
            <el-button size="mini" type="info" @click="()=>rowFormEditorVisible=false">关闭</el-button>
          </template>
          <template v-else>
            <cell-list
                :row="rowInEditForm"
                :style="flexEndStyle"
                :shortcut-button-options="{circle:false}"
                :cells="editConfigRef.formEditorCells({row:rowInEditForm,mode:formFooterEditState})"
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

      <aim-popup :drawer="true" :is-show.sync="groupViewDrawerVisible" :config="{beforeClose:beforeTreeViewClose}">
        <template v-slot:aim-popup-body>
          <aim-tree-view
              ref="aimTreeView"
              :tree-config-query="proxyConfigRef.treeConfigQuery"
              :tree-config-save="proxyConfigRef.treeConfigSave"
              :tree-data-query="()=>{return tableData}"
              :tree-data-row-save="tryProxySaveRow"
              :default-app-data="FillDefaultDataWithSchema(schema)"
              :svg-icon="!!proxyConfigRef['groupSvgIcon']"
              :group-by="proxyConfigRef.groupBy || ['pid','pid2']">
            <template v-slot:app="{app,isEdit}">
              <aim-form-input
                  style="padding-right: 9px"
                  ref="aimFormInputInTreeView"
                  :schema="validSchema(schema)"
                  :group-config="groupConfig"
                  :data="app"
                  :table-data-getter="()=>{return tableData}"
                  :should-cell-disable="({row,fieldSchema,cell})=>privateShouldCellDisable({cell,row,fieldSchema})"
                  :alert-info="rowEditorAlert"
                  :mode="isEdit?AimFormInputEdit:AimFormInputInsert"
                  :rules="FormRulesFromSchema(schema,{row:app,data:tableData})"
                  :row-top="app"
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
            <template v-slot:action="{app,isEdit}">
              <cell-list
                  :row="app"
                  :style="flexEndStyle"
                  :shortcut-button-options="{circle:false}"
                  :cells="editConfigRef.formEditorCells({row:app,mode:isEdit?AimFormInputEdit:AimFormInputInsert})"
                  :should-cell-hide="privateShouldCellHide"
                  :should-cell-disable="privateShouldCellDisable"
                  @code-cell-click="({code,jsEvent})=>privateCellClickForRow({row:app,code,jsEvent,fromForm:true})">
                <template v-for="item in editConfigRef.formEditorCells" v-slot:[getProxySlotName(item.cell)]="{}">
                  <slot v-if="item.cell" :name="item.cell" :item="item"></slot>
                </template>
              </cell-list>
            </template>
          </aim-tree-view>
        </template>
      </aim-popup>
    </aim-full-screen-dialog>
  </div>
</template>

<script>
import {
  aimTableError,
  aimTableLog,
  aimTableWarn,
  copyRow,
  CtrlDataInRowData,
  EditModeInplace,
  EditTriggerManual,
  EventCurrentRowChange,
  isModeInplace,
  isRowSelected,
  mustCtrlData,
  removeCtrlData,
  rowFormEditorTitle,
  setRowSelected,
  xidRow
} from "@/components/AimTable/table";
import {filterVirtualField,} from "@/components/AimTable/virtual_field";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {
  CodeButtonAdd,
  CodeButtonDebug,
  CodeButtonExpandAll,
  CodeButtonExportToExcel,
  CodeButtonFilterSearch, CodeButtonFullscreen,
  CodeButtonRefresh,
  CodeButtonRowClose,
  CodeButtonRowCopy,
  CodeButtonRowDelete,
  CodeButtonRowEdit,
  CodeButtonRowMinus,
  CodeButtonRowSave,
  CodeButtonRowSelectedClose,
  CodeButtonRowSelectedDelete,
  CodeButtonRowSelectedMinus, CodeButtonRowView,
  CodeButtonSaveTableData,
  CodeButtonSortIndex, CodeButtonTableGroupView,
  CodeButtonTableSetting,
  CodeLinkFieldCopy,
  CodeLinkFilterSearch,
  CodeLinkFilterSearchClose, DisableStateFollowReadOnly
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
  cellNameForTable,
  cellShowWhenLostForTable,
  formatterFunction
} from "@/components/AimTable/cell";
import {
  allSlotName,
  commentSlotName,
  formSlotName,
  getProxyCommentSlotName,
  getProxyCommentSlotNameWithName,
  getProxyFormSlotName,
  getProxySlotName,
  getProxyTipSlotName,
  tipSlotName
} from "@/components/AimTable/slot";
import AimFormInput from "@/components/AimFormInput/index.vue";
import {flexEndStyle} from "@/components/AimTable/style";
import MixinSort from "@/components/AimTable/mixins/MixinSort.vue";
import {AimFormInputCopy, AimFormInputEdit, AimFormInputInsert, AimFormInputView} from "@/components/AimFormInput";
import {flexColumnWidth} from "@/components/AimTable/AutoWidth";
import AimPopup from "@/components/AimPopup/index.vue";
import ColumnShortcuts from "@/components/AimTable/Column/ColumnShortcuts.vue";
import MixinFilter from "@/components/AimTable/mixins/MixinFilter.vue";
import AimTableSetting from "@/components/AimTable/AimTableSetting/index.vue";
import {exportTable2Excel} from "@/components/AimTable/export/excel";
import Cookies from "js-cookie";
import row from "element-ui/packages/row";
import CellDropdown from "@/components/cells/CellDropdown.vue";
import AimTreeView from "@/components/AimTreeView/index.vue";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";
import AimFullScreenDialog from "@/components/AimFullScreenDialog/index.vue";
import AimCodeDiffWrapper from "@/components/AimCodeDiffWrapper/index.vue";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: "AimTable",
  watch:{
    'treeProps.enable'(newVal,oldVal) {
      if(oldVal === newVal){
        return
      }
      if(jsb.pathGet(this.treeProps,'transfer')){
        this.inLoading = true
        let currentData = this.tableData
        this.tableData = []
        if(newVal){
          jsb.each(currentData,v=>{
            v[CtrlDataInRowData].xid = jsb.xid()
          })
          currentData= jsb.arrayToTree(currentData,this.treeProps)
        }else{
          currentData= jsb.treeToArray(currentData,this.treeProps)
          jsb.each(currentData,v=>{
            v[CtrlDataInRowData].xid = jsb.xid()
            delete v[this.treeProps.children]
          })
        }
        this.tableData = currentData
        this.inLoading = false
        this.$nextTick(() => {
          this.$emit("aim-event-tree-view-switch",{tree:newVal})
        })
        this.doLayoutNextTick(true)
      }
    }
  },
  computed: {
    diffContentList(){
      return [
        {
          old:this.jsonRowInEditFormBackup,
          new:this.jsonRowInEditForm,
        }
      ]
    },
    jsonRowInEditFormBackup(){
      if(!this.rowInEditFormBackup){
        return ""
      }
      if(!this.diffBeforeUpdate){
        return ""
      }
      return JSON.stringify(removeCtrlData(jsb.clone(this.rowInEditFormBackup)),null, 2)
    },
    jsonRowInEditForm(){
      if(!this.rowInEditForm){
        return ""
      }
      if(!this.diffBeforeUpdate){
        return ""
      }
      return JSON.stringify(removeCtrlData(jsb.clone(this.rowInEditForm)),null, 2)
    },
    row() {
      return row
    },
    tableClass(){
      const ret = this.tablePropertyRef.class
      if(jsb.pathGet(this.treeProps,'enable',false)) {
        const treeClass = jsb.pathGet(this.treeProps,'class',['aim-table-tree','aim-table-tree-line'])
        jsb.each(jsb.wrapArray(treeClass),classNow=>{
          if(!jsb.find(this.tablePropertyRef.class,v=>v===classNow)){
            ret.push(classNow)
          }
        })
      }
      return ret
    },
    cellName() {
      return (fs, row) => {
        return cellNameForTable(fs, row, isModeInplace(this.editConfigRef.mode))
      }
    },
    cellConfig() {
      return (fs, row) => {
        const ret = cellConfigForTable(fs, row)
        const _this = this
        if(this.editConfigRef.autoSaveInPlaceRow && isModeInplace(this.editConfigRef.mode)){
          fs.__tableCallbackOnChange = function ({row}){
            _this.tryProxySaveRow(row)
          }
        }
        return ret
      }
    },
    allCommentSlotName() {
      return allSlotName(this.schema, 'commentSlot')
    },
    formFooterEditState(){
      return this.rowEditState
    },
    tableHeight() {
      // 强制触发tableHeight更新
      let tableHeightRefreshKey = this.tableHeightRefreshKey
      if (tableHeightRefreshKey){
        tableHeightRefreshKey =  this.tableHeightRefreshKey
      }
      // 第一次由cookie获取
      if(tableHeightRefreshKey === 0 && this.tablePropertyRef.heightCookieKey){
        const initHeightStr = Cookies.get(this.tablePropertyRef.heightCookieKey)
        if (initHeightStr) {
          return `${initHeightStr}px`
        }
      }
      if (!this.tablePropertyRef.heightSubVH) {
        // null或者0根据内容自适应高度
        if (jsb.isNull(this.tablePropertyRef.height) || parseInt(this.tablePropertyRef.height) === 0) {
          return null
        }
        if (!jsb.isEmpty(this.tablePropertyRef.height)) {
          if(this.tablePropertyRef.heightCookieKey){
            Cookies.set(this.tablePropertyRef.heightCookieKey,`${this.tablePropertyRef.height}`)
          }
          return this.tablePropertyRef.height
        }
      }
      let sub = 70 + this.tablePropertyRef.heightSubVH
      sub += this.headerConfigRef.enable ? 40 : 0
      sub += this.pagerConfigRef.enable ? 40 : 0
      const finallyHeight = jsb.clientHeight(sub)
      if(this.tablePropertyRef.heightCookieKey){
        Cookies.set(this.tablePropertyRef.heightCookieKey,`${finallyHeight}`)
      }
      return `${finallyHeight}px`
    },
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
    AimCodeDiffWrapper,
    AimFullScreenDialog,
    CellDropdown,
    AimTreeView,
    AimTableSetting,
    ColumnShortcuts,
    AimPopup,
    AimFormInput,
    CellList,
    ColumnExpand, ColumnHeader,
    Loading
  },
  props: {
    cellClassName:[String, Function],
    submitRemoveFieldNotInSchema: Boolean,
    onEventDoLayout: {
      type: String,
      default: 'aim_table_layout'
    },
    columnDragFixed:String,
    diffBeforeUpdate:Boolean,
    selection: Boolean,// 是否支持选择
    columnSelectionFixed:{
      type:String,
      default:"left"
    },
    // eslint-disable-next-line no-unused-vars
    selectionEnable: {
      type: Function, default: () => {
        return true
      },
    },
    defaultExpandAll:Boolean,
    treeProps:{
      type:Object,
      default:()=>{
        return {children: 'children',enable:false}
      }
    },
    rowDbClick:Function,
    rowClick:Function,
    rowRemoveShortcut: {type: Boolean, default: false},// 是否显示当行删除快捷方式
    autoQuery: {type: Boolean, default: true},
    radio: Boolean,// 是否支持radio选择
    columnRadioFixed:{
      type:String,
      default:"left"
    },
    currentIcon:String,
    defaultIcon:String,
    columnExpandFixed:{
      type:String,
      default:"left"
    },
    columnCurrentFixed:{
      type:String,
      default:"left"
    },
    currentIconHeaderIcon:String,
    rowTooltipHeaderIcon:String,
    rowTooltip:Function,
    columnTooltipFixed:{
      type:String,
      default:"left"
    },
    radioSyncCurrent: Boolean,
    selectionSyncCurrent: Boolean,
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
    },
    disableSort:Boolean,
  },
  data() {
    return {
      AimFormInputEdit:AimFormInputEdit,
      AimFormInputInsert:AimFormInputInsert,
      CtrlDataInRowData:CtrlDataInRowData,
      AimFormInputView,
      flexEndStyle,
      radioRow: null,
      visitSettingDrawerVisible: false,
      groupViewDrawerVisible: false,
      tableSetting:{},
      tableHeightRefreshKey: 0,
      configContent:'[]',
      formDiffPanelShow:false,
      formDiffPanelSubmit:null,
      sortIndexChangedRows:[],
      xid2SortIndexOriginal:{}
    }
  },

  beforeDestroy() {
    if (this.onEventDoLayout && jsb.cc.emitter) {
      jsb.cc.emitter.off(this.onEventDoLayout, this.doLayoutNextTick)
    }
  },
  created() {
    this.afterQueryData = ()=>{
      if(this.$refs.aimTreeView){
        this.$refs.aimTreeView.fetchData()
      }
      this.sortIndexChangedRows = []
      this.xid2SortIndexOriginal = this.sortIndexMap()
    }
    if (this.onEventDoLayout && jsb.cc.emitter) {
      jsb.cc.emitter.on(this.onEventDoLayout, this.doLayoutNextTick)
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
      dragCallback = () => {
        this.sortIndexChangedRows = []
        jsb.each(this.tableData, (v, index) => {
          const newIndex = index+1
          if(newIndex !==this.xid2SortIndexOriginal[xidRow(v)]){
            this.sortIndexChangedRows.push(v)
          }
          v[this.sortConfigRef.sortIdxField] = newIndex
        })
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
    removeCtrlData,
    sortIndexMap(){
      const vList = {}
      if (this.sortConfigRef.sortIdxField) {
        jsb.each(this.tableData,v=>{
          vList[xidRow(v)] = v[this.sortConfigRef.sortIdxField]
        })
      }
      return vList
    },
    saveSortIndexChangedRows(){
      return this.trySaveRows(this.sortIndexChangedRows,{okQuery:true})
    },
    FillDefaultDataWithSchema,
    // updateFormMode 外部使用更新编辑状态，如对接redsource lock
    updateFormMode(mode) {
      this.rowEditState = mode
    },
    forceFreshTableHeight({height,heightSubVH}={}) {
      if(height){
        this.tablePropertyRef.height = height
      }
      if(heightSubVH){
        this.tablePropertyRef.heightSubVH = heightSubVH
      }
      this.tableHeightRefreshKey++
    },
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
      this.doLayoutNextTick(true)
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
    columnStyle(fs){
      const defaultStyle = { 'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}
      // 对于树形显示，第一个列需要加入树图标支持，需要换算未 inline-block
      if(this.treeProps &&  this.treeProps.enable) {
        const _this = this
        let firstShow = jsb.find(this.schema,v=>{
          return v.fixed === "left" && _this.fieldShow(v)
        })
        if(!firstShow){
          firstShow = jsb.find(this.schema,v=>{
            return _this.fieldShow(v)
          })
        }
        if(firstShow.field === fs.field){
          defaultStyle.display = 'inline-block'
        }
      }
      const fieldColumnStyle = jsb.pathGet(fs,'columnStyle',{})
      if(fs.align === 'center'){
        defaultStyle['justify-content'] = 'center'
      }
      if(fs.align === 'left' || fs.align === 'start'){
        defaultStyle['justify-content'] = 'flex-start'
      }
      if(fs.align === 'right' || fs.align === 'end'){
        defaultStyle['justify-content'] = 'flex-end'
      }
      // 设定了 max_width 且开启了 autoWidth
      if(fs['whiteSpace'] || (this.tablePropertyRef.autoWidth && (fs.max_width && fs.width === fs.max_width || fs['width_fit']))) {
        defaultStyle['white-space'] = fs['whiteSpace'] || 'pre-wrap'
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
    doLayoutNextTick(forceFreshAutoWidth = false) {
      const _this = this
      _this.$nextTick(() => {
        _this.doLayout(forceFreshAutoWidth)
        setTimeout(function () {
          _this.doLayout(forceFreshAutoWidth)
        }, 50)
      })
    },
    setDebugMessage(title, msg = '') {
      aimTableLog(title, msg)
    },
    getRowTooltip(row){
      if(!this.rowTooltip){
        return null
      }
      let ret = this.rowTooltip(row)
      if(!ret){
        return null
      }
      if(jsb.isString(ret)){
        ret = {content:ret}
      }
      if(jsb.isString(ret.content)){
        ret.tooltip = {content:ret.content,placement:'top-start',effect:'light'}
      }
      ret.icon = ret.icon || {class:'el-icon-info'}
      return ret
    },
    fieldShow(fs) {
      const show = jsb.pathGet(fs, 'show', true)
      if (jsb.isFunction(show)) {
        return show()
      }
      return show
    },
    pathGet(data, fieldPath, defaultVal = undefined) {
      return jsb.pathGet(data, fieldPath, defaultVal)
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
    radioRowChanged(row,checked=true) {
      this.radioRow = null
      jsb.each(this.tableData,v=>{
        setRowSelected(v,false)
      })
      this.radioRow = checked?row:null
      if(this.radioRow){
        setRowSelected(row,checked)
        this.debug && this.setDebugMessage(`rowSelectionChanged row ${this.summaryRow(row)}`,isRowSelected(row),)
      }
      if(this.onRadioChange){
        this.onRadioChange({row:this.radioRow})
      }
    },
    // current-change 回调
    currentChange(row) {
      // this.debug && this.setDebugMessage(`currentChange row ${this.summaryRow(row)}`)
      if(this.currentRow === row){
        return
      }
      this.currentRow = row;
      this.$emit(EventCurrentRowChange, {row})
      if(this.onCurrentChange){
        this.onCurrentChange({row})
      }
      if(this.radioSyncCurrent) {
        this.radioRowChanged(row,true)
      }
      if(this.selectionSyncCurrent) {
        this.$refs.table.toggleRowSelection(row,!isRowSelected(row))
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
      const editDone = ({error}={}) => {
        if (!error && fromForm) {
          this.formDiffPanelShow = false
          this.rowFormEditorVisible = false
          // form表单编辑完后重新拉取数据
          // save操作为async模式，不主动刷新数据
          if(!this.proxyConfigRef.saveAsync){
            this.proxyQueryData()
          }
        }
      }
      switch (code) {
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
        case CodeButtonExportToExcel:
          this.export2Excel()
          break;
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
        case CodeButtonRowView:
          this.rowClickWithTriggerName(row, EditTriggerManual,AimFormInputView)
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
        case CodeButtonTableGroupView:
          this.groupViewDrawerVisible = true
          break
        case CodeButtonExpandAll:
          this.expandAll(this.tableData, this.$refs.table)
          break
        case CodeButtonRowSave:
          if (fromForm) {
            let form = this.$refs.aimFormInput
            if(!form){
              form = this.$refs.aimFormInputInTreeView
            }
            form.__validateFromAimTable(() => {
              // 如果要求打开diff，则有限展现diff页面
              if(this.diffBeforeUpdate && this.rowEditState === AimFormInputEdit){
                this.formDiffPanelSubmit = ()=>{
                  this.tryProxySaveRow(row, {done: editDone,old:this.rowInEditFormBackup})
                }
                this.formDiffPanelShow = true
              }else{
                this.tryProxySaveRow(row, {done: editDone,old:this.rowInEditFormBackup})
              }
            })
          } else {
            //fixme inplace 下无法使用form的validate
            this.tryProxySaveRow(row, {done: editDone,old:this.rowInEditFormBackup})
          }
          break
        case CodeButtonFullscreen:
          this.$refs.fullscreen.switch()
          this.doLayoutNextTick()
          break
        default:
          this.toastWarning(`code ${code} no handler`)
      }
    },
    addRow({initRow, isCopy,editor} = {}) {
      initRow = initRow || {}
      isCopy = jsb.isUndefined(isCopy)?false:isCopy
      editor = editor || true
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

      if(editor){
        if (this.isModeInplace()) {
          // inplace编辑模式
          this.tableData.push(newRow)
        } else {
          // form 表单编辑逻辑
          this.showFormEditorForRow(newRow)
        }
      }else{
        this.tableData.push(newRow)
      }
    },
    rowFormEditorClose() {
      // this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
    export2Excel() {
      exportTable2Excel(this.schema,this.tableData)
    },
    privateShouldCellDisable({code, cell, row, fieldSchema}) {
      if (this.readOnly && DisableStateFollowReadOnly.includes(code)) {
        // 按钮的禁用需要根据code区分，暂时全部屏蔽
        return true
      }
      code = code || jsb.pathGet(cell, 'code')
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
    headerLinkClick(event,link,fs){
      event.stopPropagation();
      if(jsb.isString(link.click)){
        if(link.click.toUpperCase() === 'CASE_SWITCH') {
          const firstKey = String(jsb.pathGet(this.tableData, `0.${fs.field}`, ""))
          const isUpper = firstKey === firstKey.toUpperCase()
          jsb.each(this.tableData, v => {
            if(v[fs.field]){
              v[fs.field] = isUpper ? String(v[fs.field]).toLowerCase() : String(v[fs.field]).toUpperCase()
            }
          })
          return
        }
        if(link.click.toUpperCase() === 'TYPE_SWITCH') {
          const oldType = fs.type
          fs.type = jsb.find(jsb.pathGet(link, 'types', [fs.type]), v => v !== fs.type)
          if(!fs.type){
            fs.type = oldType
          }
          // 变化后设定 cookie
          const typeCookieKey = jsb.pathGet(link,'typeCookieKey')
          if(typeCookieKey) {
            Cookies.set(typeCookieKey,fs.type)
          }
          // 变化后通知逻辑层
          const onTypeChange = jsb.pathGet(link,'onTypeChange')
          if (onTypeChange){
            onTypeChange(fs.type)
          }
          // 刷新类型后占用的高度可能发生变化
          this.doLayoutNextTick(true)
          return
        }
        this.toastWarning(`click code ${link.click} not supported`)
        return
      }
      link.click({tableData:this.tableData,event:event})
    },
    doLayout(forceFreshAutoWidth = false) {
      if (this.tablePropertyRef.autoWidth) {
        flexColumnWidth(this.schema, this.tableData || [],forceFreshAutoWidth)
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
    // 处理单选
    handleSelect(selection, row) {
      // 子节点
      if (row[this.treeProps.children]) {
        let isSelected = this.$refs.table.store.states.selection.some(item => xidRow(item) ===xidRow(row))
        this.changeSelectStatus([row], isSelected)
      }

      // 寻找父节点,找不到时返回的是一个空 {}
      let parentRow= this.tableData.reduce((p, c) => {
        if (c[this.treeProps.children] && c[this.treeProps.children].some(item => xidRow(item) ===xidRow(row))) {
          p = c
        }
        return p
      }, {})
      if(!jsb.isEmpty(parentRow)){
        // 是否每一个都处于选中状态
        let bool = parentRow[this.treeProps.children].every(item => selection.some(s => xidRow(s) === xidRow(item)))
        this.$refs.table.toggleRowSelection(parentRow, bool)
      }
    },
    handleSelectAll() {
      this.changeSelectStatus(this.tableData, this.$refs.table.store.states.isAllSelected)
    },
    changeSelectStatus(data, selected) {
      data.forEach(row => {
        this.$refs.table.toggleRowSelection(row, selected)
        if (row.children) {
          this.changeSelectStatus(row.children, selected)
        }
      })
    },
    beforeTreeViewClose(done){
      if(!this.$refs.aimTreeView.changed()){
        done()
        return
      }
      jsb.cc.confirm(this,{
        message:'分组视图有变更未保存',
        confirmButtonText:'继续编辑',
        cancelButtonText:'丢弃变更',
        doneFunc:()=>{
        },
        cancelFunc:()=>{
          done()
        },
      })
    },
    headerCellClassName({column}) {
      let result = this.sortConfigRef.orders.find(e => e.field === column.property)
      if(result) {
        column.order = result.order
      }
    },
    handleSortChange({ order,prop }) {
      let co = this.sortConfigRef.orders.find(e => e.field === prop)
      if(!co){
        co = {field: prop,order:''}
        if(this.sortConfigRef.multi){
          this.sortConfigRef.orders.push(co)
        }else{
          this.sortConfigRef.orders=[co]
        }
      }
      if(!order || co.order === order){
        co.order = ''
      }else{
        co.order = order
      }
      this.handleOrderChange()
    },
    handleOrderChange () {
      // 当前实现中激活了分页模式一定是接口层分页
      if(this.sortConfigRef.remote){
        this.fresh()
      }else{
        // 本地排序
        this.tableData = this.sortTableData(this.tableData)
      }
    }
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

.el-table .aim-success-row {
  background:#dcf5e7;
}
.el-table .aim-running-row {
  background:#fff1de;
}
.el-table .aim-warning-row {
  background:#fff1de;
}

.el-table .aim-danger-row {
  background:#fbe5e1;
}

</style>

<style lang="scss" scoped>
::v-deep .aim-table-tree  {
  .el-icon-arrow-right:before {
    content: "+";
    color: #1890ff;
    font-size: 20px;
    font-weight: 700
  }
  .el-table__row:not([class*="el-table__row--level-"]) { td:first-child { padding-left: 24px !important; } }
  .el-table__expand-icon .el-icon-arrow-right:before {
    content: "+";
  }
  [class*="el-table__row--level"] .el-table__expand-icon {
    transform: rotate(0);
  }
  .el-table__expand-icon--expanded .el-icon-arrow-right:before {
    content: "-";
  }
  .el-table__placeholder::before {
    margin-left: 20px;
  }
}
::v-deep .aim-table-tree-line  {
  .el-table__row:is([class*="el-table__row--level-1"]) {
    td:first-child {
      background:
          //repeating-linear-gradient( 90deg, #999 0 1px,transparent 0px 2px) 20px 50%/15px 1px no-repeat
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 20px 0px/1px 100% no-repeat !important;
    }
  }
  .el-table__row:is([class*="el-table__row--level-2"]) {
    td:first-child {
      background:
          //repeating-linear-gradient( 90deg, #999 0 1px,transparent 0px 2px) 40px 50%/15px 1px no-repeat
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 20px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 37px 0px/1px 100% no-repeat  !important;
    }
  }
  .el-table__row:is([class*="el-table__row--level-3"]) {
    td:first-child {
      background:
          //repeating-linear-gradient( 90deg, #999 0 1px,transparent 0px 2px) 60px 50%/15px 1px no-repeat
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 20px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 37px 0px/1px 100% no-repeat ,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 53px 0px/1px 100% no-repeat  !important;
    }
  }
  .el-table__row:is([class*="el-table__row--level-4"]) {
    td:first-child {
      background:
          //repeating-linear-gradient( 90deg, #999 0 1px,transparent 0px 2px) 80px 50%/15px 1px no-repeat
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 20px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 37px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 53px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 68px 0px/1px 100% no-repeat  !important;;
    }
  }
  .el-table__row:is([class*="el-table__row--level-5"]) {
    td:first-child {
      background:
          //repeating-linear-gradient( 90deg, #999 0 1px,transparent 0px 2px) 80px 50%/15px 1px no-repeat
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 20px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 37px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 53px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 68px 0px/1px 100% no-repeat,
          repeating-linear-gradient( #999 0 1px,transparent 0px 2px) 83px 0px/1px 100% no-repeat  !important;;
    }
  }
}
</style>