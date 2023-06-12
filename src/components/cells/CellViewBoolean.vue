<template>
  <cell-view-icon v-bind="{ ...$props,formatter:myFormatter}"></cell-view-icon>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import CellViewIcon from "@/components/cells/CellViewIcon.vue";

export default {
  name: "CellViewBoolean",
  components: {CellViewIcon},
  mixins: [MixinCell],
  methods: {
    myFormatter({value}) {
      return (this.formatter ? this.formatter({value}) : value) ?
          {class: 'el-icon-check', style: {'color': 'green'}} :
          {class: 'el-icon-close', style: {'color': 'red'}}
    }
  },
}
</script>