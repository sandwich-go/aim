<template>
  <div v-if="expandConfigData.isHTML"
       v-html="expandContentData"
       v-loading="expandDetailLoading"/>
  <el-input v-else v-model="expandContentData"
            v-loading="expandDetailLoading"
            type="textarea" :autosize="{maxRows:25}"
            :readonly="true"/>
</template>

<script>

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'ColumnExpand',
  props: {
    row:Object,
    expandConfigData:Object,
  },
  data(){
    return {
      expandDetailLoading:false,
      expandContentData:''
    }
  },
  created() {
    this.freshExpandContent()
  },
  methods:{
    freshExpandContent(){
      Promise.resolve(this.expandConfigData.expandContent({row:this.row})).then((rsp) => {
        this.expandContentData = jsb.pathGet(rsp, 'Data', '') || rsp
      }).catch(e => e).finally(() => {
        this.expandDetailLoading = false
      })
    }
  }
}
</script>
