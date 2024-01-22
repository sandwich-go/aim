<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="AimTable" name="AimTable">
      <testing-aim-table/>
    </el-tab-pane>
    <el-tab-pane label="AimFormInput" name="AimFormInput">
      <testing-aim-form-input/>
    </el-tab-pane>
    <el-tab-pane label="BugEnvTable" name="BugEnvTable">
      <testing-env-table/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TestingAimFormInput from "@/testing/TestingAimFormInput.vue";
import TestingAimTable from "@/testing/TestingAimTable.vue";
import TestingEnvTable from "@/testing/TestingEnvTable.vue";
export default {
  name: "TestingEntry",
  components: {TestingEnvTable, TestingAimTable, TestingAimFormInput},
  data(){
    return {
      activeName:'AimTable',
    }
  }
}
</script>
