<script>
import MixinPager from "@/components/AimTable/mixins/MixinPager.vue";
import jsb from "@sandwich-go/jsb";
import {AimFormInputModeView} from "@/components/AimFormInput";
import {xidRow} from "@/components/AimTable/table";

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
      rowEditorMode: AimFormInputModeView,
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