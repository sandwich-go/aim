<template>
  <div>
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
      >
        <template v-for="item in toolbarConfigData[direction+'Items']" v-slot:[getProxySlotName(item.slot)]="{}">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
        </template>
      </column-slots>
    </el-row>

    <el-table
        ref="table"
        :data="tableData"
        height="100%"
        :border="tablePropertyData.border"
        :stripe="tablePropertyData.stripe"
        :class="tablePropertyData.class"
        :show-header="tablePropertyData.showHeader"
        :empty-text="tablePropertyData.emptyText"
        :header-cell-style="tablePropertyData.headerCellStyle"
        :highlight-current-row="tablePropertyData.highlightCurrentRow"
        :cell-style="cellStyleWrapper"
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
      >
        <template v-for="item in footerConfigData[direction+'Items']" v-slot:[getProxySlotName(item.slot)]="{}">
          <slot v-if="item.slot" :name="item.slot" :item="item"></slot>
        </template>
      </column-slots>
    </el-row>

    <el-dialog modal width="80%" :visible.sync="rowFormEditorVisible">
      <form-input
          :schema="schema"
          :row="currentRow"
      ></form-input>
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
  RowEditorInplace
} from "@/components/CgTable/table";
import FormInput from "@/components/CgFormInput";
import MixinCgPager from "@/components/CgTable/mixin/MixinCgPager.vue";
import {NewDefaultProxyConfigData, NewDefaultTableProperty, NewEitConfigData,} from "@/components/CgTable/default";
import MixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import ColumnSlots from "@/components/CgTable/components/ColumnSlots.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgTable",
  mixins: [MixinCgPager, MixinComponentMap],
  components: {ColumnSlots, FormInput},
  props: {
    tableDivStyle: Object,
    tableProperty: Object,
    cellStyle: Function,
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
    shouldButtonDisable: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, button}) {
        return false
      },
    },
    // eslint-disable-next-line no-unused-vars
    shouldButtonHide: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, button}) {
        return false
      },
    }
  },
  data() {
    return {
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
      this.footerConfigData =  fixToolbarItems(Object.assign(this.footerConfigData, this.footerConfig))
      let pagerFound = false
      if(this.pagerConfigData.enable){
        jsb.each(['leftItems','rightItems'],function (val) {
          jsb.each(_this.footerConfigData[val], function (codeOrItem) {
            if(codeOrItem.slot === 'SlotPager') {
              pagerFound = true
            }
          })
        })
        if(!pagerFound) {
          this.footerConfigData.rightItems.push({slot:'SlotPager'})
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
    // 每一个cell的属性
    cellStyleWrapper({row, column}) {
      return this.cellStyle ? this.cellStyle({row, column}) : '';
    },
    // current-change 回调
    currentChange(row) {
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
    privateShouldToolbarItemDisable({code, item}) {
      if (item.disable || item.disabled) {
        return true
      }
      if (!this.shouldButtonDisable) {
        return false
      }
      return this.shouldButtonDisable({code, item})
    },
    privateShouldToolbarItemHide({code, item}) {
      if (item.hide || jsb.pathGet(item, 'show', true)) {
        return true
      }
      if (!this.shouldButtonHide) {
        return false
      }
      return this.shouldButtonHide({code, item})
    },
    // 设定当前编辑的行
    setEditRow(row) {
      this.currentRow = row
      if (this.editConfigData.rowEditor === RowEditorInplace) {
        this.toastError(`editor mode ${RowEditorInplace} not support yet`)
        return
      }
      this.rowFormEditorVisible = true
    },
    tryProxyQueryData() {
      const queryFunc = this.proxyConfigData.query
      if (!queryFunc) {
        return
      }
      let params = {}
      Promise.resolve(queryFunc({params: params})).catch(e => {
        console.error("CgTable tryProxyQueryData got err:", e)
      }).then((rest) => {
        this.tableData = cleanData(jsb.pathGet(rest, 'Data'))
      })
    }
  }
}
</script>