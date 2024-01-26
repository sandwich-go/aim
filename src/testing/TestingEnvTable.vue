<template>
  <aim-table
      v-if="tableDataProxy"
      ref="aimTable"
      :proxy-config="tableDataProxy"
      :header-config="{rightCells:['btnAdd']}"
      :code-item-click="aimHandler"
      :schema="schema"/>
</template>
<script>
import {getEvnVarsField} from "@/testing/testing";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTable from "@/components/AimTable/index.vue";

export default {
  name:'TestingEnvTable',
  components: {AimTable},
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
  methods:{
    aimHandler(){
      this.$refs.aimTable.setInLoading(true,true)
      setTimeout(()=>{
        this.$refs.aimTable.setInLoading(false,true)
      },1000)
    }
  }
}
</script>