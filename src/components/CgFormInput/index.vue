<template>
  <div>
    <cg-alert v-if="alertInfo"
                :center="true"
                style="position: sticky;font-weight: bold;top:0;margin-bottom: 9px;z-index: 1000000;"
                :cell-config="isString(alertInfo)?{title:alertInfo}:alertInfo"></cg-alert>
    <el-form
        v-if="data"
        :model="data"
        :label-width="labelWidthPixel"
        :rules="rules"
        ref="form"
        show-message
        label-position="right"
        size="mini"
    >
      <template v-for="(fs) in schema">
        <el-form-item :key="fs.field" :label="siName(fs)" :prop="fs.field" :ref="fs.field">
          <div class="cg-component-flex-start" v-if="siSlot(fs) && registeredComponentMap[siSlot(fs)]">
            <component
                :is="registeredComponentMap[siSlot(fs)]"
                :data="data"
                :field-name="fs.field"
                :style-base="{width:'100%'}"
                :options="fs.options || []"
                :cell-config="formInputConfig(fs)"
                :disabled="privateShouldFieldDisable(fs)"
                :key="`fom_component_field_${fs.field}`"
            ></component>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {
  calcLabelWidth,
  CgFormInputModeInsert,
  CgFormInputModeView,
  formInputConfig
} from "@/components/CgFormInput/index";
import CgAlert from "@/components/types/CgAlert.vue";
import {isString} from "xe-utils";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgFormInput",
  components: {CgAlert},
  mixins:[mixinComponentMap],
  props: {
    schema: Array, // 行schema信息
    data: Object,  // 当前行数据
    mode:String,   // 编辑模式
    alertInfo:{
      type:[Object,String],
      default:null,
    },
    shouldFieldDisable:Function,
    // 最外层调用不要设定rowTop,递归时传递到最底层便于统一回调外层
    rowTop:Object,
    labelWidth:String,
  },
  data() {
    return {
      labelWidthPixel: this.labelWidth || calcLabelWidth(this.schema),
      rules: {},
    }
  },
  methods: {
    isString,
    formInputConfig,
    getRow() {
      if (!this.rowTop) {
        return this.data
      }
      return this.rowTop
    },
    siSlot(si) {
      return jsb.pathGet(si, 'slotForm', si['slot'])
    },
    siName(si) {
      return jsb.pathGet(si, 'nameForm', si['name'])
    },
    privateShouldFieldHide({fieldSchema}){
      // 是否在form中隐藏
      return jsb.pathGet(fieldSchema,'formHide',false)
    },
    privateShouldFieldDisable(fieldSchema){
      if(this.mode === CgFormInputModeView){
        return true
      }
      // 只读属性，如id等依赖服务器返回，只展现不允许编辑
      if(jsb.pathGet(fieldSchema,'readOnly',false)){
        return true
      }
      if(jsb.pathGet(fieldSchema,'insertOnly',false)){
        // 只允许插入时有效，创建后不允许编辑
        return this.mode !== CgFormInputModeInsert
      }
      return this.shouldFieldDisable({fieldSchema,row:this.getRow()})
    },
  }
}
</script>

<style>
.cg-component-flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  z-index: 10;
}
.cg-component-flex-end {
  @extend .cg-component-flex-start;
  justify-content: flex-end;
}
</style>