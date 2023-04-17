<template>
  <div style="display: inline-flex;width: 100%">
    <cg-select
        :data="data"
        :field-name="fieldName"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
    <span style="padding-left: 3px;padding-right: 3px">↔️</span>
    <cg-input
        :data="data"
        :field-name="fieldName"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/types/mixins/MixinCellEditorConfig.vue";
import CgSelect from "@/components/types/CgSelect.vue";
import CgInput from "@/components/types/CgInput.vue";

export default {
  name: 'CgSelectInput',
  components: {CgSelect,CgInput},
  mixins: [MixinCellEditorConfig],
}
</script>

