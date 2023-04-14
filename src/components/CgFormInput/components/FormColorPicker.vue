<template>
  <el-color-picker
      v-model="dataRef[fieldName()]"
      show-alpha
      :style="cc.style"
      :predefine="cc.predefineColors"
      :disabled="disabled">
  </el-color-picker>
</template>

<script>
import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";
import {ReservedColorList} from "@/utils/ui";
const jsb = require("@sandwich-go/jsb")
export default {
  name: 'FormInput',
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig({
      style: {position:'absolute',left: 0},
      predefineColors:jsb.cc('predefineColors',ReservedColorList)
    })
  },
}
</script>