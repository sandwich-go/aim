<template>
  <div>
    <el-dialog
        modal
        width="80%"
        :close-on-press-escape="true"
        :append-to-body="true"
        :destroy-on-close="true"
        :visible.sync="dialogVisible">
      <aim-form-input
          :schema="fieldSchema['fields']"
          :data="dataRef[fieldName]"
          v-bind="cc.formConfig"
      ></aim-form-input>
    </el-dialog>
    <template v-if="!!cc.trigger.isButton">
      <el-button
          :disabled="disabled"
          size="mini"
          v-bind="cc.trigger"
          @click="()=>{dialogVisible = true}"
      >
        <template v-if="!cc.trigger.circle">{{ cc.trigger.label ? cc.trigger.label : "" }}</template>
      </el-button>
    </template>
    <template v-else>
      <el-link :type="cc.trigger.type || 'primary'" @click="()=>{dialogVisible = true}">
        <cell-view-icon v-if="cc.trigger.icon" :cell-config="cc.trigger.icon"/>
        <cell-view-label v-if="cc.trigger.label" :cell-config="cc.trigger.label" style="padding-left: 3px"/>
      </el-link>
    </template>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import {CodeButtonAdd, CodeButtonRowSelectedMinus} from "@/components/cells/const";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";
import AimFormInput from "@/components/AimFormInput/index.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'CellTriggerFormInput',
  components: {AimFormInput, CellViewLabel, CellViewIcon},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.cc.formConfig = jsb.objectAssignNX(this.cc.formConfig, {
      popupAppendToBody:true,
    })
    this.cc.trigger = jsb.objectAssignNX(this.cc.trigger,{
      isButton:false,
      icon:'el-icon-edit',
    })
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
