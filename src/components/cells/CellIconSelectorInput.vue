<template>
  <el-popover
      placement="bottom-start"
      trigger="click"
      :style="cc.style"
      :disabled="disabled"
      @show="$refs['iconSelect'].reset()">
    <aim-icon-selector ref="iconSelect" :style="cc.style" :element="cc.element"
                      @selected="selectedIcon"/>
    <el-input slot="reference" :disabled="disabled" size="mini" v-model="dataRef[fieldName]" readonly v-bind="$attrs">
      <i v-if="dataRef[fieldName]" slot="prefix" :class="dataRef[fieldName]" class="el-input__icon"
         style="height: 32px;width: 16px;"/>
    </el-input>
  </el-popover>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import AimIconSelector from "@/components/AimIconSelector/index.vue";

export default {
  name: 'CellIconSelectorInput',
  components: {AimIconSelector},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({
      showLabel: true,
      element: true,
      style:{width:'100%'}
    })
  },
  methods: {
    selectedIcon(name) {
      this.dataRef[this.fieldName] = name
      this.change(name)
    },
  }
}
</script>
