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
import TestingEnvTable from "@/testing/TestingEnvTable.vue";
import TestingAimTable from "@/testing/TestingAimTable.vue";
import TestingAimFormInput from "@/testing/TestingAimFormInput.vue";
export default {
  name: "TestingEntry",
  components: {TestingAimFormInput, TestingAimTable, TestingEnvTable},
  data(){
    return {
      activeName:'AimTable',
    }
  }
}
</script>
