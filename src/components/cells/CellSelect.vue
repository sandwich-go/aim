<template>
  <div  style="display: inline-flex;width: 100%;gap: 2px;">
    <cell-select-group
        v-bind="$props"
        v-if="isOptionsGroup()">
    </cell-select-group>
    <template v-else>
      <el-select
          v-model="dataRef[fieldName]"
          :disabled="disabled"
          :style="cc.style"
          :loading="inOptionLoading"
          :value-key="valueKeyEnable?'value':null"
          size="mini"
          clearable
          @change="change">
        <el-option
            v-for="option in optionsUsing"
            :key="option.key || option.value"
            :label="option.label"
            :disabled="option.disabled"
            :value="option.value">
          <span>{{ option.label }}</span>
          <span v-if="option.comment" style="float:right;right: 0;gap: 3px;color:#707070;font-size:12px" v-html="option.comment"/>
        </el-option>
      </el-select>
      <el-button v-if="optionsRefresh" size="mini" circle icon="el-icon-refresh" @click="manualFetchOptionsData"></el-button>
    </template>
  </div>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellSelectGroup from "@/components/cells/CellSelectGroup.vue";
import jsb from "@sandwich-go/jsb";
export default {
  name: 'CellSelect',
  components: {CellSelectGroup},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.calcWidthPixString("100%")
    jsb.each(this.optionsUsing,option=>{
     if(jsb.isObjectOrMap(option.value)){
        this.valueKeyEnable = true
      }
    })
  },
  data(){
    return {
      valueKeyEnable:false,
    }
  },
  methods:{
    isOptionsGroup(){
      const options  = this.optionsUsing
      const firstElement = options[0] || {}
      return !!firstElement['options'];
    }
  }
}
</script>
