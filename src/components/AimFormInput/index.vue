<template>
  <div :class="height?'aim-form-container':''" :style="cssVars">
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
          <el-divider :key="`group_divider_${index}`" v-bind="fs.setting">{{fs.setting.label}}</el-divider>
        </template>
        <template v-else-if="fs.__isGroup && fs.setting.type ==='inline'">
          <el-row :key="`group_inline_${index}`">
            <template v-for="(fss,subIndex) in fs.fieldSchemaList">
              <el-col :key="`group_inline_${index}_${subIndex}`" :span="span(fs,fss.field)">
                <aim-form-item
                    :fs="fss"
                    :label-width="labelWidthPixel"
                    :data-ref="dataRef"
                    :get-row="getRow"
                    :should-cell-disable="shouldCellDisable"
                    :private-should-cell-disable="privateShouldCellDisable"
                ></aim-form-item>
              </el-col>
            </template>
          </el-row>
        </template>
        <template v-else-if="fs.__isGroup && fs.setting.type ==='tab'">
          <el-form-item :key="`group_tab_${fs.index}`">
            <el-tabs v-model="currTab[`group_tab_${fs.index}`]">
              <el-tab-pane v-for="(fss,subIndex) in fs.fieldSchemaList" :key="`group_tab_${fs.index}_${subIndex}`" :label="formLabel(fss)" :name="formLabel(fss)" :lazy="true">
                <span slot='label' v-if="fss.tips">
                  <cell-view-label-tooltip :cell-config="{label:formLabel(fss),tips:fss.tips}"></cell-view-label-tooltip>
                </span>
                <aim-form-item
                    :fs="fss"
                    :data-ref="dataRef"
                    :get-row="getRow"
                    label-width="0px"
                    :show-label="false"
                    :should-cell-disable="shouldCellDisable"
                    :private-should-cell-disable="privateShouldCellDisable"
                ></aim-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form-item>
        </template>
        <aim-form-item
            v-else
            :fs="fs"
            :label-width="labelWidthPixel"
            :key="index"
            :data-ref="dataRef"
            :get-row="getRow"
            :should-cell-disable="shouldCellDisable"
            :private-should-cell-disable="privateShouldCellDisable"
        ></aim-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

import isString from "@sandwich-go/jsb/isString";
import jsb from "@sandwich-go/jsb";
import {AimFormInputInsert, AimFormInputView, calcLabelWidth} from "./index";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import {xidRow} from "@/components/AimTable/table";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import {cellConfigForForm, cellNameForForm} from "@/components/AimTable/cell";
import CellViewAlert from "@/components/cells/CellViewAlert.vue";
import {isVirtualField} from "@/components/AimTable/schema";
import AimFormItem from "@/components/AimFormInput/AimFormItem.vue";
import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";

export default {
  name: "AimFormInput",
  components: {
    AimFormItem,
    CellViewAlert,
    CellViewLabelTooltip,
  },
  watch:{
    schema: {
      handler: function () {
        this.processSchema()
      },
      deep:true,
      immediate: true
    },
  },
  computed: {
    cssVars() {
      return {
        "--form-container-height": `${this.height}px`
      };
    },
    cellName() {
      return (fs) => {
        return cellNameForForm(fs, this.getRow())
      }
    },
    // 如果类型为table，返回字段对应的table配置
    cellConfigForTable() {
      return (fs) => {
        const cc = this.cellConfig(fs)
        return Object.assign({
          righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
          proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, fs.field),
          selection: true,
          popupAppendToBody: true,
        }, cc.tableConfig)
      }
    },
    cellConfig() {
      return (fs) => {
        return cellConfigForForm(fs, this.getRow())
      }
    }
  },
  mixins: [mixinComponentMap],
  props: {
    height:Number,
    schema: Array, // 行schema信息
    data: Object,  // 当前行数据
    mode: String,   // 编辑模式
    alertInfo: {
      type: [Object, String],
      default: null,
    },
    rules: Object,
    shouldCellDisable: Function,
    // 最外层调用不要设定rowTop,递归时传递到最底层便于统一回调外层
    rowTop: Object,
    labelWidth: String,
    popupAppendToBody: Boolean,
    parentKey: String,
    readOnly:Boolean,
    // 对接AimTable时,AimTable自动完成了watch
    enableWatcher:{
      type:Boolean,
      default:true,
    },
    groupConfig:Array,
  },
  data() {
    return {
      CodeButtonAdd,
      CodeButtonRowSelectedMinus,
      labelWidthPixel: this.labelWidth || calcLabelWidth(this.schema),
      //fixme 需要table打入rules,独立使用AimFormInput的时候需要根据schema更新rules
      rulesRef: this.rules,
      fieldsCommon: [],
      dataRef: this.data,

      // inline显示的字段
      fieldSorted:[],
      currTab:{},
    }
  },
  methods: {
    isString,
    afterField(fieldGroupList,field){
      let ret = []
      jsb.each(fieldGroupList,function (group){
        if(group.setting.after === field){
          ret.push(group)
        }
      })
      return ret
    },
    processSchema() {
      if (!this.dataRef) {
        return
      }
      const fieldsCommon = []
      const fieldGroupList = []
      const _this = this

      jsb.each(this.schema, function (fs) {
        if (isVirtualField(fs)) {
          return
        }
        const itemType = _this.fieldType(fs)
        // 如果是object类型，在传递进 FormInput 组件前需要给默认值
        if (itemType === 'object' && jsb.isEmpty(_this.dataRef[fs.field])) {
          _this.dataRef[fs.field] = {}
        }
        if ((itemType === 'table' && jsb.isEmpty(_this.dataRef[fs.field]))) {
          _this.dataRef[fs.field] = []
        }
        const watch = jsb.pathGet(fs,'watch')
        if(_this.enableWatcher && watch){
          _this.$watch(`dataRef.${fs.field}`,function (newValue, oldValue){
            watch({row:this.data,newValue, oldValue})
          })
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
    span(group,field){
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
    validate(validCallback) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          validCallback()
        }
      })
    },
    fieldComponentKey(fs) {
      return `${this.parentKey}_${fs.field}_${xidRow(this.getRow())}`
    },
    privateShouldCellDisable({fieldSchema, cell}) {
      if(this.readOnly){
        return true
      }
      if (this.mode === AimFormInputView) {
        return true
      }
      // 只读属性，如id等依赖服务器返回，只展现不允许编辑
      if (jsb.pathGet(fieldSchema, 'readOnly', false)) {
        return true
      }
      if (jsb.pathGet(fieldSchema, 'insertOnly', false)) {
        // 只允许插入时有效，创建后不允许编辑
        return this.mode !== AimFormInputInsert
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
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  z-index: 10;
}

.aim-component-flex-end {
  @extend .aim-component-flex-start;
  justify-content: flex-end;
}

.aim-form-item-comment {
  color: #707070;
  font-size: 12px;
  align-items: center;
  justify-content: flex-start;
}

</style>

<style lang="scss" scoped>
.aim-form-container {
  height: var(--form-container-height) !important;
  overflow: auto;
}
</style>