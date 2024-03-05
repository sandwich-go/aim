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

    <el-tab-pane label="AimFlow" name="AimFlow">
      <aim-flow-panel/>
    </el-tab-pane>

  </el-tabs>
</template>

<script>
import TestingEnvTable from "@/testing/TestingEnvTable.vue";
import TestingAimTable from "@/testing/TestingAimTable.vue";
import TestingAimFormInput from "@/testing/TestingAimFormInput.vue";
import AimFlowPanel from "@/components/AimFlow/AimFlowPanel.vue";
import '@/components/AimFlow/index.css'
export default {
  name: "TestingEntry",
  components: {AimFlowPanel, TestingAimFormInput, TestingAimTable, TestingEnvTable},
  data(){
    return {
      activeName:'AimFlow',
    }
  }
}
</script>
