<template>
  <aim-table
      v-if="tableDataProxy"
      ref="aimTable"
      :proxy-config="tableDataProxy"
      :table-property="{autoWidth:true}"
      :header-config="{rightCells:['btn@btnAdd@l_新建','btn@btnRefresh@l_刷新']}"
      :code-item-click="codeItemClick"
      :schema="schema"/>
</template>
<script>
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTable from "@/components/AimTable/index.vue";

export default {
  name:'TestingCellDropdown',
  components: {AimTable},
  data(){
    return {
      tableData:[
        {Id:1, Name:'项目Alpha', Branch:'main', Status:'正常', Repo:'git@github.com:org/alpha.git'},
        {Id:2, Name:'项目Beta', Branch:'develop', Status:'编译中', Repo:'git@github.com:org/beta.git'},
        {Id:3, Name:'项目Gamma', Branch:'feature/test', Status:'异常', Repo:'git@github.com:org/gamma.git'},
      ],
      tableDataProxy:null,
      schema:[
        {field:'Id', name:'ID', type:'input', readOnly:true, width:60, align:'center'},
        {field:'Name', name:'项目名称', type:'input', min_width:120},
        {field:'Branch', name:'分支', type:'input', min_width:100},
        {field:'Status', name:'状态', type:'input', width:80, align:'center'},
        {field:'Repo', name:'版本库地址', type:'input', min_width:200, showOverflowTooltip:true},
        {
          field:'_actions',
          virtual:true,
          backgroundAsHeader:true,
          fixed:'right',
          name:'操作',
          width:80,
          sortable:false,
          cell:'CellDropdown',
          cellConfig:[
            'btn@btnRowEdit@l_编辑',
            'btn@btnRowCopy@l_复制',
            'btn@btnRowDelete@l_删除@t_danger',
            'btn@myHistory@l_历史@t_success@i_el-icon-date',
            'btn@editAlias@l_改索引标识@t_primary@i_el-icon-key',
            'btn@syncRepo@l_同步@t_warning@i_el-icon-refresh',
          ]
        },
      ]
    }
  },
  created() {
    this.tableDataProxy = newLocalDataProxyWithFieldName(this,'tableData')
  },
  methods:{
    codeItemClick({code, row}){
      console.log(`[${code}] row:`, row)
      return true
    }
  }
}
</script>
