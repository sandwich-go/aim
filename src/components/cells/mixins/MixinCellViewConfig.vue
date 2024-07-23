<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: 'MixinCellViewConfig',
  mixins: [MixinCellEditorConfig],
  computed: {
    // fixme 这里的逻辑有点乱，将 cell 的配置与数据混在了一起，需要分离重构
    fieldValue() {
      if(jsb.isNull(this.cellConfig)) {
        return this.fieldValueFormatted
      }
      if(this.cellConfig && this.cellConfig.formatter){
        return this.fieldValueFormatted
      }
      if(jsb.isEmpty(this.cellConfig) && jsb.isPlainObject(this.cellConfig)){
        return this.fieldValueFormatted
      }
      return this.cellConfig
    },
    fieldValueFormatted(){
      return this.formatter ? this.formatter({value:jsb.pathGet(this.data, this.fieldName),row:this.data}) : jsb.pathGet(this.data, this.fieldName)
    },
  },
}
</script>
