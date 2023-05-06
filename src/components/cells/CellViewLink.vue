<template>
  <span v-if="fieldValue">
    <template style="align-items: center">
      <template v-if="!isObject(fieldValue)">
         <el-link type="primary" :href="fieldValue" target="_blank">{{ fieldValue }}</el-link>
      </template>
      <template v-else-if="fieldValue.code || fieldValue.href">
        <el-link :type="fieldValue.type || 'primary'" @click="emitClick($event)" :href="fieldValue.href" target="_blank">
          <cell-view-icon v-if="fieldValue.icon" :cell-config="fieldValue.icon"/>
          <cell-view-label v-if="fieldValue.label" :cell-config="fieldValue.label" style="padding-left: 3px"></cell-view-label>
        </el-link>
      </template>
    </template>
  </span>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";
import isObject from "@sandwich-go/jsb/isObject";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";
import CellViewLabel from "@/components/cells/CellViewLabel.vue";


export default {
  name: 'CellViewLink',
  components: {CellViewLabel, CellViewIcon},
  mixins: [MixinCellViewConfig],
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