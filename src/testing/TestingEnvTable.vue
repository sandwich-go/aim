<template>
  <div>
    <aim-popup :is-show.sync="newEnvTable" :drawer="true">
      <template v-slot:aim-popup-body>
        <aim-table
            :schema="schema"
            :proxy-config="envDataProxy()"
            :righter-config="{cells: ['btnAdd','btnRowSelectedMinus']}"
            :edit-config="{mode:'inplaceNoTrigger'}"
            :table-property="{autoWidth:true,stripe:false}"
            :row-remove-shortcut="true"
            :selection="true"
            :form-popup-using-drawer="false"
            :popup-append-to-body="true"
        ></aim-table>
      </template>
    </aim-popup>
    <el-button @click="addEnvTable">Add</el-button>
  </div>
</template>
<script>
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import AimTable from "@/components/AimTable/index.vue";
import AimPopup from "@/components/AimPopup/index.vue";
const jsb = require("@sandwich-go/jsb")

export default {
  name:'TestingEnvTable',
  components: {AimPopup, AimTable},
  data(){
    return {
      newEnvTable:false,
      data:{
        EnvVars:[
          {Key:'test',Value:''}
        ]
      },
      schema:[
        {field: 'Key', name: 'Key', type:'input',uniq:true,
          headerLinkList: [
            {
              'icon': 'el-icon-refresh',
              'style': {'padding-left': '9px'},
              underline: false,
              click: ({tableData})=>{
                const firstKey = jsb.pathGet(tableData,'0.Key',"")
                const isUpper = firstKey === firstKey.toUpperCase()
                jsb.each(tableData,v=>{
                  v.Key = isUpper?v.Key.toLowerCase():v.Key.toUpperCase()
                })
              }
            }
          ],
        },
        {field: 'Value', name: 'Value', type:'input'},
        {field: 'Comment', name: '注释', type:'input'},
      ]
    }
  },
  methods:{
    envDataProxy() {
      console.log("envDataProxy called")
      return newLocalDataProxyWithFieldName(this.data, 'EnvVars')
    },
    addEnvTable(){
      this.newEnvTable = true
    }
  }
}
</script>