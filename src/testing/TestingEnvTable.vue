<template>
  <aim-table
      v-if="tableDataProxy"
      ref="aimTable"
      :proxy-config="tableDataProxy"
      :table-property="{autoWidth:true}"
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
      tableData:[{name:"test",val:['btn@btnRowEdit@l_编辑','btn@btnRowDelete@l_删除', 'btn@btnRowHistory@l_历史@t_success@i_el-icon-date','btn@btnRowEdit@l_编辑','btn@btnRowDelete@l_删除', 'btn@btnRowHistory@l_历史@t_success@i_el-icon-date']}],
      tableDataProxy:null,
      schema:[
        {field:"name",name:'Name'},
        {field:"val",name:'Value',type:'select_multiple'},
        getEvnVarsField(),
      ]
    }
  },
  created() {
    this.tableDataProxy = newLocalDataProxyWithFieldName(this,'tableData')
    this.tableDataProxy.saveValidate = ({row}) =>{
      console.log("row.EnvVars ",row.EnvVars)
    }
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