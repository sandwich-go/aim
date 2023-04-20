<template>
  <div>
    <cg-table
        :schema="schema"
        :proxy-config="proxyConfig"
        :table-property="{autoWidth:true}"
        :popup-append-to-body="true"
        :edit-config="{rowEditor: RowEditorInplace,trigger:EditTriggerInplaceNone()}"
    ></cg-table>
  </div>
</template>

<script>

import {CellNameInput, CellNameSelect, CellNameSwitch, CellNameTag} from "@/components/cells/const";
import {EditTriggerInplaceNone, RowEditorInplace} from "@/components/CgTable/table";

const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CgTableEditor',
  components: {
    CgTable: () => import("@/components/CgTable/index.vue"),
  },
  props: {
    fieldSchema: Array,
  },
  methods: {
    EditTriggerInplaceNone() {
      return EditTriggerInplaceNone
    },
    cellNameTag({fieldValue}, dVal = CellNameInput) {
      return jsb.isFunction(fieldValue) ? {label: 'Function', type: 'warning'} : (fieldValue || dVal)
    }
  },
  data() {
    const _this = this
    return {
      RowEditorInplace,
      schema: [
        {field: 'field', name: '字段名', width: 200},
        {field: 'name', name: '名称',  width: 200},
        {
          field: 'cellTableName',
          name: 'Table显示/编辑组件',
          cellTableName: CellNameTag,
          cellTable: _this.cellNameTag,
          width: 200
        },
        {
          field: 'cellFormName',
          name: 'Form编辑组件',
          cellTableName: CellNameTag,
          cellTable: _this.cellNameTag,
          width: 200
        },
        {field: 'hide', name: '默认隐藏', cellTableName: CellNameSwitch,width:100},
        {field: 'groupCouldView', width: 300, name: '可查看(组)',cellTableName: CellNameSelect},
        {field: 'groupCouldEdit', width: 300, name: '可编辑(组)',cellTableName: CellNameSelect},
        {field: 'userCouldView', width: 300, name: '可查看(人)',cellTableName: CellNameSelect},
        {field: 'userCouldEdit', width: 300, name: '可编辑(人)',cellTableName: CellNameSelect},
        {field: 'tips', width: 300, name: 'Table字段说明',cellTableName: CellNameInput},
      ],
      proxyConfig: {
        query() {
          return {Data: _this.fieldSchema}
        }
      }
    }
  }
}
</script>