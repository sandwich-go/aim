<template>
  <el-popover
      placement="bottom-start"
      trigger="click"
      :style="cc.style"
      @show="$refs['iconSelect'].reset()">
    <cg-icon-selector ref="iconSelect" :style="cc.style" :element="cc.element"
                      @selected="selectedIcon"/>
    <el-input slot="reference" size="mini" v-model="dataRef[fieldName]" readonly v-bind="$attrs">
      <i v-if="dataRef[fieldName]" slot="prefix" :class="dataRef[fieldName]" class="el-input__icon"
         style="height: 32px;width: 16px;"/>
    </el-input>
  </el-popover>
</template>

<script>
import CgIconSelector from "@/components/CgIconSelector/index.vue";
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";

export default {
  name: 'CgIconSelectorInput',
  components: {
    CgIconSelector,
  },
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      showLabel: true,
      element: true,
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
