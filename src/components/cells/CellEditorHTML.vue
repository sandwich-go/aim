<template>
  <aim-tinymce
      v-model="dataRef[fieldName]"
      width="99%"
  />
</template>

<script>
import AimTinymce from "@/components/AimTinymce/index.vue";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellEditorHTML',
  mixins: [MixinCellEditorConfig],
  components: {AimTinymce},
}
</script>