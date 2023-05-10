<template>
  <el-alert
      size="mini"
      v-bind="cc"
  />
</template>

<script>
import {parseWidthToPixelString} from "@/components/utils/ui";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";
export default {
  name: 'CellViewAlert',
  mixins: [MixinCellEditorConfig],
  props: {
    center: {
      type: Boolean,
      default: null
    },
  },
  created() {
    this.ccConfigMerge({
      label: '',
      title: '',
      center: this.center,
      type: 'warning',
      effect: 'dark',
      style: {height:'28px'},
      closable: false,
      showIcon: true
    })
    this.cc.title = this.cc.title?String(this.cc.title) : String(this.cc.label)
    this.cc.style['height'] = '28px'
    if (this.cc.style['width']) {
      this.cc.style['width'] = parseWidthToPixelString(this.cc.style['width'], this.cc.label || this.cc.title,
          this.cc.showIcon ? 30 : 0)
    }
  },
}
</script>
