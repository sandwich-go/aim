<template>
  <div  style="display: inline-flex;width: 100%;gap: 2px">
    <el-select
        v-model="dataRef[fieldName]"
        multiple
        size="mini"
        :style="cc.style"
        filterable
        :loading="inOptionLoading"
        default-first-option
        :disabled="disabled"
        clearable
        @change="change">
      <el-option v-for="val in optionsUsing"
                 :value="val.value"
                 :key="val.key || val.value"
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

export default {
  name: 'CellSelectMultiple',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      style:{},
    })
    this.calcWidthPixString("100%")
  },
}
</script>
