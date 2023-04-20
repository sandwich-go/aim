<script>
import Sortable from "sortablejs";
import {CreateMixinState} from "@/components/CgTable/mixins/CreateMixinState";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinDray',
  mixins:[CreateMixinState()],
  props: {
    dragConfig: Object,
  },
  data() {
    return {
      // 如果未传递dragConfig则认为禁用拖拽
      dragConfigRef: this.dragConfig || {row:false,column:false},
      rowSortableObj:null
    }
  },
  created() {
    jsb.objectAssignNX(this.dragConfigRef, {
      row: true,
      icon: true,
      header: '',
      headerTips: '',
    })
    if(this.dragConfigRef.row){
      this.$nextTick(() => {
        this.rowSortableObj = this.enableRowDrag(this.getTableRef(), this.tableData)
      })
    }
  },
  methods: {
    enableRowDrag(tableRef,tableData){
      const el = tableRef.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      return Sortable.create(el, {
        ghostClass: 'sortable-ghost', // el-talbe fixed模式下会导致这个效果失效，导致操作不明显
        animation: 100,
        setData: function (dataTransfer) {
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = tableData.splice(evt.oldIndex, 1)[0]
          tableData.splice(evt.newIndex, 0, targetRow)
        }
      })
    }
  }
}
</script>
