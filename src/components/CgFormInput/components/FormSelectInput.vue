<template>
  <div class="cg-component-flex-start">
    <form-select
        :field-schema="fieldSchema"
        :data="data"
        :row-top="rowTop"
        :disabled="disabled"/>
    <span style="padding-left: 3px;padding-right: 3px">↔️</span>
    <form-input
        :field-schema="fieldSchema"
        :data="data"
        :row-top="rowTop"
        :disabled="disabled"/>
    <!--    <form-select v-bind="$attrs" v-on="$listeners"/>↔️<form-input v-bind="$attrs" v-on="$listeners"/>-->
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
}
</script>

<style>
.cg-component-flex-start {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  z-index: 10;
}
.cg-component-flex-end {
  @extend .cg-component-flex-start;
  justify-content: flex-end;
}
</style>
