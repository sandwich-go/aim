<template>
  <div :class="divClass()" :style="divStyle()">
    <el-input
        v-model="dataRef[fieldName]"
        v-bind="cc"
        :disabled="disabled"
        @change="change"
        size="mini"
    ></el-input>
    <cell-view-image
        v-if="asImage  || isValidImageUrl(dataRef[fieldName])"
        :cell-config="cellConfig"
        :field-schema="fieldSchema"
        :field-name="fieldName"
        :data="data"
        :disabled="disabled"
    ></cell-view-image>
  </div>
</template>

<script>
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
import CellViewImage from "@/components/cells/CellViewImage.vue";

export default {
  name: 'CellInput',
  components: {CellViewImage},
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
        display:'inline-flex'
      }
    },
    isValidImageUrl(url) {
      // 验证URL的合法性
      const pattern = new RegExp('^(https?:\\/\\/)?' +
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
          '((\\d{1,3}\\.){3}\\d{1,3}))' +
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
          '(\\?[;&a-z\\d%_.~+=-]*)?' +
          '(\\#[-a-z\\d_]*)?$', 'i');
      if (!pattern.test(url)) {
        return false;
      }
      // 通过文件后缀判断是否是图像
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
      const extension = url.split('.').pop().toLowerCase();
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