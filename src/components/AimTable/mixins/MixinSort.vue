<script>

import jsb from "@sandwich-go/jsb";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";

export default {
  name: 'MixinSort',
  props: {
    sortConfig: Object,
  },
  mixins:[CreateMixinState()],
  created() {
    this.sortConfigRef =  this.sortConfig || {enable:false}
    jsb.objectAssignNX(this.sortConfigRef, {
      enable: true,
      remote:false,
      orders:[],
      multi:false,
      toastInvalidField:false,
      sortIdxField:'',
    })
    jsb.each(this.sortConfigRef.orders ||[],v=>{
      v.order = v.order.toLowerCase()
      // 使用 element 定义的关键词
      if(v.order === 'desc'){
        v.order = 'descending'
      }
      if(v.order === 'asc'){
        v.order = 'ascending'
      }
      // 使用 schema 中定义的sortMethod
      const fs = jsb.find(this.schema,fs=>fs.field === v.field)
      if(!fs){
        if(this.sortConfigRef.toastInvalidField){
          jsb.cc.toastWarning(`排序字段${v.field}不存在`)
        }
        return
      }
      v.orderFunc = v.orderFunc || fs.sortMethod
    })
  },
  methods:{
    addRemoteSortParams(params) {
      if (!params) {
        params = {}
      }
      if(!this.sortConfigRef.enable){
        return params
      }
      let sortList = []
      const _this= this
      if (this.sortConfigRef.remote) {
        jsb.each(_this.sortConfigRef.orders||[],function (item){
          let order = item.order
          if(order === 'descending'){
            order = 'desc'
          }
          if(order === 'ascending'){
            order = 'asc'
          }
          if(order){
            sortList.push(`${item.field} ${order}`)
          }
        })
      }
      if (sortList.length > 0) {
        params['AutoGenSort'] = sortList.join(',')
      }
      return params
    },
  }
}
</script>