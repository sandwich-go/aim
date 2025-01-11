<template>
  <div>
    <template v-if="expandConfigData.slot">
      <slot :name="expandConfigData.slot" :row="row"/>
    </template>
    <template v-else>
      <div v-if="expandConfigData.isHTML"
           v-html="expandContentData"
           v-loading="expandDetailLoading"/>
      <el-input v-else v-model="expandContentData"
                v-loading="expandDetailLoading"
                type="textarea" :autosize="{maxRows:25}"
                :readonly="true"/>
    </template>
  </div>
</template>

<script>

const jsb = require("@cg-devcenter/jsb")

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
    // fixme created调用了两次
    if(!this.expandConfigData.slot){
      this.freshExpandContent()
    }
  },
  methods:{
    freshExpandContent(){
      if(!this.expandContentData) {
        Promise.resolve(this.expandConfigData.expandContent({row:this.row})).then((rsp) => {
          this.expandContentData = jsb.pathGet(rsp, 'Data', '') || rsp
        }).catch(e => e).finally(() => {
          this.expandDetailLoading = false
        })
      }
    }
  }
}
</script>
