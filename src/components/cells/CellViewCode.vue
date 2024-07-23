<template>
  <div v-if="fieldValue">
    <el-popover trigger="hover">
      <aim-code-mirror
          :code="fieldValue"
          :popup-append-to-body="true"
          v-bind="cc.codeMirror"
      ></aim-code-mirror>
      <el-link slot="reference" size="mini" icon="el-icon-document"></el-link>
    </el-popover>
  </div>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import jsb from "@cg-devcenter/jsb";
import AimCodeMirror from "@/components/AimCodeMirror/index.vue";

export default {
  name: "CellViewCode",
  components: {AimCodeMirror},
  mixins: [MixinCellViewConfig],
  created() {
    this.ccConfigMerge()
    this.cc.codeMirror = jsb.objectAssignNX(this.cc.codeMirror, {
      popupAppendToBody:true,
    })
  },
}
</script>