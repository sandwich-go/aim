<template>
  <div>
    <aim-drawer v-if="cc.wrapper.type==='drawer'"
                :config=cc.wrapper.config
                :is-show.sync="dialogVisible">
      <template v-slot:aim-drawer-body>
        <slot name="target"
              :cc="cc"
              :field-schema="fieldSchema"
              :data="dataRef"
              :field-name="fieldName"
        />
      </template>
    </aim-drawer>
    <el-dialog
        v-else
        modal
        width="80%"
        :close-on-press-escape="true"
        :append-to-body="true"
        :destroy-on-close="true"
        :visible.sync="dialogVisible">
      <slot name="target"
            :cc="cc"
            :field-schema="fieldSchema"
            :data="dataRef"
            :field-name="fieldName"
      />
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
import CellViewIcon from "@/components/cells/CellViewIcon.vue";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";
import AimDrawer from "@/components/AimDrawer/index.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'CellTrigger',
  components: {AimDrawer, CellViewLabel, CellViewIcon},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.cc.trigger = jsb.objectAssignNX(this.cc.trigger, {
      isButton: false,
      icon: 'el-icon-view',
    })
    this.cc.wrapper = jsb.objectAssignNX(this.cc.wrapper, {
      type:'drawer',
      config:{
        direction:'ltr',
        size:'80%'
      },
    })
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
}
</script>
