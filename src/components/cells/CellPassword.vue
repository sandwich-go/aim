<template>
  <div class="cell-input-with-width" :style="cssVars">
    <el-input
        v-model="dataRef[fieldName]"
        v-bind="cc"
        :disabled="disabled"
        @change="change"
        @input="input"
        size="mini"
        :type="asPassword?'password':''">
      <i slot="suffix" title="查看" @click="asPasswordSwitch()" style="cursor:pointer;"
         class="el-icon-view"></i>
    </el-input>
  </div>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
export default {
  name: 'CellInput',
  mixins: [MixinCell],
  created() {
    this.ccMerge()
  },
  data(){
    return {
      // 初始有值，当做密码看待，否则进入初始编辑状态
      asPassword:!!this.data[this.fieldName],
      initEmpty:!this.data[this.fieldName],
    }
  },
  methods:{
    // 完全清空之后允许查看新输入的数据
    input(val){
      if(!val){
        this.initEmpty = true
      }
    },
    asPasswordSwitch(){
      if(!this.asPassword){
        this.asPassword = true
        return
      }
      // 初始为空，允许切换
      if(this.initEmpty){
        this.asPassword = false
        return;
      }
      let checkPermission = this.cc['checkPermission']
      if(!checkPermission){
        checkPermission = jsb.cc.aimViewPassword
      }
      if(checkPermission) {
        const ret = checkPermission({passwordType:this.cc['passwordType']})
        if (jsb.isString(ret)) {
          jsb.cc.toastWarning(ret)
          return
        }
        if (ret){
          this.asPassword = false
        }
        if(this.asPassword) {
          jsb.cc.toastWarning('无权查看')
        }
        return
      }
      this.asPassword = false
    }
  },
  computed: {
    cssVars() {
      // 如果在table列中，且设定了列元素则主动撑满整个表格
      return {
        "--input-width": this.calcWidthPixString() || '100%',
        width:"100%"
      };
    }
  },
}
</script>

<style scoped>
.cell-input-with-width >>> .el-input {
  width: var(--input-width) !important;
}
</style>