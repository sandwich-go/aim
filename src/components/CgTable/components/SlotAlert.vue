<template>
  <el-alert
      :style="bindAlertStyle(scopeData)"
      :type="scopeData.type"
      :effect="scopeData.effect"
      :closable="scopeData.closeable"
      :show-icon="scopeData.showIcon"
      :title="scopeData.label || scopeData.title"/>
</template>

<script>

import {getItemStyle} from "@/components/CgTable/table";
import {parseWidthToPixelString} from "@/utils/ui";

export default {
  name: 'SlotAlert',
  props: {
    scope: {
      type: Object,
    },
  },
  data() {
    return {
      dataValue: null,
      scopeData: {
        label:'',
        title:'',
        type: 'info',
        effect:'dark',
        style: {},
        closeable:false,
        showIcon:false
      }
    }
  },
  created() {
    this.scopeData = Object.assign(this.scopeData, this.scope)
  },
  methods: {
    bindAlertStyle(scope) {
      let style = getItemStyle(scope, {height: "28px"})
      if (style['width']) {
        style['width'] = parseWidthToPixelString(style['width'],this.scopeData.label || this.scopeData.title)
      }
      return style
    },
  }
}
</script>
