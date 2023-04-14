<template>
  <div class="filter-input" :style="cssVars">
    <el-input
        size="mini"
        clearable
        :style="scopeData.style"
        v-model="scopeData.value"
        @change="scopeData.change"
        :placeholder="scopeData.placeholder">
    </el-input>
  </div>
</template>

<script>

export default {
  name: 'SlotInput',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      scopeData:{
        placeholder:'',
        style:{},
        change:function (valNew){
          this.$emit("input",valNew)
        }
      },
    }
  },
  created() {
    this.scopeData = Object.assign(this.scopeData,this.scope)
  },
  computed: {
    cssVars() {
      return {
        "--input-width": this.scopeData.style.width
      };
    }
  },
}
</script>
<!--<style lang="scss" scoped>-->
<style scoped>
.filter-input >>> .el-input {
  width: var(--input-width) !important;
}
</style>
