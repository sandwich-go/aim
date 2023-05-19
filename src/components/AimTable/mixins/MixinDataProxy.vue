<script>
import {deleteConfirmConfig} from "@/components/AimTable/confirm";
import {cleanData, removeCtrlData} from "@/components/AimTable/table";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {formatValue} from "@/components/cells/types";
import {trimInvisibleChar} from "@/components/AimTable/clean";

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
      rowWatcher:[],
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
      // eslint-disable-next-line no-unused-vars
      saveField: function ({tableData,field}) {
        return new Promise((resolve, reject) => {
          reject("saveField not implemented")
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
    trySaveField(field, {done} = {}) {
      this.tryPromise('saveField',{tableData:this.tableData,field},({error})=>{
        done && done({error})
      },`字段 ${field} 已保存`)
    },
    // eslint-disable-next-line no-unused-vars
    trySaveTableData({done} = {}) {
      this.tryPromise('saveTableData',{tableData:this.tableData},({error})=>{
        if(!error){
          this.doLayout(true)
        }
        done && done({error})
      },'数据已保存')
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
            _this.proxyQueryData()
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
      toSave = trimInvisibleChar(this.schema,toSave,true)
      this.tryPromise('save',{row: toSave},({error})=>{
        if(!error){
          this.doLayout(true)
        }
        done && done({error})
      },'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    proxyQueryData({done,params} = {}) {

      params = this.addFilterDataToParams(params)
      params = this.PagerAddToParams(params)
      params = this.addRemoteSortParams(params)

      this.tryPromise('query',{params:params},({resp,error})=>{
        if(resp){
          // 不能直接赋值，vue检测array元素变化存在一些问题
          this.tableData = []
          jsb.each(this.processTableData(jsb.pathGet(resp, 'Data')),(item)=>{
            this.tableData.push(item)
          })
          this.PagerTotal = jsb.pathGet(resp, 'Total', this.tableData.length)
          this.doLayout(true)
        }
        done && done({error})
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
    rowWatchFunc(expOrFn,callback,options){
      this.rowWatcher.push(this.$watch(expOrFn,callback,options))
    },
    cleanRowWatcher(){
      // 取消之前的监听器
      this.rowWatcher.forEach((watcher) => watcher());
      this.rowWatcher = []
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
