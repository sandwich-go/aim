<template>
  <div :class="height?'aim-form-container':''" :style="cssVars">
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <cell-view-alert v-if="alertInfo"
                     :center="true"
                     style="position: sticky;font-weight: bold;top:0;margin-bottom: 9px;z-index: 1000000;"
                     :cell-config="isString(alertInfo)?{title:alertInfo}:alertInfo"></cell-view-alert>
    <el-form
        v-if="dataRef"
        :model="dataRef"
        :label-width="labelWidthPixel"
        :rules="rulesRef"
        ref="form"
        show-message
        label-position="right"
        size="mini">
      <template v-for="(fs,index) in fieldSorted">
        <template v-if="fs.__isGroup && fs.setting.type ==='divider'">
          <el-divider :key="`group_divider_${index}`" v-bind="fs.setting">
            <el-icon v-if="fs.setting.icon" v-bind="iconBind(fs.setting.icon)" ></el-icon>
            <span v-html="fs.setting.label"/></el-divider>
        </template>
        <template v-else-if="fs.__isGroup && fs.setting.type ==='inline'">
          <el-row :key="`group_inline_${index}`">
            <template v-for="(fss,subIndex) in fs.fieldSchemaList">
              <el-col :key="`group_inline_${index}_${subIndex}`" :span="span(fs,fss.field)">
                <aim-form-item
                    ref="aimFormItem"
                    :fs="fss"
                    :label-width="labelWidthPixel"
                    :data-ref="dataRef"
                    :get-row="getRow"
                    :mode="mode"
                    :table-data-getter="tableDataGetter"
                    :should-cell-disable="shouldCellDisable"
                    :private-should-cell-disable="privateShouldCellDisable"
                >
                  <template v-slot:[tipSlotName(fss)]="{}">
                    <slot :name="getProxyTipSlotName(fss)"></slot>
                  </template>
                  <template v-slot:[formSlotName(fss)]="{row}">
                    <slot :name="getProxyFormSlotName(fss)" :row="row"></slot>
                  </template>
                  <template v-for="name in allCommentSlotName" v-slot:[name]="{fieldSchema,row}">
                    <slot :name="getProxyCommentSlotNameWithName(name)" :field-chema="fieldSchema" :row="row"></slot>
                  </template>
                </aim-form-item>
              </el-col>
            </template>
          </el-row>
        </template>
        <template v-else-if="fs.__isGroup && fs.setting.type ==='card'">
          <el-form-item v-if="groupShow(fs)" :key="`group_card_${index}`" :label-width="groupLabelWidth(fs)" :label="fs.setting.label || ''">
            <el-card class="box-card" shadow="always">
              <template v-for="(fss,subIndex) in fs.fieldSchemaList">
                <aim-form-item
                    ref="aimFormItem"
                    :key="`group_card_${index}_${subIndex}`"
                    :fs="fss"
                    :label-width="labelWidthPixel"
                    :data-ref="dataRef"
                    :mode="mode"
                    :get-row="getRow"
                    :table-data-getter="tableDataGetter"
                    :should-cell-disable="shouldCellDisable"
                    :private-should-cell-disable="privateShouldCellDisable"
                >
                  <template v-slot:[tipSlotName(fs)]="{}">
                    <slot :name="getProxyTipSlotName(fs)"></slot>
                  </template>
                  <template v-slot:[formSlotName(fs)]="{row}">
                    <slot :name="getProxyFormSlotName(fs)" :row="row"></slot>
                  </template>
                  <template v-for="name in allCommentSlotName" v-slot:[name]="{fieldSchema,row}">
                    <slot :name="getProxyCommentSlotNameWithName(name)" :field-chema="fieldSchema" :row="row"></slot>
                  </template>
                </aim-form-item>
              </template>
            </el-card>
          </el-form-item>
        </template>
        <template v-else-if="fs.__isGroup && fs.setting.type ==='tab'">
          <el-form-item :key="`group_tab_${fs.index}`" :label-width="groupLabelWidth(fs)" :label="fs.setting.label || ''">
            <el-tabs v-model="currTab[`group_tab_${fs.index}`]" v-bind="fs.setting.tabs || {}">
              <el-tab-pane v-for="(fss,subIndex) in fs.fieldSchemaList" :key="`group_tab_${fs.index}_${subIndex}`" :label="formLabel(fss)" :name="formLabel(fss)" :lazy="true">
                <span slot='label'>
                  <column-header :field-schema="fss" :ignore-required="true" :name="formLabel(fss)">
                    <template v-if="tipSlotName(fss)" v-slot:[getProxyTipSlotName(fss)]="{}">
                      <slot :name="tipSlotName(fss)" :field-schema="fss"/>
                    </template>
                  </column-header>
                </span>
                <aim-form-item
                    ref="aimFormItem"
                    :fs="fss"
                    :data-ref="dataRef"
                    :mode="mode"
                    :get-row="getRow"
                    label-width="0"
                    :show-label="false"
                    :table-data-getter="tableDataGetter"
                    :should-cell-disable="shouldCellDisable"
                    :private-should-cell-disable="privateShouldCellDisable"
                >
                  <template v-slot:[tipSlotName(fs)]="{}">
                    <slot :name="getProxyTipSlotName(fs)"></slot>
                  </template>
                  <template v-slot:[formSlotName(fs)]="{row}">
                    <slot :name="getProxyFormSlotName(fs)" :row="row"></slot>
                  </template>
                  <template v-for="name in allCommentSlotName" v-slot:[name]="{fieldSchema,row}">
                    <slot :name="getProxyCommentSlotNameWithName(name)" :field-chema="fieldSchema" :row="row"></slot>
                  </template>
                </aim-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </template>
        <aim-form-item
            v-else
            ref="aimFormItem"
            :fs="fs"
            :label-width="labelWidthPixel"
            :key="index"
            :data-ref="dataRef"
            :mode="mode"
            :get-row="getRow"
            :table-data-getter="tableDataGetter"
            :should-cell-disable="shouldCellDisable"
            :private-should-cell-disable="privateShouldCellDisable"
        >
          <template v-slot:[tipSlotName(fs)]="{}">
            <slot :name="getProxyTipSlotName(fs)"></slot>
          </template>
          <template v-slot:[formSlotName(fs)]="{row}">
            <slot :name="getProxyFormSlotName(fs)" :row="row"></slot>
          </template>
          <template v-for="name in allCommentSlotName" v-slot:[name]="{fieldSchema,row}">
            <slot :name="getProxyCommentSlotNameWithName(name)" :field-chema="fieldSchema" :row="row"></slot>
          </template>
        </aim-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

