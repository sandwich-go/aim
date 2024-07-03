<template>
  <div>
    <div class="external-div" :class="{ hidden: dialogVisible }">
      <div v-if="showButtonEnter" class="sticky-button">
        <el-link  size="mini" @click="enter"><i class="el-icon-full-screen"/></el-link>
      </div>
      <div class="content-container">
        <slot></slot>
      </div>
    </div>

    <el-dialog
        class="full-screen-dialog"
        :visible.sync="dialogVisible"
        :fullscreen="true"
        :show-close="false"
        :append-to-body="true"
        :before-close="exit"
    >
      <div v-if="showButtonEnter" class="custom-header sticky-button">
        <el-link  size="mini" @click="dialogVisible = false" style="background-color: gray"><i class="el-icon-full-screen"/></el-link>
      </div>
      <slot></slot>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AimFullScreenDialog',
  props:{
    showButtonEnter:{
      type:Boolean,
      default:true
    },
    showButtonExit:{
      type:Boolean,
      default:true
    },
    beforeEnterFullscreen:Function,
    afterEnterFullscreen:Function,
    beforeLeaveFullscreen:Function,
    afterLeaveFullscreen:Function,
  },
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
    switch() {
      if(this.dialogVisible){
        this.exit()
      }else{
        this.enter()
      }
    },
    enter() {
      this.beforeEnterFullscreen && this.beforeEnterFullscreen()
      this.dialogVisible = true;
      this.afterEnterFullscreen && this.afterEnterFullscreen()
    },
    exit() {
      this.beforeLeaveFullscreen && this.beforeLeaveFullscreen()
      this.dialogVisible = false;
      this.afterLeaveFullscreen && this.afterLeaveFullscreen()
    }
  }
};
</script>

<style>

.hidden {
  display: none;
}

.content-container {
}
.sticky-button {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: white; /* 保证按钮所在区域背景色 */
  padding: 10px 0; /* 可以根据需要调整 */
}
.full-screen-dialog .CodeMirror {
  height: calc(100vh - 150px) !important;
}
.full-screen-dialog .jsoneditor-box {
  height: calc(100vh - 150px) !important;
}

.full-screen-dialog .el-table{
  height: calc(100vh - 200px) !important;
}

</style>
