<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinCellViewConfig',
  mixins: [MixinCellEditorConfig],
  computed: {
    fieldValue() {
      return (jsb.isEmpty(this.cellConfig) && jsb.isPlainObject(this.cellConfig))? jsb.pathGet(this.data,this.fieldName):this.cellConfig
    },
  },
}
</script>
