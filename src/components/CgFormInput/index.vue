<template>
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
    <template v-for="(si) in schema">
      <el-form-item :key="si.field" :label="siName(si)" :prop="si.field" :ref="si.field">
        <component
            v-if="siSlot(si) && registeredComponentMap[siSlot(si)]"
            :is="registeredComponentMap[siSlot(si)]"
            :top-row="getRow()"
            :data="data"
            :field-schema="si"
            :disabled="privateShouldFieldDisable(si)"
            :key="`fom_component_field_${si.field}`"
        ></component>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {calcLabelWidth, CgFormInputModeInsert, CgFormInputModeView} from "@/components/CgFormInput/index";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgFormInput",
  mixins:[mixinComponentMap],
  props: {
    schema: Array, // 行schema信息
    data: Object,  // 当前行数据
    mode:String,   // 编辑模式
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
