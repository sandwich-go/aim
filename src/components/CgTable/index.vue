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
      <column-slots
          v-for="direction of ['left','right']"
          :key="direction"
          :span="toolbarSpan(toolbarConfigData,direction)"
          :style="toolbarConfigData[direction+'ColumnStyle']"
          :items="toolbarConfigData[direction+'Items']"
          :target="thisTarget()"
          :should-toolbar-item-hide="privateShouldToolbarItemHide"
          :should-toolbar-item-disable="privateShouldToolbarItemDisable"
          @code-button-click="privateCodeItemClickForToolbar"
      >
        <template v-for="item in toolbarConfigData[direction+'Items']" v-slot:[getProxySlotName(item.slot)]="{}">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
        </template>
      </column-slots>
    </el-row>

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
      <template v-for="(fieldSchema,fieldIndex) in schema">
        <el-table-column
            :key="fieldIndex"
            :prop="fieldSchema.field"
            :width="fieldSchema.width"
            :min-width="fieldSchema.min_width"
            :max-width="fieldSchema.max_width"
            :show-overflow-tooltip="fieldSchema.showOverflowTooltip"
            :label="fieldSchema.name"
            :align="fieldSchema.align || 'left'">
          <template slot-scope="scope">
            <template v-if="fieldSchema.slot">
              <column-slots
                  v-if="fieldSchema.slot==='ColumnSlots'"
                  :style="{'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'}"
                  :items="fieldValueVirtual(scope.row,fieldSchema)"
                  :should-toolbar-item-hide="privateShouldToolbarItemHide"
                  :should-toolbar-item-disable="privateShouldToolbarItemDisable"
                  @code-button-click="privateCodeItemClickForRow"
              ></column-slots>
              <template v-if="registeredComponentMap[fieldSchema.slot]">
                <component
                    :is="registeredComponentMap[fieldSchema.slot]"
                    :data="scope.row"
                    :options="fieldSchema.options || []"
                    :field-name="fieldSchema.field"
                    :cell-config="filedViewConfig({row:scope.row,fieldSchema:fieldSchema,fieldValue:scope.row[fieldSchema.field]})"
                    @code-button-click="privateCodeItemClickForRow"
                ></component>
              </template>
              <template v-else>
                <slot :name="fieldSchema.slot"
                      :row="scope.row"
                      :fieldSchema="fieldSchema"
                      :fieldValue="scope.row[fieldSchema.field]"
                      :fieldValueVirtual="fieldValueVirtual(scope.row,fieldSchema)"
                      @code-button-click="privateCodeItemClickForRow"
                ></slot>
              </template>
            </template>
            <span v-else>
                {{ fieldValueVirtual(scope.row, fieldSchema) }}
              </span>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-row :style="footerConfigData.style">
      <column-slots
          v-for="direction of ['left','right']"
          :key="direction"
          :span="toolbarSpan(footerConfigData,direction)"
          :style="footerConfigData[direction+'ColumnStyle']"
          :items="footerConfigData[direction+'Items']"
          :target="thisTarget()"
          :should-toolbar-item-hide="privateShouldToolbarItemHide"
          :should-toolbar-item-disable="privateShouldToolbarItemDisable"
          @code-button-click="privateCodeItemClickForToolbar"
      >
        <template v-for="item in footerConfigData[direction+'Items']" v-slot:[getProxySlotName(item.slot)]="{}">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
        </template>
      </column-slots>
    </el-row>

    <el-dialog modal width="80%"
               @close="rowFormEditorClose"
               :visible.sync="rowFormEditorVisible">
      <cg-form-input
          v-if="currentRow && rowFormEditorVisible"
          :key="xidRow(currentRow)"
          :schema="schema"
          :data="currentRow"
          :should-field-disable="shouldFieldDisable"
          :alert-info="rowFormEditorAlert"
          :mode="rowFormEditorMode"
          :row-top="currentRow"
      ></cg-form-input>
    </el-dialog>
  </div>
