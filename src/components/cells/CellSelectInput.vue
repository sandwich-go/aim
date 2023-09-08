<template>
  <div style="display: inline-flex;width: 100%">
    <cell-select v-bind="$props"/>
    <span style="padding-left: 3px;padding-right: 3px">&#8646;</span>
    <cell-input  v-bind="$props"/>
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

