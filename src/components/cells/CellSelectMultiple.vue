<template>
  <div  style="display: inline-flex;width: 100%;gap: 2px">
    <el-select
        v-model="dataRef[fieldName]"
        multiple
        size="mini"
        :style="cc.style"
        filterable
        :loading="inOptionLoading"
        :value-key="optionValueKey"
        default-first-option
        :disabled="disabled"
        :placeholder="placeholder"
        :allow-create="allowCreate"
        :clearable="cc.hasOwnProperty('clearable')?cc.clearable:true"
        @change="change">
      <el-option v-for="val in optionsUsing"
                 :value="val.value"
                 :key="optionKey(val)"
                 :disabled="val.disabled"
                 :label="val.label">
        <span>{{ val.label }}</span>
        <span v-if="val.comment" style="float:right;right: 0;gap: 3px;color:#707070;font-size:12px" v-html="val.comment"/>
      </el-option>
    </el-select>
    <el-button v-if="optionsRefresh" size="mini" circle icon="el-icon-refresh" @click="manualFetchOptionsData"></el-button>
  </div>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellSelectMultiple',
  mixins: [MixinCellEditorConfig],
  methods: {
    optionKey(option) {
      return option.key || jsb.isObjectOrMap(option.value) ? option.value[this.optionValueKey] : option.value
    },
  },
  props:{
    allowCreate:{
      type:Boolean,
    },
  },
  computed:{
    placeholder(){
      if(this.cc.placeholder){
        return this.cc.placeholder
      }
      return this.allowCreate?'请选择或者输入':'请选择'
    }
  },
  created() {
    this.ccConfigMerge({
      style:{},
    })
    this.calcWidthPixString("100%")
  },
}
</script>
