<template>
  <el-alert
      size="mini"
      :center="cc.center"
      :style="bindAlertStyle()"
      :type="cc.type"
      :effect="cc.effect"
      :closable="cc.closeable"
      :show-icon="cc.showIcon"
      :title="cc.label || cc.title"/>
</template>

<script>

import {getItemStyle} from "@/components/CgTable/table";
import {parseWidthToPixelString} from "@/utils/ui";
import MixinCellEditorConfig from "@/components/cells/mixins/MixinCellEditorConfig.vue";

const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CgAlert',
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
      center: false,
      type: 'warning',
      effect: 'dark',
      style: {},
      closeable: false,
      showIcon: true
    })
    if (jsb.isString(this.scope)) {
      this.cc.title = this.scope
    } else {
      this.cc = Object.assign(this.cc, this.scope)
    }
    this.cc.title = String(this.cc.title)
    this.cc.label = String(this.cc.label)
    if (!jsb.isUndefined(this.center)) {
      this.cc.center = this.center
    }
  },
  methods: {
    bindAlertStyle() {
      let style = getItemStyle(this.cc, {height: "28px"})
      if (style['width']) {
        style['width'] = parseWidthToPixelString(style['width'], this.cc.label || this.cc.title,
            this.cc.showIcon ? 30 : 0)
      }
      return style
    },
  }
}
</script>
