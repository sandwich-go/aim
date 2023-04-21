<script>

const jsb = require("@sandwich-go/jsb")
import {headerBackgroundColor, headerColor} from "@/components/CgTable/default";
import {removeCtrlData} from "@/components/CgTable/table";
import {CreateMixinState} from "@/components/CgTable/mixins/CreateMixinState";

export default {
  name: 'MixinBasicProperty',
  mixins:[CreateMixinState()],
  props: {
    tableDivStyle: Object,
    cellStyle: Function,
    rowStyle: Function,
    tableProperty: Object,
    shouldCellDisable: [Array, Function],
    shouldCellHide: [Array, Function],
    toastError: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastError(title, {timeout: timeout || 5000, body, id, config})
      }
    },
    toastWarning: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastWarning(title, {timeout: timeout || 3000, body, id, config})
      }
    },
    toastSuccess: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc().toastSuccess(title, {timeout: timeout || 3000, body, id, config})
      }
    },
  },
  data() {
    return {
      tablePropertyRef: this.tableProperty,
    }
  },
  created() {
    jsb.objectAssignNX(this.tablePropertyRef, {
      autoWidth: true,
      border: true,
      stripe: true,
      class: 'cg-table-small-padding',
      showHeader: true,
      highlightCurrentRow: true,
      headerCellStyle: {textAlign: 'center', padding: '0', color: headerColor, background: headerBackgroundColor},
      emptyText: '',
      // rowStyle: {height: "30px", 'padding':0},// object of function
      height: null,
      heightSubVH: 0,
    })
  },
  methods: {
    // getSelectionRowList 获取选中行，包含__xx_tmp数据
    getSelectionRows(clean=false) {
      return clean?removeCtrlData(jsb.clone(this.getTableRef().selection)):this.getTableRef().selection
    },
    // 每一个cell的属性
    cellStyleWrapper({row, column}) {
      const fs = jsb.find(this.schema, fs => fs.field === column.property)
      if (fs && fs['columnStyle']) {
        return fs['columnStyle']
      }
      if (fs && fs['backgroundAsHeader']) {
        return {background: headerBackgroundColor}
      }
      return this.cellStyle ? this.cellStyle({row, column, fieldSchema: fs}) : null;
    },
  }
}
</script>
