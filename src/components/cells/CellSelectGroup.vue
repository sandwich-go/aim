<template>
  <div  style="display: inline-flex;width: 100%;gap: 2px">
    <el-select
        :style="cc.style"
        v-model="dataRef[fieldName]"
        :disabled="disabled"
        :clearable="cc.hasOwnProperty('clearable')?cc.clearable:true"
        :loading="inOptionLoading"
        size="mini"
        :value-key="optionValueKey"
        @change="change">
      <el-option-group
          v-for="group in optionsUsing"
          :key="group.label"
          :label="group.label">
        <el-option
            v-for="optionItem in group.options"
            :key=optionKey(optionItem)
            :label="optionItem.label"
            :disabled="optionItem.disabled"
            :value="optionItem.value">
          <span>{{ optionItem.label }}</span>
          <span v-if="optionItem.comment" style="float:right;right: 0;gap: 3px;color:dodgerblue;font-size:12px" v-html="optionItem.comment"/>
        </el-option>
      </el-option-group>
    </el-select>
    <el-button v-if="optionsRefresh" size="mini" circle icon="el-icon-refresh" @click="manualFetchOptionsData"></el-button>
  </div>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellSelectGroup',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
  methods:{
    optionKey(option){
      return option.key || jsb.isObjectOrMap(option.value)?option.value[this.optionValueKey]:option.value
    },
  }
}
</script>
