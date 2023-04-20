<template>
  <el-drawer
      modal
      ref="cg-drawer"
      :show-close="configData.showClose"
      :with-header="configData.withHeader"
      :destroy-on-close="configData.destroyOnClose"
      :close-on-press-escape="configData.closeOnPressEscape"
      :visible.sync="isShowDraw"
      :size="configData.size"
      :append-to-body="configData.appendToBody"
      :before-close="configData.beforeClose"
      :custom-class="configData.customClass"
      @close="onClose"
      :direction="configData.direction">
    <slot name="cg-drawer-body"></slot>
    <div v-if="configData.footer" class="cg-drawer-footer" style="padding-right: 6px">
      <slot name="cg-drawer-footer"></slot>
    </div>
  </el-drawer>
</template>


<script>
const jsb = require("@sandwich-go/jsb")


export default {
  name: 'CgDrawer',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    config: Object,
  },
  data() {
    return {
      isShowDraw: this.isShow,
      configData: this.config
    }
  },
  watch: {
    isShow(value) {
      this.isShowDraw = value
    }
  },
  methods:{
    onClose() {
      this.isShowDraw = false
      this.$emit("update:isShow", false);
      this.configData.onClose && this.configData.onClose()
    },
  },
  created() {
    jsb.element.fixDrawerClose(this,'cg-drawer')
    this.configData = jsb.objectAssignNX(this.configData, {
      showClose: false,
      withHeader: false,
      destroyOnClose: true,
      closeOnPressEscape: true,
      size: '95%',
      direction: "ltr",
      footer: true,
      beforeClose: null,
      appendToBody: false,
      onClose:null,
      customClass: ''
    })
  }
}
</script>
<style>
.cg-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  position: sticky;
  bottom: 0;
  z-index: 100;
}
</style>