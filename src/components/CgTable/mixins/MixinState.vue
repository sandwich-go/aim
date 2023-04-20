<script>
import MixinPager from "@/components/CgTable/mixins/MixinPager.vue";
import jsb from "@sandwich-go/jsb";
import {CgFormInputModeView} from "@/components/CgFormInput";
import {xidRow} from "@/components/CgTable/table";

export default {
  name: 'MixinState',
  mixins: [MixinPager],
  props: {
    debug: Boolean,
    schema:Array,
    readOnly: Boolean,
  },
  data() {
    return {
      stateXID: jsb.xid(),
      tableData: [],
      currentRow: null,
      rowInEdit: null,
      rowFormEditorVisible: false,
      inLoading: false,
      debugMessage: '',
      rowEditorAlert: null,
      rowEditorMode: CgFormInputModeView,
    }
  },
  methods: {
    getTableRef() {
      return this.$refs.table
    },
    thisTarget() {
      return this
    },
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