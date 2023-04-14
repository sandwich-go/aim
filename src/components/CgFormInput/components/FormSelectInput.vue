<template>
  <div>
    <form-select
        :field-schema="fieldSchema"
        :data="data"
        :row-top="rowTop"
        :disabled="disabled"/>
    ↔️
    <form-input
        :field-schema="fieldSchema"
        :data="data"
        :row-top="rowTop"
        :disabled="disabled"/>
  </div>
</template>

<script>
import MixinComponentConfig from "@/components/CgFormInput/mixins/MixinComponentConfig.vue";
import FormSelect from "@/components/CgFormInput/components/FormSelect.vue";
import FormInput from "@/components/CgFormInput/components/FormInput.vue";

export default {
  name: 'FormSelectInput',
  components: {FormSelect,FormInput},
  mixins: [MixinComponentConfig],
  created() {
    this.initComponentConfig()
  },
}
</script>