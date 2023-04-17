<template>
  <div style="display: inline-flex;width: 100%">
    <!--fixme v-bind="$attrs"无效？-->
    <cg-select
        :data="data"
        :field-name="fieldName"
        :options="options"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
    <span style="padding-left: 3px;padding-right: 3px">↔️</span>
    <cg-input
        :data="data"
        :field-name="fieldName"
        :options="options"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CgSelect from "@/components/cells/CgSelect.vue";
import CgInput from "@/components/cells/CgInput.vue";

export default {
  name: 'CgSelectInput',
  components: {CgSelect,CgInput},
  mixins: [MixinCellEditorConfig],
}
</script>

