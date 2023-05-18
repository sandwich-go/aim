<template>
  <el-drawer
      modal
      ref="aimDrawer"
      :show-close="configData.showClose"
      :with-header="configData.withHeader"
      :destroy-on-close="configData.destroyOnClose"
      :close-on-press-escape="configData.closeOnPressEscape"
      :visible.sync="isShowDraw"
      :size="configData.size"
      :append-to-body="configData.appendToBody"
      :before-close="configData.beforeClose"
      :custom-class="configData.customClass"
      @close="close"
      :direction="configData.direction">
    <slot name="aim-drawer-body"></slot>
    <div v-if="configData.footer" class="aim-drawer-footer" style="padding-right: 6px">
      <slot name="aim-drawer-footer"></slot>
    </div>
  </el-drawer>
</template>


<script>
const jsb = require("@sandwich-go/jsb")


export default {
  name: 'AimDrawer',
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
    close() {
      this.isShowDraw = false
      this.$emit("update:isShow", false);
      this.configData.close && this.configData.close()
    },
  },
  created() {
    jsb.element.fixDrawerClose(this,'aimDrawer')
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
      close:null,
      customClass: ''
    })
  }
}
</script>
<style>
.aim-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  position: sticky;
  bottom: 6px;
  z-index: 100;
}
</style>