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
      sortIdxField:'',
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
          sortList.push(`${item.field} ${item.order}`)
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