</template>

<script>
import {
  cleanData,
  EditTriggerClick,
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitchButton,
  EditTriggerSwitchButton,
  EventCurrentRowChange,
  fieldValueVirtual,
  filedViewConfig,
  fixToolbarItems,
  getProxySlotName,
  RowEditorInplace,
  ToolbarShortcutCodeAdd,
  ToolbarShortcutCodeCopyField,
  ToolbarShortcutCodeRefresh,
  xidRow
} from "@/components/CgTable/table";
import MixinCgPager from "@/components/mixins/MixinCgPager.vue";
import {NewDefaultProxyConfigData, NewDefaultTableProperty, NewEitConfigData,} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import ColumnSlots from "@/components/types/ColumnSlots.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import {CgFormInputModeEdit, CgFormInputModeView} from "@/components/CgFormInput/index";
import CgFormInput from "@/components/CgFormInput/index.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  mixins: [MixinCgPager, MixinComponentMap],
  components: {CgFormInput, ColumnSlots, Loading},
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
    editConfig: Object,
    readOnly: Boolean,
    toastError: function ({error}) {
      alert(error)
    },
    proxyConfig: Object,
    pagerConfig: Object,
    toolbarConfig: Object,
    footerConfig: Object,
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
      inLoading: false,
      debugMessage: '',
      tableData: [],
      radioRow: null,
      // 当前选中的行
      currentRow: null,
      rowFormEditorReadonly: false,
      rowFormEditorVisible: false,
      rowFormEditorAlert: null,
      rowFormEditorMode: CgFormInputModeView,

      proxyConfigData: NewDefaultProxyConfigData(),
      tablePropertyData: NewDefaultTableProperty(),
      editConfigData: NewEitConfigData(),
      pagerConfigData: {
        enable: true,
        pagerConfig: {
          layout: `->,total, prev, pager, next, sizes`,
          background: true,
          totalFiled: 'PagerTotal',
          currentPageField: 'PagerAutoGenPage',
          pageSizeField: 'PagerAutoGenSize',
        }
      },
      toolbarConfigData: {
        enable: true,
        style: {'padding-bottom': '9px'},
        leftSpan: 19,
        leftItems: [],
        leftColumnStyle: {'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'},
        rightSpan: 0,
        rightItems: [],
        rightColumnStyle: {'justify-content': 'flex-end', 'display': 'flex', 'align-items': 'center', 'gap': '3px'},
      },
      footerConfigData: {
        style: {'padding-top': '9px'},
        leftSpan: 19,
        leftItems: [],
        leftColumnStyle: {'justify-content': 'flex-start', 'display': 'flex', 'align-items': 'center', 'gap': '3px'},
        rightSpan: 0,
        rightItems: [],
        rightColumnStyle: {'justify-content': 'flex-end', 'display': 'flex', 'align-items': 'center', 'gap': '3px'},
      }
    }
  },
  created() {
    this.editConfigData = Object.assign(this.editConfigData, this.editConfig)
    this.tablePropertyData = Object.assign(this.tablePropertyData, this.tableProperty)
    this.proxyConfigData = Object.assign(this.proxyConfigData, this.proxyConfig)

    this.initPager()
    this.initHeader()
    this.initFooter()

    cleanData(this.tableData, this.schema, this.proxyConfigData.item2Row)
    this.tryProxyQueryData()

    // fixme ide问题，错误标注getProxySlotName未被使用
    this.getProxySlotName()
  },
  methods: {
    filedViewConfig,
    xidRow,
    fieldValueVirtual,
    getProxySlotName,
    setDebugMessage(msg) {
      this.debugMessage = msg
    },
    initHeader() {
      this.toolbarConfigData = fixToolbarItems(Object.assign(this.toolbarConfigData, this.toolbarConfig))
    },
    initFooter() {
      const _this = this
      this.footerConfigData = fixToolbarItems(Object.assign(this.footerConfigData, this.footerConfig))
      let pagerFound = false
      if (this.pagerConfigData.enable) {
        jsb.each(['leftItems', 'rightItems'], function (val) {
          jsb.each(_this.footerConfigData[val], function (codeOrItem) {
            if (codeOrItem.slot === 'CgPager') {
              pagerFound = true
              codeOrItem.dataWrapper = _this.thisTarget()
            }
          })
        })
        if (!pagerFound) {
          this.footerConfigData.rightItems.push({slot: 'CgPager', dataWrapper: _this.thisTarget()})
        }
      }
    },
    initPager() {
      this.pagerConfigData = Object.assign(this.pagerConfigData, this.pagerConfig)
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
        return configData.leftItems.length === 0 ? 0 : configData.leftSpan
      }
      return configData.leftItems.length === 0 ? 24 : (configData.rightSpan || 24 - configData.leftSpan)
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
      this.debug && this.setDebugMessage(`currentChange row ${this.summaryRow(row)}`)
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
      return this.editConfigData.trigger === EditTriggerDBLClickOrSwitchButton && (triggerName === EditTriggerSwitchButton || triggerName === EditTriggerDBLClick);
    },
    rowClickWithTriggerName(row, triggerName) {
      this.currentChange(row)
      if (!this.isEditTriggerAccepted(triggerName)) {
        return;
      }
      const triggerRet = this.editConfigData.triggerRowFunc({row: row})

      this.rowFormEditorMode = CgFormInputModeEdit
      this.rowFormEditorAlert = null

      if (jsb.isString(triggerRet)) {
        // 如果只是返回字符串则：view状态，显示alert信息
        this.rowFormEditorMode = CgFormInputModeView
        this.rowFormEditorAlert = triggerRet
      } else if (jsb.isObjectOrMap(triggerRet)) {
        // 如果返回的是一个object，索引其中的:active与alert字段
        // active默认为true, 如为true则进入edit状态
        // 可根据需求定制返回alert的样式
        if (jsb.pathGet(triggerRet, 'active', true)) {
          this.rowFormEditorMode = CgFormInputModeEdit
        }
        this.rowFormEditorAlert = jsb.pathGet(triggerRet, 'alert')
      } else if (!triggerRet) {
        // 不允许编辑
        return;
      }
      this.setEditRow(row)
    },
    // eslint-disable-next-line no-unused-vars
    privateCodeItemClickForRow({code, row, fieldSchema, fieldValue, jsEvent}) {
      this.privateCodeItemClick({code, row, fieldSchema, fieldValue, jsEvent})
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
      this.defaultCodeItemClick({code, fieldValue, jsEvent})
    },
    // 默认的code处理逻辑
    defaultCodeItemClick({code, fieldValue, jsEvent}) {
      switch (code) {
        case ToolbarShortcutCodeRefresh:
          this.tryProxyQueryData()
          break
        case ToolbarShortcutCodeCopyField:
          jsb.clipCopy(fieldValue, jsEvent)
          break
        case ToolbarShortcutCodeAdd:
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
    // 设定当前编辑的行
    setEditRow(row) {
      this.debug && this.setDebugMessage(`setEditRow row  ${this.summaryRow(row)}`)
      this.currentRow = row
      if (this.editConfigData.rowEditor === RowEditorInplace) {
        this.toastError(`editor mode ${RowEditorInplace} not support yet`)
        return
      }
      this.rowFormEditorVisible = true
    },
    addRow() {
      if (jsb.eqNull(this.tableData)) {
        this.tableData = []
      }
      this.editConfigData.addRow()
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
    rowFormEditorClose(){
      this.debug && (this.debugMessage = `rowFormEditorClose : ${this.summaryRow(this.currentRow)}`)
    },
  }
}
</script>

<style>
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