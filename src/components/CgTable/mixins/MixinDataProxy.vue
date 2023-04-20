<script>
import {deleteConfirmConfig} from "@/components/CgTable/confirm";
import {cleanData, removeCtrlData} from "@/components/CgTable/table";
import {CreateMixinState} from "@/components/CgTable/mixins/CreateMixinState";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinDataProxy',
  props: {
    proxyConfig: Object,
  },
  mixins:[CreateMixinState()],
  data() {
    return {
      proxyConfigRef: this.proxyConfig || {},
    }
  },
  created() {
    jsb.objectAssignNX(this.proxyConfigRef, {
      item2Row(item) {
        return item
      },
      // eslint-disable-next-line no-unused-vars
      query: function ({params}) {
        return new Promise((resolve, reject) => {
          reject("query not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      save: function ({row}) {
        return new Promise((resolve, reject) => {
          reject("save not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      saveTableData: function ({tableData}) {
        return new Promise((resolve, reject) => {
          reject("saveTableData not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      delete: function ({params}) {
        return new Promise((resolve, reject) => {
          reject("delete not implemented")
        })
      },
      // 删除时的asking回调
      // eslint-disable-next-line no-unused-vars
      deleteConfirmConfig: ({row}) => {
        return {}
      },
    })
  },
  methods:{
    // eslint-disable-next-line no-unused-vars
    tryPromise(funcName,params,done=null,okToast='') {
      const funcToCall = jsb.pathGet(this.proxyConfigRef,funcName)
      if (!funcToCall) {
        const error = `proxy中未指定 ${funcName} 方法`
        done && done({error})
        this.toastWarning(error)
        return
      }
      this.inLoading = true
      Promise.resolve(funcToCall(params)).then((resp) => {
        okToast && this.toastSuccess(okToast)
        done && done({resp})
      }).catch(error => {
        done && done({error})
        this.toastError(error)
      }).finally(() => {
        this.inLoading = false
      })
    },

    // eslint-disable-next-line no-unused-vars
    trySaveTableData({done} = {}) {
      this.tryPromise('saveTableData',this.tableData,done,'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyDeleteRow(row, {done} = {}) {
      this.debug && (this.debugMessage = `tryProxyDeleteRow called ${this.summaryRow(row)}`)
      const confirmConfig = deleteConfirmConfig(this.proxyConfigRef, row)
      const _this = this
      confirmConfig.doneFunc = () => {
        _this.tryPromise('delete',{row:row},done,'数据已删除')
      }
      jsb.cc().confirm(_this, confirmConfig)
    },
    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done} = {}) {
      this.tryPromise('save',{row: removeCtrlData(jsb.clone(row))},done,'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyQueryData({done} = {}) {
      this.tryPromise('query',{},({resp,error})=>{
        if(resp){
          this.tableData = cleanData(jsb.pathGet(resp, 'Data'),this.schema,this.proxyConfigRef.item2Row)
          this.PagerTotal = jsb.pathGet(resp, 'Total', this.tableData.length)
        }
        done && done({error})
      })
    },
  }
}
</script>
