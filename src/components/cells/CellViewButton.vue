<template>
  <el-button :disabled="disabled"
             v-bind="cc"
             size="mini" @click="click($event)"
             :icon="stateSwitch?(cc.iconTrue||cc.icon):cc.icon"
             :type="stateSwitch?(cc.typeTrue||cc.type):cc.type"
  >
    <svg-icon v-if="cc.svg" :icon-class="cc.svg" :style="{'padding-right':cc.circle || !cc.label?'0px':'3px'}" />
    <template v-if="!cc.circle">{{ cc.label ? cc.label : "" }}</template>
  </el-button>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
export default {
  name: 'CellViewButton',
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
  },
  methods:{
    click(jsEvent) {
      this.stateSwitch = !this.stateSwitch
      this.emitClick(jsEvent)
    },
  },
  data(){
    return {
      stateSwitch:false
    }
  },
}
</script>
