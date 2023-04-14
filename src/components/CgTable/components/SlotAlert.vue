<template>
  <el-alert
      size="mini"
      :center="scopeData.center"
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
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'SlotAlert',
  props: {
    scope: [Object,String],
    center:{
      type:Boolean,
      default:null
    },
  },
  data() {
    return {
      dataValue: null,
      scopeData: {
        label:'',
        title:'',
        center:false,
        type: 'warning',
        effect:'dark',
        style: {},
        closeable:false,
        showIcon:true
      }
    }
  },
  created() {
    if(jsb.isString(this.scope)){
      this.scopeData.title = this.scope
    }else{
      this.scopeData = Object.assign(this.scopeData, this.scope)
    }
    this.scopeData.title = String(this.scopeData.title)
    this.scopeData.label = String(this.scopeData.label)
    if(!jsb.isUndefined(this.center)){
      this.scopeData.center = this.center
    }
  },
  methods: {
    bindAlertStyle(scope) {
      let style = getItemStyle(scope, {height: "28px"})
      if (style['width']) {
        style['width'] = parseWidthToPixelString(style['width'],
            this.scopeData.label || this.scopeData.title,
            this.scopeData.showIcon?30:0)
      }
      return style
    },
  }
}
</script>
