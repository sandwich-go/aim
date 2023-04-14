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
          @code-button-click="privateCodeItemClick"
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
    >
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
                  :target="thisTarget()"
                  :should-toolbar-item-hide="privateShouldToolbarItemHide"
                  :should-toolbar-item-disable="privateShouldToolbarItemDisable"
                  @code-button-click="privateCodeItemClick"
              ></column-slots>
              <template v-if="registeredComponentMap[fieldSchema.slot]">
                <component
                    :is="registeredComponentMap[fieldSchema.slot]"
                    :row="scope.row"
                    :fieldSchema="fieldSchema"
                    :fieldValue="scope.row[fieldSchema.field]"
                    :fieldValueVirtual="fieldValueVirtual(scope.row,fieldSchema)"
                ></component>
              </template>
              <template v-else>
                <slot :name="fieldSchema.slot"
                      :row="scope.row"
                      :fieldSchema="fieldSchema"
                      :fieldValue="scope.row[fieldSchema.field]"
                      :fieldValueVirtual="fieldValueVirtual(scope.row,fieldSchema)"
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
          @code-button-click="privateCodeItemClick"
      >
        <template v-for="item in footerConfigData[direction+'Items']" v-slot:[getProxySlotName(item.slot)]="{}">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
        </template>
      </column-slots>
    </el-row>

    <el-dialog modal width="80%" :visible.sync="rowFormEditorVisible">
      <cg-form-input
          :schema="schema"
          :data="currentRow"
          :should-field-disable="shouldFieldDisable"
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
  fixToolbarItems,
  getProxySlotName,
  RowEditorForUpdate,
  RowEditorForView,
  RowEditorInplace,
  ToolbarShortcutCodeAdd,
  ToolbarShortcutCodeRefresh, xidRow
} from "@/components/CgTable/table";
import FormInput from "@/components/CgFormInput";
import MixinCgPager from "@/components/CgTable/mixin/MixinCgPager.vue";
import {NewDefaultProxyConfigData, NewDefaultTableProperty, NewEitConfigData,} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import ColumnSlots from "@/components/CgTable/components/ColumnSlots.vue";

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import CgFormInput from "@/components/CgFormInput/index.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  mixins: [MixinCgPager, MixinComponentMap],
  components: {CgFormInput, ColumnSlots, FormInput, Loading},
  props: {
    debug:Boolean,
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
    shouldFieldDisable:{
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({row,fieldSchema}) {
        return false
      },
    },
    codeItemClick: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
      },
    }
  },
  data() {
    return {
      inLoading: false,
      debugMessage:'',
      tableData: [],
      // 当前选中的行
      currentRow: null,
      rowFormEditorReadonly: false,
      rowFormEditorVisible: false,
      rowFormEditorAlert: '',
      rowFormEditorMode: RowEditorForView,

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
        enable:true,
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
    fieldValueVirtual,
    getProxySlotName,

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
            if (codeOrItem.slot === 'SlotPager') {
              pagerFound = true
            }
          })
        })
        if (!pagerFound) {
          this.footerConfigData.rightItems.push({slot: 'SlotPager'})
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
    toolbarSpan(configData, direction) {
      if (direction === 'left') {
        return configData.leftItems.length === 0 ? 0 : configData.leftSpan
      }
      return configData.leftItems.length === 0 ? 24 : (configData.rightSpan || 24 - configData.leftSpan)
    },
    tableHeight(){
      if(!this.tablePropertyData.heightSubVH) {
        // null或者0根据内容自适应高度
        if(jsb.isNull(this.tablePropertyData.height) || parseInt(this.tablePropertyData.height) === 0){
          return null
        }
        if(!jsb.isEmpty(this.tablePropertyData.height)){
          return this.tablePropertyData.height
        }
      }
      let sub = 70+this.tablePropertyData.heightSubVH
      sub += this.toolbarConfigData.enable?40:0
      sub += this.pagerConfigData.enable?40:0
      sub += this.debug?37:0
      return `${jsb.clientHeight(sub)}px`
    },
    // 每一个cell的属性
    cellStyleWrapper({row, column}) {
      return this.cellStyle ? this.cellStyle({row, column}) :null;
    },
    // current-change 回调
    currentChange(row) {
      this.debugMessage = `currentChange row xid: ${xidRow(row)}`
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
      this.rowFormEditorReadonly = false
      if (jsb.isString(triggerRet)) {
        this.rowFormEditorReadonly = true
        this.rowFormEditorAlert = triggerRet
      } else if (!triggerRet) {
        // 不允许编辑
        return;
      }
      // 进入查看或者编辑模式
      this.rowFormEditorMode = this.rowFormEditorReadonly ? RowEditorForView : RowEditorForUpdate
      this.setEditRow(row)
    },
    // header或者footer的item点击时间事件
    privateCodeItemClick({code, scope}) {
      this.debugMessage = `privateCodeItemClick code: ${code}`
      if (this.codeItemClick({code, scope})) {
        return
      }
      this.defaultCodeItemClick({code})
    },
    // 默认的code处理逻辑
    defaultCodeItemClick({code}) {
      switch (code) {
        case ToolbarShortcutCodeRefresh:
          this.tryProxyQueryData()
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
      this.debugMessage = `setEditRow row xid: ${xidRow(row)}`
      this.currentRow = row
      if (this.editConfigData.rowEditor === RowEditorInplace) {
        this.toastError(`editor mode ${RowEditorInplace} not support yet`)
        return
      }
      this.rowFormEditorVisible = true
    },
    tryProxyQueryData() {
      this.debugMessage = `tryProxyQueryData called`
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
    }
  }
}
</script>

<style>
.el-table.cg-table-normal-padding td, .el-table.cg-table-normal-padding th {
}

.el-table.cg-table-medium-padding td, .el-table.cg-table-medium-padding th {
  padding:6px
}

.el-table.cg-table-small-padding td, .el-table.cg-table-small-padding th {
  padding:3px
}

.el-table.cg-table-mini-padding td, .el-table.cg-table-mini-padding th {
  padding:1px
}
</style>