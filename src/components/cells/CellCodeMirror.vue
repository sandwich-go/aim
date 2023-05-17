<template>
  <aim-code-mirror
      :code="dataRef[fieldName]"
      :popup-append-to-body="true"
      :code-change="codeChange"
      v-bind="cc.codeMirror"
  ></aim-code-mirror>
</template>

<script>
import AimCodeMirror from "@/components/AimCodeMirror/index.vue";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellCodeMirror',
  mixins: [MixinCellEditorConfig],
  components: {AimCodeMirror},
  created() {
    this.ccConfigMerge()
    this.cc.codeMirror = jsb.objectAssignNX(this.cc.codeMirror, {
      popupAppendToBody:true,
    })
    console.log()
  },
  methods:{
    codeChange(code){
      this.dataRef[this.fieldName] = code
    }
  }
}
</script>
