<template>
  <cell-trigger :cell-config="cc" :field-name="fieldName" :field-schema="fieldSchema" :data="dataRef">
    <template v-slot:formInput>
      <aim-form-input
          :schema="fieldSchema['fields']"
          :data="dataRef[fieldName]"
          v-bind="cc.formConfig"
      ></aim-form-input>
    </template>
  </cell-trigger>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import AimFormInput from "@/components/AimFormInput/index.vue";
import CellTrigger from "@/components/cells/CellTrigger.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'CellTriggerFormInput',
  components: {CellTrigger, AimFormInput},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge({slot:'formInput'})
    this.cc.formConfig = jsb.objectAssignNX(this.cc.formConfig, {
      popupAppendToBody:true,
    })
  },
}
</script>
