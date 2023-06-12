<template>
  <cell-trigger
      :cell-config="cc"
      :field-name="fieldName"
      :field-schema="fieldSchema"
      :data="dataRef"
      @code-cell-click="({code,jsEvent})=>emitClickWithCode(jsEvent,code)">
    <template v-slot:target>
      <aim-table
          ref="aimTable"
          :schema="fieldSchema['fields']"
          v-bind="cc.table"
      ></aim-table>
    </template>
  </cell-trigger>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import CellTrigger from "@/components/cells/CellTrigger.vue";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/code";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTable from "@/components/AimTable/index.vue";

export default {
  name: 'CellTriggerFormInput',
  components: {AimTable, CellTrigger},
  mixins: [MixinCell],
  created() {
    this.ccMerge()
    // tableConfig以cc本地数据为源，防止被多行数据共享
    this.cc.table = Object.assign({
      righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
      proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, this.fieldName),
      selection:true,
      popupAppendToBody:true,
    },this.cc.table)
  },
}
</script>
