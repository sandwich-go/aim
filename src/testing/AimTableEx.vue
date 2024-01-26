<template>

<aim-table
    v-bind="$attrs"
    v-on="$listeners"
></aim-table>
</template>

<script>
import AimTable from "@/components/AimTable/index.vue";

export default {
  name:'AimTableEx',
  components: { AimTable},
}
</script>