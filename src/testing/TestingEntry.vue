<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="AimTable" name="AimTable">
      <aim-table/>
    </el-tab-pane>
    <el-tab-pane label="AimFormInput" name="AimFormInput">
      <testing-aim-form-input/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AimTable from "@/testing/AimTable.vue";
import TestingAimFormInput from "@/testing/TestingAimFormInput.vue";
export default {
  name: "TestingEntry",
  components: {TestingAimFormInput, AimTable},
  data(){
    return {
      activeName:'AimTable',
    }
  }
}
</script>
