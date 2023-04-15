<template>
  <div style="display: inline-flex;width: 100%">
    <cg-select
        :scope-config="scopeConfig"
        :data="data"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
    <span style="padding-left: 3px;padding-right: 3px">↔️</span>
    <cg-input
        :scope-config="scopeConfig"
        :data="data"
        :style-base="styleBase"
        :style-override="styleOverride"
        :disabled="disabled"/>
  </div>
</template>

<script>
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";
import CgSelect from "@/components/types/CgSelect.vue";
import CgInput from "@/components/types/CgInput.vue";

export default {
  name: 'CgSelectInput',
  components: {CgSelect,CgInput},
  mixins: [MixinComponentConfig],
}
</script>

