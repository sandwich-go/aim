<template>
  <span v-if="fieldValue">
    <template style="align-items: center">
      <template v-if="!isObject(fieldValue)">
         <el-link type="primary" :href="fieldValue" target="_blank">{{ fieldValue }}</el-link>
      </template>
      <template v-else-if="fieldValue.code || fieldValue.href">
        <el-link :type="fieldValue.type || 'primary'" @click="emitClick($event)" :href="fieldValue.href" target="_blank">
          <cg-viewer-icon v-if="fieldValue.icon" :cell-config="fieldValue.icon"/>
          <cg-viewer-label v-if="fieldValue.label" :cell-config="fieldValue.label" style="padding-left: 3px"></cg-viewer-label>
        </el-link>
      </template>
    </template>
  </span>
</template>

<script>
import MixinCellViewerConfig from "@/components/cells/mixins/MixinCellViewerConfig.vue";
import CgViewerLabel from "@/components/cells/viewer/CgViewerLabel.vue";
import CgViewerIcon from "@/components/cells/viewer/CgViewerIcon.vue";
import {CellNameLink} from "@/components/cells/const";
import isObject from "@sandwich-go/jsb/isObject";


export default {
  name: CellNameLink,
  components: {CgViewerIcon, CgViewerLabel},
  mixins: [MixinCellViewerConfig],
  methods: {
    isObject,
    emitClick(jsEvent) {
      if(!this.fieldValue.code){
        return
      }
      this.$emit('code-cell-click', this.emitData({
        code: this.fieldValue.code,
        jsEvent:jsEvent,
      }))
    }
  }
}
</script>