<template>
  <span v-if="cellConfig">
    <template style="align-items: center">
      <template v-if="isString(cellConfig)">
         <el-link type="primary" :href="cellConfig" target="_blank">{{ cellConfig }}</el-link>
      </template>
      <template v-else-if="cellConfig.code || cellConfig.href">
        <el-link :type="cellConfig.type || 'primary'" @click="emitClick($event)" :href="cellConfig.href" target="_blank">
          <cg-viewer-icon v-if="cellConfig.icon" :cell-config="cellConfig.icon"/>
          <cg-viewer-label v-if="cellConfig.label" :cell-config="cellConfig.label" style="padding-left: 3px"></cg-viewer-label>
        </el-link>
      </template>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinCellViewerConfig from "@/components/types/mixins/MixinCellViewerConfig.vue";
import CgViewerLabel from "@/components/types/viewer/CgViewerLabel.vue";
import CgViewerIcon from "@/components/types/viewer/CgViewerIcon.vue";

export default {
  name: "CgViewerLink",
  components: {CgViewerIcon, CgViewerLabel},
  mixins: [MixinCellViewerConfig],
  methods: {
    isString,
    emitClick(jsEvent) {
      if(!this.cellConfig.code){
        return
      }
      this.$emit('code-button-click', this.emitData({
        code: this.cellConfig.code,
        jsEvent:jsEvent,
      }))
    }
  }
}
</script>