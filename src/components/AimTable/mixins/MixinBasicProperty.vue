<script>

import {headerBackgroundColor, headerColor} from "@/components/AimTable/style";

const jsb = require("@sandwich-go/jsb")
import {removeCtrlData} from "@/components/AimTable/table";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {AimTableAutoWidthClass} from "@/components/AimTable/AutoWidth";

export default {
  name: 'MixinBasicProperty',
  mixins:[CreateMixinState()],
  props: {
    readOnly:Boolean,
    tableDivStyle: Object,
    cellStyle: [Function,Object],
    rowStyle: [Function,Object],
    rowClassName:[Function,String],
    tableProperty: Object,
    shouldCellDisable: [Array, Function],
    shouldCellHide: [Array, Function],
    toastError: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc.toastError(title, {timeout: timeout || 5000, body, id, config})
      }
    },
    toastWarning: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc.toastWarning(title, {timeout: timeout || 3000, body, id, config})
      }
    },
    toastSuccess: {
      type: Function,
      default: function (title, {body, id, timeout, config} = {}) {
        jsb.cc.toastSuccess(title, {timeout: timeout || 3000, body, id, config})
      }
    },
  },
  data() {
    return {
      tablePropertyRef: this.tableProperty||{},
    }
  },
  created() {
    jsb.objectAssignNX(this.tablePropertyRef, {
      divStyle:{'padding-top':'9px'},
      autoWidth: false,
      border: true,
      stripe: true,
      class:['aim-table-mini-padding'],
      showHeader: true,
      highlightCurrentRow: true,
      headerCellStyle: {textAlign: 'center', padding: '0', color: headerColor, background: headerBackgroundColor},
      emptyText: '',
      height: null,
      heightSubVH: 0,
    })
    if(this.tablePropertyRef.autoWidth){
      this.tablePropertyRef.class.push(AimTableAutoWidthClass)
    }
    this.debug && this.setDebugMessage("tableProperty",JSON.stringify(this.tablePropertyRef))
  },
  methods: {
    // getSelectionRowList 获取选中行，包含__xx_tmp数据
    getSelectionRows(clean=false) {
      if(this.radio){
        if(!this.radioRow){
          return []
        }
        return [clean?removeCtrlData(jsb.clone(this.radioRow)):this.radioRow]
      }
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
      return this.cellStyle ? this.cellStyle({row, column, fieldSchema: fs}) : {padding:'1px'};
    },
  }
}
</script>
