<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinCellViewerConfig',
  mixins: [MixinCellEditorConfig],
  computed: {
    fieldValue() {
      return this.cellConfig || jsb.pathGet(this.data,this.fieldName)
    },
  },
}
</script>
