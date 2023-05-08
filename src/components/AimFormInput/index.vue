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
      <template v-for="(fs) in schema">
        <el-form-item :key="fs.field" :label="formLabel(fs)" :prop="fs.field" :ref="fs.field">
          <span v-if="fs.tips" slot='label'>
            <cell-view-label-tooltip :cell-config="{label:formLabel(fs),tips:fs.tips}"></cell-view-label-tooltip>
          </span>
          <div class="aim-component-flex-start" v-if="registeredComponentMap[cellName(fs)]">
            <component
                :is="registeredComponentMap[cellName(fs)]"
                :data="dataRef"
                :field-name="fs.field"
                :options="fs.options || []"
                :style-base="{width:'100%'}"
                :cell-config="cellConfig(fs)"
                :field-schema="fs"
                :disabled="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
                :key="fieldComponentKey(fs)"
            ></component>
          </div>
          <div v-else-if="isAimTable(cellName(fs))">
            <el-card class="box-card" shadow="always">
              <aim-table
                  :schema="fs.fields"
                  :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
                  v-bind="cellConfigForTable(fs)"
                  :key="fieldComponentKey(fs)"
              ></aim-table>
            </el-card>
          </div>
          <div v-else-if="isAimFormInput(cellName(fs))">
            <el-card class="box-card" shadow="always">
              <aim-form-input
                  :schema="fs.fields"
                  :data="dataRef[fs.field]"
                  :row-top="getRow()"
                  :parent-key="fs.field"
                  :key="fieldComponentKey(fs)"
                  :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
                  :should-cell-disable="shouldCellDisable"
                  :popup-append-to-body="true"
              ></aim-form-input>
            </el-card>
          </div>
          <div v-else>{{ cellName(fs) }} not supported</div>

          <span v-if="fs.comment" class="aim-form-item-comment">{{ comment(getRow(), fs) }}</span>
          <span v-if="fs.commentHTML" class="aim-form-item-comment" v-html="commentHTML(getRow(),fs)"></span>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

import isString from "@sandwich-go/jsb/isString";
import jsb from "@sandwich-go/jsb";
import {AimFormInputInsert, AimFormInputView, calcLabelWidth, comment, commentHTML} from "./index";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";
import {xidRow} from "@/components/AimTable/table";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import {cellConfigForForm, cellNameForForm} from "@/components/AimTable/cell";
import CellViewAlert from "@/components/cells/CellViewAlert.vue";
import {isAimFormInput, isAimTable} from "@/components/cells/is";
import {isVirtualField} from "@/components/AimTable/schema";

export default {
  name: "AimFormInput",
  components: {
    CellViewAlert,
    CellViewLabelTooltip,
    AimTable: () => import("@/components/AimTable/index.vue"),
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
    }
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
    }
  },
  methods: {
    isAimFormInput,
    isAimTable,
    commentHTML,
    comment,
    isString,
    processSchema() {
      if (!this.dataRef) {
        return
      }
      this.fieldsCommon = []
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
          _this.$watch(`dataRef.${fs.field}`,function (valNew,valOld){
            watch({row:this.data,valOld:valOld,valNew:valNew})
          })
        }
      })
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
  display: flex;
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