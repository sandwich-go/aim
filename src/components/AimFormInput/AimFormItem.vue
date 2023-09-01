<template>
  <el-form-item v-if="showForm(getRow(),fs,dataRef)" :key="fs['field']" :prop="fs['field']" :ref="fs['field']" :label-width="getLabelWidth(fs)">
  <span slot='label' v-if="getShowLabel(fs)">
      <column-header :field-schema="fs" :ignore-required="true" :name="formLabel(fs)" :sub="formNameSub(fs)">
        <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
          <slot :name="tipSlotName(fs)" :field-schema="fs"/>
        </template>
      </column-header>
  </span>
    <template v-if="registeredComponentMap[cellName]">
        <component
            v-if="!fs['formButton'] && !fs['formLink']"
            :is="registeredComponentMap[cellName]"
            :data="dataRef"
            :field-name="fs.field"
            :options="fs.options || []"
            :style-base="{width:'100%'}"
            :cell-config="cellConfig(fs)"
            :field-schema="fs"
            :table-data-getter="tableDataGetter"
            :get-row="getRow"
            :formatter="fs['formatterForm']"
            :disabled="shouldDisable()"
            :key="fieldComponentKey(fs)"
        ></component>
      <div v-else style="display:inline-flex;align-items:center;width: 100%">
        <component
            :is="registeredComponentMap[cellName]"
            :data="dataRef"
            :get-row="getRow"
            :field-name="fs.field"
            :options="fs.options || []"
            :style-base="{width:'100%'}"
            :cell-config="cellConfig(fs)"
            :table-data-getter="tableDataGetter"
            :field-schema="fs"
            :formatter="fs['formatterForm']"
            :disabled="shouldDisable()"
            :key="fieldComponentKey(fs)"
        ></component>
        <template v-if="fs['formButton']" >
          <el-button v-for="(v,index) in formButtonLinkArray('formButton')" v-bind="v" :key="index"
                     @click="v.click({jsEvent:$event,row:getRow(),parent:dataRef,value:dataRef[fs.field]})">
          {{v.circle?'':v.label}}
          </el-button>
        </template>

        <template v-if="fs['formLink']" >
          <el-button v-for="(v,index) in formButtonLinkArray('formLink')" v-bind="v" :key="index"
                     @click="v.click({jsEvent:$event,row:getRow(),parent:dataRef,value:dataRef[fs.field]})">
            {{v.label}}
          </el-button>
        </template>
      </div>
    </template>
    <div v-else-if="isAimTable(cellName)">
      <el-card class="box-card" shadow="always">
        <aim-table
            :ref="`aimTable_${fs['field']}`"
            :schema="fs.fields"
            :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
            v-bind="cellConfigForTable"
            :key="fieldComponentKey(fs)"
        ></aim-table>
      </el-card>
    </div>
    <div v-else-if="isAimFormInput(cellName)">
      <template v-if="fs['squashDivider']">
        <el-divider v-bind="squashDividerConfig">
          <i v-if="squashDividerConfig.icon" :class="squashDividerConfig.icon" :style="getSquashDividerIconStyle()"></i>
          <column-header :field-schema="fs" :ignore-required="true" :name="formLabel(fs)" :sub="formNameSub(fs)">
            <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
              <slot :name="tipSlotName(fs)" :field-schema="fs"/>
            </template>
          </column-header>
        </el-divider>
      </template>
      <aim-form-input
          v-if="shouldSquash(fs)"
          :schema="fs.fields"
          :data="dataRef[fs.field]"
          :row-top="getRow()"
          :label-width="getSubFormLabelWidth(fs)"
          :parent-key="fs.field"
          :table-data-getter="tableDataGetter"
          :key="fieldComponentKey(fs)"
          :group-config="fs['groupConfig'] || []"
          :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
          :should-cell-disable="shouldCellDisable"
          :popup-append-to-body="true"
          :rules="FormRulesFromSchema(fs.fields)"
      ></aim-form-input>
      <el-card v-else  class="box-card" shadow="always">
        <aim-form-input
            :schema="fs.fields"
            :data="dataRef[fs.field]"
            :row-top="getRow()"
            :table-data-getter="tableDataGetter"
            :label-width="getSubFormLabelWidth(fs)"
            :parent-key="fs.field"
            :key="fieldComponentKey(fs)"
            :group-config="fs['groupConfig'] || []"
            :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
            :should-cell-disable="shouldCellDisable"
            :popup-append-to-body="true"
            :rules="FormRulesFromSchema(fs.fields)"
        ></aim-form-input>
      </el-card>
    </div>
    <div v-else>{{ cellName }} not supported</div>

    <span v-if="fs.comment" class="aim-form-item-comment" :style="commentStyle">{{ comment(getRow(), dataRef,fs, 'comment') }}</span>
    <span v-if="fs.commentHTML" class="aim-form-item-comment" :style="commentStyle" v-html="comment(getRow(),dataRef,fs,'commentHTML')"></span>
    <slot v-if="commentSlotName(fs)" :name="commentSlotName(fs)" :field-schema="fs" :row="getRow()"/>
  </el-form-item>
