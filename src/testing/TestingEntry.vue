<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="CgTable" name="CgTable">
      <testing-cg-table/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TestingCgTable from "@/testing/TestingCgTable.vue";
export default {
  name: "TestingEntry",
  components: {TestingCgTable},
  data(){
    return {
      activeName:'CgTable',
    }
  }
}
</script>
