<script>
import MixinPager from "@/components/AimTable/mixins/MixinPager.vue";
import jsb from "@sandwich-go/jsb";
import {AimFormInputView} from "@/components/AimFormInput";
import {xidRow} from "@/components/AimTable/table";

export default {
  name: 'MixinState',
  mixins: [MixinPager],
  props: {
    enableDebug: Boolean,
    schema:Array,
    readOnly: Boolean,
  },
  watch:{
    currentRow:{
      handler(newVal) {
        this.updateRowWatcher(newVal)
      }
    },
    rowInEdit:{
      handler(newVal) {
        this.updateRowWatcher(newVal)
      }
    },
  },
  data() {
    return {
      stateXID: jsb.xid(),
      tableData: [],
      currentRow: null,
      rowInEdit: null,
      rowFormEditorVisible: false,
      inLoading: false,
      rowEditorAlert: null,
      rowEditState: AimFormInputView,
      funcProcessQueryParams: [],
      sortConfigRef:{},

      // schema中抽取而来的filter cell
      filterData:{},
      filterTypeMapping:{},
      debug:this.enableDebug,
    }
  },
  methods: {
    updateRowWatcher(row) {
      //移除老旧watcher
      this.cleanRowWatcher()
      if(!row) {
        return;
      }
      const _this = this
      jsb.each(_this.schema,function (fieldSchema){
        if(!fieldSchema.watch){
          return
        }
        _this.rowWatchFunc(() => row[fieldSchema.field],(newValue, oldValue) => {
          fieldSchema.watch({newValue, oldValue,row})
        });
      })
    },
    getTableRef() {
      return this.$refs.table
    },
    thisTarget() {
      return this
    },
    setLoading(inLoading){this.inLoading = inLoading},
    doLayout() {
      this.$refs.table && this.$refs.table.doLayout()
    },
    summaryRow(row) {
      let info = [`xid(${xidRow(row)})`]
      jsb.each(this.schema, function (fieldSchema) {
        if (fieldSchema.summary) {
          info.push(`${fieldSchema.name}(${row[fieldSchema.field]})`)
        }
      })
      return info.join(" , ")
    }
  },
}
</script>