</template>

<script>
import {cellConfigForForm, cellNameForForm} from "@/components/AimTable/cell";
import jsb from "@sandwich-go/jsb";
import {
  CodeButtonAdd, CodeButtonRowSave,
  CodeButtonRowSelectedMinus
} from "@/components/cells/const";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import {xidRow} from "@/components/AimTable/table";
import {isAimFormInput, isAimTable} from "@/components/cells/is";
import {comment, disableForm, showForm} from "@/components/AimFormInput/index";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";
import {commentSlotName, getProxyCommentSlotName, getProxyTipSlotName, tipSlotName} from "@/components/AimTable/slot";
import ColumnHeader from "@/components/AimTable/Column/ColumnHeader.vue";
import {FormRulesFromSchema} from "@/components/AimTable/validate";

export default {
  name: "AimFormItem",
  props: {
    tableDataGetter:Function,
    getRow: Function,
    fs: Object,
    privateShouldCellDisable: Function,
    shouldCellDisable: Function,
    dataRef: Object,
    labelWidth: String,
    showLabel: {
      type: Boolean,
      default: true
    },
  },
  mixins: [mixinComponentMap],
  computed: {
    cellConfig() {
      return (fs) => {
        return cellConfigForForm(fs, this.getRow())
      }
    }
  },
  components: {
    ColumnHeader,
    CellViewLabelTooltip,
    AimFormInput: () => import("@/components/AimFormInput/index.vue"),
    AimTable: () => import("@/components/AimTable/index.vue"),
  },
  created() {
    // 占位
    this.getProxyTipSlotName()
    this.getProxyCommentSlotName()
    if(isAimTable(this.cellName)){
      this.cellConfigForTable = this.getCellConfigForTable()
    }
  },
  beforeDestroy() {
    this.cleanTableWatcher()
  },
  data(){
    return {
      dateFormatter:{},
      cellName:cellNameForForm(this.fs, this.getRow()),
      squashDividerConfig:this.getSquashDividerConfig(this.fs),
      commentStyle :jsb.cc.aimFormCommentStyle || {
        'font-style':'italic',
        'color':'#707070',
        'font-size':'12px',
      },
      tableWatcher:[],
      cellConfigForTable:{}
    }
  },
  methods: {
    showForm,
    FormRulesFromSchema,
    commentSlotName,
    getProxyCommentSlotName,
    getProxyTipSlotName,
    tipSlotName,
    isAimFormInput,
    isAimTable,
    comment,
    getCellConfigForTable(){
      const fs = this.fs
      let cc = Object.assign({
        righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
        proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, fs.field),
        selection: true,
        rowRemoveShortcut: true,
        popupAppendToBody: true,
      }, this.cellConfig(fs))
      cc.editConfig = jsb.objectAssignNX(cc.editConfig, {
        formEditorCells: function () {
          return [CodeButtonRowSave]
        }
      })
      // 逻辑层指定proxyConfig为function，激活动态获取数据属性
      if(jsb.isFunction(cc.proxyConfig)) {
        cc.proxyConfig = cc.proxyConfig({parent:this.dataRef})
        this.setUpTableWatcher(fs.field,jsb.pathGet(cc.proxyConfig,'watch',[]))
      }
      return cc
    },
    setUpTableWatcher(field,watchFieldList){
      // 数据更新需要watch同form内的字段
      // fixme $watch同一个字段会被覆盖，简化处理基于一个form中只有一个动态数据表
      this.cleanTableWatcher()
      jsb.each(watchFieldList,watchField=>{
        const watcher = this.$watch(`dataRef.${watchField}`,function (){
          this.reloadLocalProxyAimTableData(field)
        })
        this.tableWatcher.push(watcher)
      })
    },
    cleanTableWatcher(){
      this.tableWatcher.forEach((watcher) => watcher());
      this.tableWatcher = []
    },
    formButtonLinkArray(field){
      const fb = jsb.pathGet(this.fs,field)
      if(jsb.isFunction(fb)){
        return jsb.wrapArray(fb({row:this.getRow(),parent:this.dataRef}))
      }
      return jsb.wrapArray(fb)
    },
    shouldDisable(){
      const v = disableForm(this.getRow(),this.fs,this.dataRef)
      if(v){
        return v
      }
      return this.privateShouldCellDisable({fieldSchema:this.fs,cell:this.cellConfig(this.fs) ||{}})
    },
    // 刷新当前表内local proxy 的aim表数据
    reloadLocalProxyAimTableData(field){
      const ref = this.$refs[`aimTable_${field}`]
      if(ref) {
        ref.proxyQueryData()
      }
    },
    getShowLabel(fs){
      // tab显示的时候不再显示label，遵循上级设定
      if(!this.showLabel){
        return false
      }
      // 如果是一个form input组件，默认应该显示label，但当讲内部元素提升一级显示时，label不再显示
      if(this.shouldSquash(fs)) {
        return false
      }
      return this.showLabel
    },
    getSquashDividerIconStyle(){
      let defaultConfig = {
        'padding-right':"3px"
      }
      if(jsb.isPlainObject(this.squashDividerConfig['iconStyle'])) {
        return Object.assign(defaultConfig,this.squashDividerConfig['iconStyle'])
      }
      return defaultConfig
    },
    getSquashDividerConfig(fs){
      let defaultConfig = {
        'content-position':"left"
      }
      if(jsb.isPlainObject(fs.squashDivider)) {
        return Object.assign(defaultConfig,fs.squashDivider)
      }
      return defaultConfig
    },
    shouldSquash(fs){
      if(!isAimFormInput(this.cellName)){
        return false
      }
      return fs.squash || fs.squashDivider
    },
    getLabelWidth(fs){
      if(isAimFormInput(this.cellName)){
        // 元素提级显示，子元素的label宽度等同父级,本身的label宽度设定为0
        if(this.shouldSquash(fs)){
          return "0px"
        }
        return this.labelWidth
      }
      return this.labelWidth
    },
    getSubFormLabelWidth(fs){
      if(isAimFormInput(this.cellName)){
        if(this.shouldSquash(fs)){
          return this.labelWidth
        }
        return null
      }
      return null
    },
    formLabel(fs) {
      return jsb.pathGet(fs, 'nameForm', fs['name'])
    },
    formNameSub(fs) {
      return jsb.pathGet(fs, 'nameSubForm', fs['nameSub'])
    },
    fieldComponentKey(fs) {
      return `${this.parentKey}_${fs.field}_${xidRow(this.getRow())}`
    },
  }
}
</script>