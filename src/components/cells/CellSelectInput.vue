<template>
  <div style="display: inline-flex;width: 100%">
    <!--fixme v-bind="$attrs"无效？-->
    <cell-select
        :data="data"
        :field-name="fieldName"
        :options="options"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
    <span style="padding-left: 3px;padding-right: 3px">&#8646;</span>
    <cell-input
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
import CellSelect from "@/components/cells/CellSelect.vue";
import CellInput from "@/components/cells/CellInput.vue";

export default {
  name: 'CellSelectInput',
  components: {CellInput, CellSelect},
  mixins: [MixinCellEditorConfig],
}
</script>

