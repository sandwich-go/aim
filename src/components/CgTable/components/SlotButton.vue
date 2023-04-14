<template>
  <el-button
      :disabled="disabled"
      :style="scopeData.style"
      :icon="scopeData.icon"
      :type="scopeData.type"
      :plain="scopeData.plain"
      :circle="scopeData.circle"
      size="mini"
      @click="$emit('code-button-click',{code:scopeData.code,scope:scopeData})"
  >
    <template v-if="!scopeData.circle">{{scopeData.label ? scopeData.label : ""}}</template>
  </el-button>
</template>

<script>

export default {
  name: 'SlotButton',
  props: {
    scope:Object,
    disabled:Boolean,
  },
  data() {
    return {
      dataValue: null,
      scopeData: {
        code: '',
        icon: '',
        label: '',
        type: 'primary',
        plain: false,
        disabled: false,
        show: true,
        circle:false,
        style: {},
      }
    }
  },
  created() {
    this.scopeData = Object.assign(this.scopeData, this.scope)
  },
}
</script>