import isString from "@sandwich-go/jsb/isString";
import jsb from "@sandwich-go/jsb";
import {AimFormInputCopy, AimFormInputInsert, AimFormInputView, calcLabelWidth, showForm} from "./index";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import {xidRow} from "@/components/AimTable/table";
import CellViewAlert from "@/components/cells/CellViewAlert.vue";
import AimFormItem from "@/components/AimFormInput/AimFormItem.vue";
import {
  allSlotName,
  commentSlotName, formSlotName,
  getProxyCommentSlotName, getProxyCommentSlotNameWithName, getProxyFormSlotName,
  getProxyTipSlotName,
  tipSlotName
} from "@/components/AimTable/slot";
import ColumnHeader from "@/components/AimTable/Column/ColumnHeader.vue";
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';
import {isVirtualField} from "@/components/AimTable/virtual_field";
import {CleanRowForStorage} from "@/components/AimTable/formatterForUpdate";
import {FormRulesFromSchema} from "@/components/AimTable/validate";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";
export default {
  name: "AimFormInput",
  components: {
    Loading,
    ColumnHeader,
    AimFormItem,
    CellViewAlert,
  },
  watch:{
    schema: {
      handler: function () {
        this.processSchema()
      },
      deep:true
    },
  },
  computed: {
    cssVars() {
      return {
        "--form-container-height": `${this.height}px`
      };
    },
    allCommentSlotName(){
      return allSlotName(this.schema,'commentSlot')
    }
  },
  mixins: [mixinComponentMap],
  props: {
    height:Number,
    schema: Array, // 行schema信息
    data: [Object,Function,Promise],  // 当前行数据
    mode: String,   // 编辑模式
    alertInfo: {
      type: [Object, String],
      default: null,
    },
    rules:Object,
    shouldCellDisable: Function,
    // 最外层调用不要设定rowTop,递归时传递到最底层便于统一回调外层
    rowTop: Object,
    labelWidth: String,
    viewLevelIndex:Number,// 默认0也就是0级页面
    parentKey: String,
    readOnly:Boolean,
    // 对接AimTable时,AimTable自动完成了watch
    enableWatcher:{
      type:Boolean,
      default:true,
    },
    groupConfig:Array,
    row2Storage:Function,
    tableDataGetter:Function,
    submitRemoveFieldNotInSchema:{
      type:Boolean,
      default:false,
    },
  },
  async created() {
    let dataGot = this.data
    if (typeof this.data === 'function') {
      // 如果 options 是一个函数，则调用它并等待它的返回值
      dataGot = this.data();
      if (dataGot instanceof Promise) {
        dataGot = await dataGot;
      }
    } else if (this.data instanceof Promise) {
      // 如果 options 是一个 Promise，则等待 Promise 完成并赋值给 optionsInner
      dataGot = await this.data;
    }
    this.dataRef = dataGot
    this.processSchema()

    if (this.rules) {
      this.rulesRef = this.rules
    } else {
      this.rulesRef = FormRulesFromSchema(this.schema)
    }
    this.getProxyTipSlotName()
    this.getProxyCommentSlotName()
  },
  data() {
    return {
      CodeButtonAdd,
      CodeButtonRowSelectedMinus,
      labelWidthPixel: this.labelWidth || calcLabelWidth(this.schema ||[]),
      //fixme 需要table打入rules,独立使用AimFormInput的时候需要根据schema更新rules
      rulesRef: {},
      fieldsCommon: [],
      dataRef: {},
      inLoading:false,
      // inline显示的字段
      fieldSorted:[],
      currTab:{},
      groupMaxFieldNumber:0,
      fieldWatcher:[]
    }
  },
  beforeDestroy() {
    this.cleanFieldWatcher()
  },
  methods: {
    groupLabelWidth(gs){
      const groupSquash = jsb.pathGet(gs.setting,'squash',false)
      if(groupSquash) {
        if(jsb.pathGet(gs,'squash',false)) {
          return null
        }
        return '0px'
      }
      return null
    },
    getProxyCommentSlotNameWithName,
    commentSlotName,
    tipSlotName,
    formSlotName,
    isString,
    getProxyTipSlotName,
    getProxyFormSlotName,
    getProxyCommentSlotName,
    cleanFieldWatcher(){
      this.fieldWatcher.forEach((watcher) => watcher());
      this.fieldWatcher = []
    },
    afterField(fieldGroupList,field){
      let ret = []
      jsb.each(fieldGroupList,function (group){
        if(group.setting.after === field){
          ret.push(group)
        }
      })
      ret.sort(function(a, b) {
        const indexA = a.setting.index || 0
        const indexB = b.setting.index || 0
        return indexA - indexB;
      });
      return ret
    },
    iconBind(icon) {
      if(jsb.isString(icon)){
        return {class:icon,style:{'padding-right':'3px'}}
      }
      return icon
    },
    setInLoading(v){
      this.inLoading = v
    },
    setLoading(v){
      this.inLoading = v
    },
    // 刷新当前表内local proxy 的aim表数据
    reloadLocalProxyAimTableData(field){
      const refs = this.$refs['aimFormItem']
      jsb.each(jsb.wrapArray(refs),v=>{
        v.reloadLocalProxyAimTableData(field)
      })
    },
    processSchema() {
      if (!this.dataRef) {
        return
      }
      const fieldsCommon = []
      const fieldGroupList = []
      const _this = this

      // 创建视图的时候根据schema填充默认数值，防止由于数值缺失导致的访问undefined
      // 但是只有传入的data完全空的时候才设定 fillBySchemaDefault 为true
      this.dataRef = FillDefaultDataWithSchema(this.schema,this.dataRef,this.mode===AimFormInputInsert)
      console.log("this.dataRef ",this.dataRef)

      this.cleanFieldWatcher()
      _this.groupMaxFieldNumber = 0
      jsb.each(this.schema, function (fs) {
        let formOff = jsb.pathGet(fs,'formOff',undefined)
        if(formOff === undefined) {
          formOff = !!isVirtualField(fs);
        }
        if (formOff) {
          return
        }

        if(_this.mode === AimFormInputInsert && jsb.pathGet(fs,'insertOff',false)){
          return
        }

        const itemType = _this.fieldType(fs)
        // 如果是object类型，在传递进 FormInput 组件前需要给默认值
        if (itemType === 'object' && ((jsb.isNull(_this.dataRef[fs.field])) || jsb.isUndefined(_this.dataRef[fs.field]))) {
          _this.dataRef[fs.field] = {}
        }
        if (itemType === 'table' && ((jsb.isNull(_this.dataRef[fs.field])) || jsb.isUndefined(_this.dataRef[fs.field]))) {
          _this.dataRef[fs.field] = []
        }
        const watch = jsb.pathGet(fs,'watch')
        if(_this.enableWatcher && watch){
          const  watcher = _this.$watch(`dataRef.${fs.field}`,function (newValue, oldValue){
            watch({
              row:this.getRow(),
              newValue,
              oldValue,
              parent:this.dataRef,
              target:this
            })
          },jsb.pathGet(fs,'watchOptions',{}))
          _this.fieldWatcher.push(watcher)
        }
        let asCommonField = true
        jsb.each(_this.groupConfig,function (groupSetting,index){
          if(!asCommonField) {
            return
          }
          const fields = groupSetting.fields
          let fieldShouldInGroup
          if(fields){
            if(jsb.isArray(fields)){
              fieldShouldInGroup = fields.includes(fs.field)
            }else{
              fieldShouldInGroup = fields[fs.field]
            }
          }
          if(fieldShouldInGroup){
            let group = jsb.find(fieldGroupList,item=>item.index === index)
            if(!group){
              group = {index:index,fieldSchemaList:[],setting:groupSetting,__isGroup:true}
              fieldGroupList.push(group)
            }
            asCommonField = false
            if(!_this.currTab[`group_tab_${index}`]){
              _this.currTab[`group_tab_${index}`] = _this.formLabel(fs)
            }
            group.fieldSchemaList.push(fs)
            if(group.fieldSchemaList.length > _this.groupMaxFieldNumber) {
              _this.groupMaxFieldNumber = group.fieldSchemaList.length
            }
          }
        })
        if(asCommonField){
          fieldsCommon.push(fs)
        }
      })
      jsb.each(_this.groupConfig,function (groupSetting,index){
        if(groupSetting.type==='divider') {
          fieldGroupList.push({index:index,setting:groupSetting,__isGroup:true})
        }
      })


      _this.fieldSorted = []
      _this.fieldSorted.push(..._this.afterField(fieldGroupList,'@start'))
      jsb.each(fieldsCommon,function (fs){
        _this.fieldSorted.push(fs)
        _this.fieldSorted.push(..._this.afterField(fieldGroupList,fs.field))
      })
      jsb.each(fieldGroupList,function (group){
        if(!jsb.find(_this.fieldSorted,item=>item.index === group.index)) {
          _this.fieldSorted.push(group)
        }
      })
    },
    groupShow(group){
      let showCount = 0
      jsb.each(group.fieldSchemaList,v=>{
        if(showForm(this.getRow(),v,this.dataRef)){
          showCount += 1
        }
      })
      return showCount !==0
    },
    span(group,field){
      let showCount = 0
      jsb.each(group.fieldSchemaList,v=>{
        if(showForm(this.getRow(),v,this.dataRef)){
          showCount += 1
        }
      })
      if(showCount === 1){
        return 24
      }
      if(this.groupMaxFieldNumber && jsb.pathGet(group.setting,'itemAlign',true)){
        return 24 / this.groupMaxFieldNumber
      }
      if(jsb.isArray(group.setting.fields)) {
        return 24/group.setting.fields.length
      }
      return group.setting.fields[field] ||  24/group.setting.fields.length
    },
    fieldType(fs) {
      return jsb.pathGet(fs, 'typeFormInput', fs['type'])
    },
    getRow() {
      if (!this.rowTop) {
        return this.dataRef
      }
      return this.rowTop
    },
    formLabel(si) {
      return jsb.pathGet(si, 'nameForm', si['name'])
    },
    // 获取数据，不进行validate
    getDataForStorage(data=undefined){
      data = data || this.dataRef
      return CleanRowForStorage(this.schema,data,
          true,
          true,
          this.submitRemoveFieldNotInSchema,
          this.row2Storage)
    },
    // validate 逻辑层主动调用，单独使用AimFormInput的场景
    validate(validCallback,notValidCallback=null,onValidCallbackRunError=(e)=>{jsb.cc.toastWarning(e)}) {
      const _this = this
      this.__validatePrivate(validCallback,notValidCallback,onValidCallbackRunError,(v)=>{
        // 移除虚拟字段、移除控制字段
        return _this.getDataForStorage(v)
      })
    },
    // __validatePrivate 外部不要直接调用
    __validatePrivate(validCallback,notValidCallback=()=>{},onValidCallbackRunError=(e)=>{jsb.cc.toastWarning(e)},processor=(v)=>{return v}) {
      const _this = this
      this.$refs['form'].validate((valid) => {
        if (valid) {
          try {
            const tmp = processor(_this.dataRef)
            validCallback(tmp)
          }catch (e){
            if(jsb.isFunction(onValidCallbackRunError)){
              onValidCallbackRunError(e)
            }
          }
        }else{
          notValidCallback && notValidCallback()
        }
      })
    },
    // __validateFromAimTable aim table 内部调用，此处不主动清理数据，由aim table完成
    __validateFromAimTable(validCallback) {
      this.__validatePrivate(validCallback)
    },
    fieldComponentKey(fs) {
      return `${this.parentKey}_${fs.field}_${xidRow(this.getRow())}`
    },
    formHeight() {
      return this.$refs.form.$el.clientHeight
    },
    formRows() {
      return this.fieldSorted.length
    },
    privateShouldCellDisable({fieldSchema, cell}) {
      if(this.readOnly){
        return true
      }
      if (this.mode === AimFormInputView) {
        return true
      }
      // 只读属性，如id等依赖服务器返回，只展现不允许编辑
      if (jsb.pathGet(fieldSchema, 'disabled', false)) {
        return true
      }
      // 只读属性，如id等依赖服务器返回，只展现不允许编辑
      if (jsb.pathGet(fieldSchema, 'readOnly', false)) {
        return true
      }
      if (jsb.pathGet(fieldSchema, 'insertOnly', false)) {
        // 只允许插入时有效，创建后不允许编辑
        return this.mode !== AimFormInputInsert && this.mode !== AimFormInputCopy
      }
      if (!this.shouldCellDisable) {
        return false
      }
      return this.shouldCellDisable({fieldSchema, cell, row: this.getRow()})
    },
  }
}
</script>

<style>
.aim-component-flex-start {
  //align-items: start;
  //justify-content: flex-start;
  //overflow: hidden;
  //z-index: 10;
}

.aim-component-flex-end {
  @extend .aim-component-flex-start;
  justify-content: flex-end;
}


</style>

<style lang="scss" scoped>
.aim-form-container {
  height: var(--form-container-height) !important;
  overflow: auto;
}
</style>