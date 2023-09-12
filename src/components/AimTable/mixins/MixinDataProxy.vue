<script>
import {deleteConfirmConfig} from "@/components/AimTable/confirm";
import {aimTableError} from "@/components/AimTable/table";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {formatValue} from "@/components/cells/types";
import {cleanDataForTable} from "@/components/AimTable/clean";
import {CleanDataForStorage, RemoveFieldNotInSchema} from "@/components/AimTable/formatterForUpdate";
import {localFilter} from "@/components/AimTable/filter";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinDataProxy',
  props: {
    proxyConfig: Object,
    // 单独提供费，复用proxy
    proxyParameter:{
      type:Object,
      default:()=>{
        return {}
      }
    },
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
      // 数据提交时是否移除非schema中的字段
      submitRemoveFieldNotInSchema:false,
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
      params = params || {}
      const funcToCall = jsb.pathGet(this.proxyConfigRef,funcName)
      if (!funcToCall) {
        const error = `proxy中未指定 ${funcName} 方法`
        done && done({error})
        !this.proxyConfigRef.isLocalData && this.toastWarning(error)
        return
      }
      this.inLoading = true
      // 填充预设基础参数
      jsb.each(this.proxyParameter,(v,k)=>{
        if(!params[k]){
          params[k] = v
        }
      })

      Promise.resolve(funcToCall(params)).then((resp) => {
        okToast && !this.proxyConfigRef.isLocalData && this.toastSuccess(okToast)
        done && done({resp})
      }).catch(error => {
        aimTableError(`tryPromise ${funcName} err:${error.toString()}`,error.stack)
        done && done({error})
        let needToast = true
        if(jsb.isPlainObject(error)){
          needToast = jsb.pathGet(error,'toast',false)
        }
        if(needToast){
          !this.proxyConfigRef.isLocalData && this.toastError(error.toString())
        }
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
      if(confirmConfig.enable && !this.proxyConfigRef.isLocalData ){
        // 如果是本地数据proxy不再询问
        confirmConfig.doneFunc = confirmDoneFunc
        jsb.cc.confirmDelete(_this, confirmConfig)
      }else{
        confirmDoneFunc()
      }
    },
    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done} = {}) {
      // 本地proxy的数据依赖xid定位，保留xid数据
      const removeCtrlData = !this.proxyConfigRef.isLocalData
      let toSave = CleanDataForStorage(this.schema,row,true,removeCtrlData)
      if(this.proxyConfigRef.submitRemoveFieldNotInSchema){
        toSave=RemoveFieldNotInSchema(this.schema,toSave)
      }
      toSave =  this.proxyConfigRef.row2Item?this.proxyConfigRef.row2Item(toSave):toSave

      this.tryPromise('save',{row: toSave},({error})=>{
        if(!error){
          this.doLayout(true)
        }
        done && done({error})
      },'数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    filterSearch({done,params,mode={}} = {}) {
      if(this.isFilterRemote()){
        params = params || {}
        params.FilterMode = mode
        this.proxyQueryData({done,params})
        return
      }
      // 本地筛选数据
      const conditions = this.remoteFilterDataToParams()
      if(jsb.keys(conditions).length === 0){
        this.tableDataFiltered = null
      }else{
        this.tableDataFiltered = localFilter(this.tableData,conditions,mode)
      }
    },
    // eslint-disable-next-line no-unused-vars
    proxyQueryData({done,params} = {}) {
      if(this.isFilterRemote()){
        params = this.remoteFilterDataToParams(params)
      }
      params = this.PagerAddToParams(params)
      params = this.addRemoteSortParams(params)

      this.tryPromise('query',{params:params},({resp,error})=>{
        if(resp){
          // 不能直接赋值，vue检测array元素变化存在一些问题
          if(this.isModeInplace()){
            // inPlace模式下直接使用传入的数据，增加入proxy，编辑，缺少提交的窗口
            this.tableData = jsb.pathGet(resp, 'Data')
            this.processTableData(this.tableData)
          }else{
            this.tableData = []
            jsb.each(this.processTableData(jsb.pathGet(resp, 'Data')),(item)=>{
              this.tableData.push(item)
            })
          }
          this.PagerTotal = jsb.pathGet(resp, 'PagerTotal')
          if(!this.PagerTotal){
            this.PagerTotal = jsb.pathGet(resp, 'Total', this.tableData.length)
          }
          this.doLayout(true)
        }
        done && done({error})
      })
    },
    // remoteFilterDataToParams 远端模式下使用该方式填充数据并进行格式化操作
    remoteFilterDataToParams(params){
      params = params || {}
      const _this = this
      jsb.each(_this.filterData,function (val,key) {
        const filter = _this.filterTypeMapping[key]
        let formatter = jsb.pathGet(filter,'formatter')
        if(!formatter){
          formatter = jsb.pathGet(filter,'format')
        }
        const valFormatted = formatter?formatter(val):formatValue(filter.type,val)
        if(!valFormatted){
          return
        }
        if(filter['fieldRemote']) {
          params[filter['fieldRemote']] = valFormatted
        }else{
          params[key] = valFormatted
        }
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
      data = cleanDataForTable(data,this.schema,this.proxyConfigRef.item2Row)
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
