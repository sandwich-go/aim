<template>
  <div class="aim-popup">
    <el-drawer
        v-if="drawer"
        modal
        ref="aimPopupDrawer"
        v-bind="configData"
        :visible.sync="isShowPopup"
        :title="title"
        @close="close">
      <template v-slot:title>
        <slot name="aim-popup-title"></slot>
      </template>
      <div v-if="configData.header" class="aim-drawer-header" :style="configData.headerStyle">
        <slot name="aim-popup-header"></slot>
      </div>
      <div :style="configData.bodyStyle">
        <slot name="aim-popup-body" ></slot>
      </div>
      <div v-if="configData.footer" class="aim-drawer-footer" :style="configData.footerStyle">
        <slot name="aim-popup-footer"></slot>
      </div>
    </el-drawer>
    <el-dialog
        v-else
        modal
        ref="aimPopupDialog"
        v-bind="configData"
        :width="configData.width || configData.size"
        @close="close"
        :title="title"
        :visible.sync="isShowPopup">
      <template v-slot:title>
        <div v-if="title" v-html="title"></div>
      </template>
      <div v-if="configData.header" class="aim-drawer-header" :style="configData.headerStyle">
        <slot name="aim-popup-header"></slot>
      </div>
      <div :style="configData.bodyStyle">
        <slot name="aim-popup-body" ></slot>
      </div>
      <div v-if="configData.footer" slot="footer" class="dialog-footer" :style="configData.footerStyle">
        <slot name="aim-popup-footer"></slot>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const jsb = require("@cg-devcenter/jsb")


export default {
  name: 'AimPopup',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    config: Object,
    title: String,
    drawer: Boolean,
  },
  data() {
    return {
      isShowPopup: this.isShow,
      configData: this.config
    }
  },
  watch: {
    isShow(value) {
      this.isShowPopup = value
      if(value){
        jsb.cc.emitter.emit(this.configData.triggerEventWhenShow)
      }
    },
  },
  methods: {
    close() {
      this.isShowPopup = false
      this.$emit("update:isShow", false);
      this.configData.close && this.configData.close()
    },
    closePopup(){
      if (this.drawer === true) {
        this.$refs.aimPopupDrawer.closeDrawer()
      } else {
        this.$refs.aimPopupDialog.close()
      }
    }
  },
  created() {
    if(this.drawer){
      jsb.element.fixDrawerClose(this, 'aimPopupDrawer')
    }
    this.configData = jsb.objectAssignNX(this.configData, {
      showClose: true,
      withHeader: false,
      destroyOnClose: true,
      closeOnPressEscape: true,
      size: '85%',
      direction: "rtl",
      footer: true,
      header:false,
      beforeClose: null,
      appendToBody: false,
      close: null,
      customClass: '',
      triggerEventWhenShow:"aim_table_layout",
      footerStyle:{},
      headerStyle:{},
      bodyStyle:{},
      wrapperClosable:false,
    })
    if(this.title) {
      this.configData.withHeader = true
    }
  }
}
</script>
<style scoped>
.aim-popup >>> .aim-drawer-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  position: sticky;
  bottom: 0;
  z-index: 100;
}
.aim-popup >>> .aim-drawer-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  position: sticky;
  top: 0;
  z-index: 100;
}

.aim-popup >>> .el-drawer {
  position: absolute;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  overflow: hidden
}

.aim-popup >>> .el-drawer__header {
  align-items: center;
  display: flex;
  margin-bottom: 9px;
  padding: 9px 9px 0;
  font-weight: 700;
}


.aim-popup >>> .el-drawer__header > :first-child {
  flex: 1
}

.aim-popup >>> .el-drawer__title {
  margin: 0;
  flex: 1;
  line-height: inherit;
  font-size: 1rem;
}

.aim-popup >>> .el-drawer__close-btn {
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: inherit;
  background-color: transparent
}

.aim-popup >>> .el-drawer__body {
  overflow: auto;
  padding: 3px;
}

.aim-popup >>> .el-dialog__body {
  overflow: auto;
  padding: 3px;
}

.aim-popup >>> .el-drawer__body > * {
  box-sizing: border-box
}

.aim-popup >>> .el-drawer__container {
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
  width: 100%
}

</style>
