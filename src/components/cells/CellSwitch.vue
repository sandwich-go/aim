<template>
  <el-switch
      v-model="data[fieldName]"
      :active-color="cc.activeColor"
      :inactive-color="cc.inactiveColor"
      @change="change"
      size="mini"
      :disabled="disabled">
  </el-switch>
</template>

<script>

import MixinCell from "@/components/cells/mixins/MixinCell.vue";
export default {
  name: 'CellSwitch',
  mixins: [MixinCell],
  created() {
    this.ccMerge({
      activeColor: '#13ce66',
      inactiveColor: '#ff4949',
    })
  },
}
</script>
