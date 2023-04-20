<script>
const jsb = require("@sandwich-go/jsb")
import {headerBackgroundColor, headerColor} from "@/components/CgTable/default";

export default {
  name: 'MixinBasicProperty',
  props: {
    tableDivStyle: Object,
    cellStyle: Function,
    rowStyle: Function,
    tableProperty: Object,
    // eslint-disable-next-line no-unused-vars
    shouldCellDisable: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
        return false
      },
    },
    // eslint-disable-next-line no-unused-vars
    shouldCellHide: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code, scope}) {
        return false
      },
    },
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
  methods:{
    privateShouldCellDisable({code, scope}) {
      if (scope.disable || scope.disabled) {
        return true
      }
      if (!this.shouldCellDisable) {
        return false
      }
      return this.shouldCellDisable({code, scope})
    },
    privateShouldCellHide({code, scope}) {
      if (scope.hide || jsb.pathGet(scope, 'show', true)) {
        return true
      }
      if (!this.shouldCellHide) {
        return false
      }
      return this.shouldCellHide({code, scope})
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
