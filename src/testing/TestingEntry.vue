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
    <el-tab-pane label="CellDropdown" name="CellDropdown">
      <testing-cell-dropdown/>
    </el-tab-pane>
    <el-tab-pane label="分页 / 无限滚动" name="PaginationToggle">
      <testing-pagination-toggle/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import TestingEnvTable from "@/testing/TestingEnvTable.vue";
import TestingAimTable from "@/testing/TestingAimTable.vue";
import TestingAimFormInput from "@/testing/TestingAimFormInput.vue";
import TestingCellDropdown from "@/testing/TestingCellDropdown.vue";
import TestingPaginationToggle from "@/testing/TestingPaginationToggle.vue";
export default {
  name: "TestingEntry",
  components: {TestingAimFormInput, TestingAimTable, TestingEnvTable, TestingCellDropdown, TestingPaginationToggle},
  data(){
    return {
      activeName:'AimTable',
    }
  }
}
</script>
