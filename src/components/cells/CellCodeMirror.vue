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
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";

export default {
  name: 'CellCodeMirror',
  mixins: [MixinCell],
  components: {AimCodeMirror},
  created() {
    this.ccMerge()
    this.cc.codeMirror = jsb.objectAssignNX(this.cc.codeMirror, {
      popupAppendToBody:true,
    })
  },
  methods:{
    codeChange(code){
      this.dataRef[this.fieldName] = code
    }
  }
}
</script>
