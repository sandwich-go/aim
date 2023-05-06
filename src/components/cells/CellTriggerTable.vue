<template>
  <div>
    <el-dialog
        modal
        width="80%"
        :close-on-press-escape="true"
        :append-to-body="true"
        :destroy-on-close="true"
        :visible.sync="dialogVisible">
      <aim-table
          ref="aimTable"
          :schema="fieldSchema['fields']"
          v-bind="cc.tableConfig"
      ></aim-table>
    </el-dialog>
    <template v-if="!!cc.trigger.isButton">
      <el-button
          :disabled="disabled"
          size="mini"
          v-bind="cc.trigger"
          @click="showTable"
      >
        <template v-if="!cc.trigger.circle">{{ cc.trigger.label ? cc.trigger.label : "" }}</template>
      </el-button>
    </template>
    <template v-else>
      <el-link :type="cc.trigger.type || 'primary'" @click="showTable">
        <cell-view-icon v-if="cc.trigger.icon" :cell-config="cc.trigger.icon"/>
        <cell-view-label v-if="cc.trigger.label" :cell-config="cc.trigger.label" style="padding-left: 3px"></cell-view-label>
      </el-link>
    </template>
  </div>
</template>

<script>

import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import AimTable from "@/components/AimTable/index.vue";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'CellCellTable',
  components: {CellViewLabel, CellViewIcon, AimTable},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    // tableConfig以cc本地数据为源，防止被多行数据共享
    this.cc.tableConfig = Object.assign({
      righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
      proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, this.fieldName),
      selection:true,
      popupAppendToBody:true,
    },this.cc.tableConfig)
    this.cc.trigger = jsb.objectAssignNX(this.cc.trigger,{
      isButton:false,
      icon:'el-icon-edit',
    })
  },
  methods:{
    showTable(){
      this.dialogVisible = true
      this.$nextTick(()=>{
        if(this.$refs.aimTable) {
          this.$refs.aimTable.tryProxyQueryData()
        }
      })
    }
  },
  data() {
    return {
      CodeButtonAdd,
      CodeButtonRowSelectedMinus,
      dialogVisible: false,
    }
  },
}
</script>
