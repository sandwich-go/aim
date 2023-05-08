<template>
  <cell-trigger :cell-config="cc" :field-name="fieldName" :field-schema="fieldSchema" :data="dataRef">
    <template v-slot:aimTable>
      <aim-table
          ref="aimTable"
          :schema="fieldSchema['fields']"
          v-bind="cc.tableConfig"
      ></aim-table>
    </template>
  </cell-trigger>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellTrigger from "@/components/cells/CellTrigger.vue";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTable from "@/components/AimTable/index.vue";

export default {
  name: 'CellTriggerFormInput',
  components: {AimTable, CellTrigger},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({slot:'aimTable'})
    // tableConfig以cc本地数据为源，防止被多行数据共享
    this.cc.tableConfig = Object.assign({
      righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
      proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, this.fieldName),
      selection:true,
      popupAppendToBody:true,
    },this.cc.tableConfig)
  },
}
</script>
