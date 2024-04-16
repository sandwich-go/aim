<template>
  <div style="display: inline-flex;width: 100%">
    <cell-select-multiple
        :data="data"
        :field-name="fieldName"
        :options="options"
        :cell-config="cellConfig"
        :style-base="styleBase"
        :style-override="styleOverride"
        filterable
        default-first-option
        allow-create
        :disabled="disabled"/>
<!--    <span style="padding-left: 3px;padding-right: 3px">&#8646;</span>-->
<!--    <aim-tag-editor size="mini" :tags="data[fieldName]" add="+ New Tag" style="width: 50%"/>-->
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellSelectMultiple from "@/components/cells/CellSelectMultiple.vue";

export default {
  name: 'CellSelectMultipleInput',
  components: {CellSelectMultiple},
  mixins: [MixinCellEditorConfig],
}
</script>

