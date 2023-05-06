<script>
import {deleteConfirmConfig} from "@/components/AimTable/confirm";
import {cleanData, removeCtrlData} from "@/components/AimTable/table";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {formatValue} from "@/components/cells/types";

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
      isLocalData:false,
      item2Row(item) {
        return item
      },
      row2Item(row){
        return row
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
      delete: function ({row}) {
        return new Promise((resolve, reject) => {
          reject("delete not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      deleteRows: function ({rows}) {
        return new Promise((resolve, reject) => {
          reject("deleteRows not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      saveTableData: function ({tableData}) {
        return new Promise((resolve, reject) => {
          reject("saveTableData not implemented")
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
        !this.proxyConfigRef.isLocalData && this.toastWarning(error)
        return
      }
      this.inLoading = true
      Promise.resolve(funcToCall(params)).then((resp) => {
        okToast && !this.proxyConfigRef.isLocalData && this.toastSuccess(okToast)
        done && done({resp})
      }).catch(error => {
        done && done({error})
        !this.proxyConfigRef.isLocalData && this.toastError(error)
      }).finally(() => {
        this.inLoading = false
      })
    },

    // eslint-disable-next-line no-unused-vars
    trySaveTableData({done} = {}) {
      this.tryPromise('saveTableData',this.tableData,done,'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyDelete(row, {done} = {}) {
      this.deleteAsking('delete',{row},{done})
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyDeleteRows(rows, {done} = {}) {
      if(rows.length === 0){
        done && done()
        return
      }
      this.deleteAsking('deleteRows',{rows},{done})
    },
    // eslint-disable-next-line no-unused-vars
    deleteAsking(funcName,{row,rows}, {done} = {}) {
      this.debug && (this.debugMessage = `${funcName} called`)
      const _this = this
      const confirmDoneFunc = ()=>{
        _this.tryPromise(funcName,{row,rows},function ({error}){
          if(!error){
            _this.tryProxyQueryData()
          }
          done && done({error})
        },'数据已删除')
      }
      const confirmConfig = deleteConfirmConfig(this.proxyConfigRef, {row,rows})
      if(confirmConfig.enable){
        confirmConfig.doneFunc = confirmDoneFunc
        jsb.cc.confirm(_this, confirmConfig)
      }else{
        confirmDoneFunc()
      }
    },

    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done} = {}) {
      let toSave = row
      if(!this.proxyConfig.isLocalData){
        toSave = removeCtrlData(jsb.clone(row))
      }
      this.tryPromise('save',{row: toSave},done,'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyQueryData({done,params} = {}) {

      params = this.addFilterDataToParams(params)
      params = this.PagerAddToParams(params)
      params = this.addRemoteSortParams(params)

      this.tryPromise('query',{params:params},({resp,error})=>{
        if(resp){
          this.tableData = this.processTableData(jsb.pathGet(resp, 'Data'))
          this.PagerTotal = jsb.pathGet(resp, 'Total', this.tableData.length)
        }
        done && done({error})
        this.doLayout()
      })
    },
    addFilterDataToParams(params){
      params = params || {}
      const _this = this
      jsb.each(_this.filterData,function (val,key) {
        const filter = _this.filterTypeMapping[key]
        let valFormatted = formatValue(filter.type,val)
        if(!valFormatted){
          return
        }
        const format = filter['format']
        if(format){
          valFormatted = format(valFormatted)
        }
        params[key] = valFormatted
      })
      return params
    },

    processTableData(data){
      data = cleanData(data,this.schema,this.proxyConfigRef.item2Row)
      if(this.sortConfigRef.enable && !this.sortConfigRef.remote) {
        if (this.sortConfigRef.orders.length > 0) {
          data = jsb.orderBy(data,this.sortConfigRef.orders)
        }
      }
      return data
    },
  }
}
</script>
