<script>

import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinCellEditorConfig',
  props: {
    editorTableKey:String,
    editorProxyConfig:Object,
    editorGroupOptions:Array,
    editorUserOptions:Array,
  },
  data(){
    return {
      editorProxyConfigRef:this.editorProxyConfig
    }
  },
  created(){
    this.editorProxyConfigRef = jsb.objectAssignNX(this.editorProxyConfigRef,{
      // query获取表对应的访问控制数据
      // eslint-disable-next-line no-unused-vars
      query: function ({params}) {
        return new Promise((resolve, reject) => {
          reject("query not implemented")
        })
      },
      // 整体保存访问控制数据
      // eslint-disable-next-line no-unused-vars
      saveTableData: function ({tableData}) {
        return new Promise((resolve, reject) => {
          reject("saveTableData not implemented")
        })
      },
    })
  },
}
</script>
