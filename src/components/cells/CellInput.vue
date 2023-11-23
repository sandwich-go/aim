<template>
  <div :class="divClass()" :style="divStyle()">
    <el-input
        v-model="dataRef[fieldName]"
        v-bind="cc"
        :disabled="disabled"
        @change="change"
        size="mini"
    ></el-input>
    <div style="padding-left: 3px;display:inline-flex;align-items: center">
      <template v-if="asImage">
        <cell-trigger-image-select
            v-if="options"
            :cell-config="cellConfig"
            :field-schema="fieldSchema"
            :field-name="fieldName"
            :data="data"
            :disabled="disabled"
            :options="options"
            :popup-append-to-body="true"
        ></cell-trigger-image-select>
        <cell-view-image
            v-else
            :cell-config="cellConfig"
            :field-schema="fieldSchema"
            :field-name="fieldName"
            :data="data"
            :disabled="disabled"
            :options="options"
            :popup-append-to-body="true"></cell-view-image>
      </template>
      <cell-view-image
          v-else-if="isValidImageUrl(dataRef[fieldName])"
          :cell-config="cellConfig"
          :field-schema="fieldSchema"
          :field-name="fieldName"
          :data="data"
          :disabled="disabled"
          :options="options"
          :popup-append-to-body="true"></cell-view-image>
    </div>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellTriggerImageSelect from "@/components/cells/CellTriggerImageSelect.vue";
import CellViewImage from "@/components/cells/CellViewImage.vue";

export default {
  name: 'CellInput',
  components: {CellViewImage, CellTriggerImageSelect},
  mixins: [MixinCellEditorConfig],
  props:{
    asImage:Boolean,
  },
  created() {
    this.ccConfigMerge()
  },
  methods:{
    divClass(){
      return this.calcWidthPixString()?'cell-input-with-width':''
    },
    divStyle(){
      return {
        '--input-width':this.calcWidthPixString() || '100%',
        width: "100%",
        display:'inline-flex',
      }
    },
    isValidImageUrl(url) {
      if(!url){
        return false
      }
      // 通过文件后缀判断是否是图像
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      const extension = String(url).split('.').pop().toLowerCase();
      return imageExtensions.includes(extension);
    },
  }
}
</script>

<style scoped>
.cell-input-with-width >>> .el-input {
  width: var(--input-width) !important;
}
</style>