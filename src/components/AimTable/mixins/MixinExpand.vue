<script>
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinExpand',
  mixins:[CreateMixinState()],
  props: {
    expandConfig: Object,
  },
  data() {
    return {
      expandConfigRef: this.expandConfig || {},
      isExpandAll:false,
    }
  },
  created() {
    jsb.objectAssignNX(this.expandConfigRef, {
      isHTML: false,
      // eslint-disable-next-line no-unused-vars
      expandContent: function ({row}) {
        return JSON.stringify(row)
      }
    })
  },
  methods:{
    expandAll(tableData,tableRef){
      this.isExpandAll = !this.isExpandAll
      jsb.each(tableData,(row)=>{
        tableRef.toggleRowExpansion(row,this.isExpandAll )
      })
    }
  }
}
</script>
