<template>
  <aim-table-ex
      v-if="tableDataProxy"
      :proxy-config="tableDataProxy"
      :header-config="{rightCells:['btnAdd']}"
      :schema="schema"/>
</template>
<script>
import {getEvnVarsField} from "@/testing/testing";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTableEx from "@/testing/AimTableEx.vue";

export default {
  name:'TestingEnvTable',
  components: {AimTableEx},
  data(){
    return {
      newEnvTable:false,
      tableData:[],
      tableDataProxy:null,
      schema:[
        {field:"name",name:'Name'},
        getEvnVarsField(),
      ]
    }
  },
  created() {
    this.tableDataProxy = newLocalDataProxyWithFieldName(this,'tableData')
  },
  methods:{}
}
</script>