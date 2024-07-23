<template>
  <div>
    <aim-popup
        :drawer="cc.wrapper.type==='drawer'"
        :config=cc.wrapper.config
        :is-show.sync="dialogVisible"
    >
      <template v-slot:aim-popup-body>
        <slot name="target"
              :cc="cc"
              :field-schema="fieldSchema"
              :data="dataRef"
              :field-name="fieldName"
        />
      </template>
      <span slot="aim-popup-footer">
        <cell-list
            :style="flexEndStyle"
            :shortcut-button-options="{circle:false}"
            :cells="cc.wrapper.footer"
            :should-cell-hide="()=>{return false}"
            :should-cell-disable="()=>{return false}"
            @code-cell-click="({code,jsEvent})=>emitClickWithCode(jsEvent,code)"
        ></cell-list>
      </span>
    </aim-popup>
    <div style="display:inline-flex;align-items:center">
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
    <slot name="summary"/>
    </div>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";
import CellList from "@/components/cells/CellList.vue";
import {flexEndStyle} from "@/components/AimTable/style";
import {CodeButtonRowSave} from "@/components/cells/const";
import AimPopup from "@/components/AimPopup/index.vue";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: 'CellTrigger',
  computed: {
    flexEndStyle() {
      return flexEndStyle
    }
  },
  props:{
    popupAppendToBody: Boolean
  },
  components: {AimPopup, CellList, CellViewLabel, CellViewIcon},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.cc.trigger = jsb.objectAssignNX(this.cc.trigger, {
      isButton: false,
      icon: 'el-icon-view',
    })
    this.cc.wrapper = jsb.objectAssignNX(this.cc.wrapper, {
      type: 'drawer',
      config: {
        direction: 'ltr',
        size: '80%',
        footer:true,
        appendToBody:this.popupAppendToBody
      },
      footer:[CodeButtonRowSave],
    })
  },
  data() {
    return {
      dialogVisible: false,
    }
  },
}
</script>
