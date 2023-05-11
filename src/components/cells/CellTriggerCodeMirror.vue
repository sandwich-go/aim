<template>
  <cell-trigger :cell-config="cellConfig" :field-name="fieldName" :field-schema="fieldSchema" :data="dataRef">
    <template v-slot:target>
      <cell-code-mirror
          :cell-config="cellConfig"
          :data="dataRef"
          :field-schema="fieldSchema"
          :formatter="formatter"
          :field-name="fieldName"
      ></cell-code-mirror>
    </template>
  </cell-trigger>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellTrigger from "@/components/cells/CellTrigger.vue";
import CellCodeMirror from "@/components/cells/CellCodeMirror.vue";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellTriggerCodeMirror',
  components: {CellCodeMirror, CellTrigger},
  mixins: [MixinCellEditorConfig],
  created() {
    this.ccConfigMerge()
    this.cc.codeMirrorConfig = jsb.objectAssignNX(this.cc.codeMirrorConfig, {
      popupAppendToBody:true,
    })
  },
}
</script>
