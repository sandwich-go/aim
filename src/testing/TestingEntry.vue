<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="AimTable" name="AimTable">
      <aim-table/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AimTable from "@/testing/AimTable.vue";
export default {
  name: "TestingEntry",
  components: {AimTable},
  data(){
    return {
      activeName:'AimTable',
    }
  }
}
</script>
