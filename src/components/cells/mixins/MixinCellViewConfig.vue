<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinCellViewConfig',
  mixins: [MixinCellEditorConfig],
  computed: {
    fieldValue() {
      return (jsb.isEmpty(this.cellConfig) && jsb.isPlainObject(this.cellConfig)) ? this.fieldValueFormatted() : this.cellConfig
    },
  },
  methods:{
    fieldValueFormatted(){
      return this.formatter ? this.formatter({value:jsb.pathGet(this.data, this.fieldName),row:this.data}) : jsb.pathGet(this.data, this.fieldName)
    },
  }
}
</script>
