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
        :rules="rulesRef"
        ref="form"
        show-message
        label-position="right"
        size="mini"
    >
      <template v-for="(fs) in schema">
        <el-form-item :key="fs.field" :label="formLabel(fs)" :prop="fs.field" :ref="fs.field">
          <span :set="celllName = cellFormName(fs,getRow())">
            <div class="cg-component-flex-start" v-if="celllName && registeredComponentMap[celllName]">
              <component
                  :is="registeredComponentMap[celllName]"
                  :data="data"
                  :field-name="fs.field"
                  :options="fs.options || []"
                  :style-base="{width:'100%'}"
                  :cell-config="cellFormConfig(fs)"
                  :disabled="privateShouldFieldDisable(fs)"
                  :key="`fom_component_field_${fs.field}`"
              ></component>
            </div>
          </span>
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
} from "@/components/CgFormInput/index";
import CgAlert from "@/components/cells/CgAlert.vue";
import {isString} from "xe-utils";
import {cellFormConfig, cellFormName} from "@/components/CgTable/cell";

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
    rules:Object,
    shouldFieldDisable:Function,
    // 最外层调用不要设定rowTop,递归时传递到最底层便于统一回调外层
    rowTop:Object,
    labelWidth:String,
  },
  data() {
    return {
      labelWidthPixel: this.labelWidth || calcLabelWidth(this.schema),
      //fixme 需要table打入rules,独立使用CgForm的时候需要根据schema更新rules
      rulesRef:this.rules,
    }
  },
  created() {
  },
  methods: {
    cellFormConfig,
    cellFormName,
    isString,
    getRow() {
      if (!this.rowTop) {
        return this.data
      }
      return this.rowTop
    },
    formLabel(si) {
      return jsb.pathGet(si, 'nameForm', si['name'])
    },
    validate(validCallback){
      this.$refs['form'].validate((valid) => {
        if(valid){
          validCallback()
        }
      })
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