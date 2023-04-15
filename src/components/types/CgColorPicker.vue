<template>
  <el-color-picker
      v-model="dataRef[fieldName]"
      show-alpha
      :style="cc.style"
      :size="cc.size"
      :predefine="cc.predefineColors"
      :disabled="disabled">
  </el-color-picker>
</template>

<script>
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";
import {ReservedColorList} from "@/utils/ui";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'CgInput',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      style: {width:null},
      predefineColors:jsb.cc('predefineColors',ReservedColorList)
    })
  },
}
</script>