<template>
  <aim-tinymce
      v-model="dataRef[fieldName]"
  />
</template>

<script>
import AimTinymce from "@/components/AimTinymce/index.vue";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

export default {
  name: 'CellEditorHEML',
  mixins: [MixinCellEditorConfig],
  components: {AimTinymce},
}
</script>