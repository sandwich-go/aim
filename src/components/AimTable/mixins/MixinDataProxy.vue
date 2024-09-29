<script>
import {deleteConfirmConfig} from "@/components/AimTable/confirm";
import {aimTableError, isCtrlRemote, xidRow} from "@/components/AimTable/table";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {formatValue} from "@/components/cells/types";
import {cleanDataForTable} from "@/components/AimTable/clean";
import {CleanRowForStorage} from "@/components/AimTable/formatterForUpdate";
import {localFilter} from "@/components/AimTable/filter";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: 'MixinDataProxy',
  props: {
    proxyConfig: Object,
    // 单独提供费，复用proxy
    proxyParameter: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  mixins: [CreateMixinState()],
  data() {
    return {
      proxyConfigRef: this.proxyConfig || {},
      rowWatcher: [],
      queryCount: -1,
      afterQueryData: null,
    }
  },
  created() {
    jsb.objectAssignNX(this.proxyConfigRef, {
      isLocalData: false,
      toastID: "aimTable",
      // 数据提交时是否移除非schema中的字段
      submitRemoveFieldNotInSchema: false,
      item2Row(item) {
        return item
      },
      row2Item(row) {
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
      // save操作为async模式，不主动刷新数据
      saveAsync: false,
      // delete操作为async模式，不主动刷新数据
      deleteAsync: false,
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
      saveField: function ({tableData, field}) {
        return new Promise((resolve, reject) => {
          reject("saveField not implemented")
        })
      },
      // 删除时的asking回调
      // eslint-disable-next-line no-unused-vars
      deleteConfirmConfig: ({row}) => {
        return {}
      },
      treeConfigQuery: () => {
        return new Promise((resolve, reject) => {
          reject("should implement treeConfigQuery")
        })
      },
      treeConfigSave: () => {
        return new Promise((resolve, reject) => {
          reject("should implement treeConfigSave")
        })
      },
    })
  },
  methods: {
    tryToast(toastType, info, toastContentDefault) {
      let toastContent = toastContentDefault
      let needToast = !this.proxyConfigRef.isLocalData
      let toastID = this.proxyConfigRef.toastID
      let toastInfo = {id: toastID}
      if (jsb.isPlainObject(info)) {
        const aimToast = jsb.pathGet(info, 'aim_toast')
        if (aimToast) {
          toastContent = jsb.pathGet(aimToast, 'content', '')
          toastType = jsb.pathGet(aimToast, 'type', toastType)
          // 逻辑层明确指定
          needToast = toastContent !== ''
        }
        toastInfo = aimToast || {}
        if (!toastInfo['id']) {
          toastInfo.id = toastID
        }
      }
      if (needToast && toastContent) {
        jsb.cc.toast(toastType, toastContent, toastInfo)
      }
    },
    // eslint-disable-next-line no-unused-vars
    tryPromise(funcName, params, done = null, okToast = '') {
      params = params || {}
      const funcToCall = jsb.pathGet(this.proxyConfigRef, funcName)
      if (!funcToCall) {
        const error = `proxy中未指定 ${funcName} 方法`
        done && done({error})
        !this.proxyConfigRef.isLocalData && this.toastWarning(error)
        return
      }
      this.inLoading = true
      // 填充预设基础参数
      jsb.each(this.proxyParameter, (v, k) => {
        if (!params[k]) {
          params[k] = v
        }
      })
      params['aimTableSchema'] = this.schema

      return Promise.resolve(funcToCall(params)).then((resp) => {
        this.tryToast('success', resp, okToast)
        done && done({resp})
      }).catch(error => {
        this.inLoading = false
        aimTableError(`tryPromise ${funcName} err:${error.toString()}`, error.stack)
        done && done({error})
        if (!jsb.pathGet(error, '__toasted', false)) {
          this.tryToast('error', error, error.toString())
        }
      }).finally(() => {
        this.inLoading = false
      })
    },
    trySaveField(field, {done} = {}) {
      const toSave = CleanRowForStorage(
          this.schema,
          this.tableData,
          true,
          true,
          this.proxyConfigRef.submitRemoveFieldNotInSchema,
          this.proxyConfigRef.row2Item
      )
      return this.tryPromise('saveField', {
        tableData: toSave,
        field
      }, ({error}) => {
        done && done({error})
      }, `字段 ${field} 已保存`)
    },
    // eslint-disable-next-line no-unused-vars
    trySaveTableData({done,okQuery} = {}) {
      const rows = CleanRowForStorage(
          this.schema,
          this.tableData,
          true,
          true,
          this.proxyConfigRef.submitRemoveFieldNotInSchema,
          this.proxyConfigRef.row2Item
      )
      return this.__save_rows(done,okQuery,'saveTableData',{tableData:rows})
    },
    // eslint-disable-next-line no-unused-vars
    sortIdxChanged(rows,{done,okQuery} = {}) {
      return this.__save_rows(done,okQuery,'sortIdxChanged',{rows})
    },
    // eslint-disable-next-line no-unused-vars
    __save_rows(done,okQuery,funcName,params) {
      return this.tryPromise(funcName, params, ({error}) => {
        if (!error && okQuery) {
          this.fresh()
        }
        done && done({error})
      }, '数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyDelete(row, {done} = {}) {
      if (!isCtrlRemote(row)) {
        // 非远端数据，直接删除
        jsb.remove(this.tableData, item => xidRow(item) === xidRow(row))
        done && done()
        return
      }
      this.deleteAsking('delete', {row}, {done})
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyDeleteRows(rows, {done} = {}) {
      const leftRows = []
      jsb.each(rows, row => {
        if (!isCtrlRemote(row)) {
          // 非远端数据，直接删除
          jsb.remove(this.tableData, item => xidRow(item) === xidRow(row))
        } else {
          leftRows.push(row)
        }
      })
      if (leftRows.length === 0) {
        done && done()
        return
      }
      this.deleteAsking('deleteRows', {rows: leftRows}, {done})
    },
    deleteAsking(funcName, {row, rows}, {done} = {}) {
      //如果是本地数据删除则需要依赖ctrl字段等字段维护映射关系，如果是远端删除则无需这些数据
      const removeCtrlData = !this.proxyConfigRef.isLocalData
      if (removeCtrlData) {
        row = CleanRowForStorage(
            this.schema, row,
            true, true,
            this.proxyConfigRef.submitRemoveFieldNotInSchema,
            this.proxyConfigRef.row2Item)
        const rowsToDelete = rows
        rows = []
        jsb.each(rowsToDelete, v => {
              const tmp = CleanRowForStorage(
                  this.schema, v,
                  true, true,
                  this.proxyConfigRef.submitRemoveFieldNotInSchema,
                  this.proxyConfigRef.row2Item)
              rows.push(tmp)
            }
        )
      }
      this.__deleteAsking(funcName, {row: row, rows: rows}, {done})
    },
    // eslint-disable-next-line no-unused-vars
    __deleteAsking(funcName, {row, rows}, {done} = {}) {
      this.debug && (this.debugMessage = `${funcName} called`)
      const _this = this
      const confirmDoneFunc = () => {
        _this.tryPromise(funcName, {row, rows}, function ({error}) {
          if (!error) {
            if (!_this.proxyConfigRef.deleteAsync) {
              _this.proxyQueryData()
            }
          }
          done && done({error})
        }, '数据已删除')
      }
      const confirmConfig = deleteConfirmConfig(this.proxyConfigRef, {row, rows})
      if (confirmConfig.enable && !this.proxyConfigRef.isLocalData) {
        // 如果是本地数据proxy不再询问
        confirmConfig.doneFunc = confirmDoneFunc
        jsb.cc.confirmDelete(_this, confirmConfig)
      } else {
        confirmDoneFunc()
      }
    },
    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done, old} = {}) {
      // 本地proxy的数据依赖xid定位，保留xid数据
      const removeCtrlData = !this.proxyConfigRef.isLocalData

      let toSave = CleanRowForStorage(
          this.schema,
          row,
          true, removeCtrlData,
          this.proxyConfigRef.submitRemoveFieldNotInSchema,
          this.proxyConfigRef.row2Item)
      if (old) {
        old = CleanRowForStorage(
            this.schema,
            old,
            true, removeCtrlData,
            this.proxyConfigRef.submitRemoveFieldNotInSchema,
            this.proxyConfigRef.row2Item)
      }

      const saveValidate = jsb.pathGet(this.proxyConfigRef, 'saveValidate')
      if (saveValidate) {
        const validORMessage = saveValidate({row: toSave, old: old})
        if (jsb.isBoolean(validORMessage)) {
          if (!validORMessage) {
            done && done({error: true})
            return
          }
        } else if (jsb.isString(validORMessage) && validORMessage !== "") {
          this.toastWarning(validORMessage)
          done && done({error: true})
          return
        }
      }

      return this.tryPromise('save', {row: toSave, old: old}, ({error}) => {
        if (!error) {
          this.doLayout(true)
        }
        done && done({error})
      }, '数据已保存')
    },
    // eslint-disable-next-line no-unused-vars
    filterSearch({done, params, mode = {}} = {}) {
      if (this.isFilterRemote()) {
        params = params || {}
        params.FilterMode = mode
        this.proxyQueryData({done, params})
        return
      }
      // 本地筛选数据
      const conditions = {}
      this.remoteFilterDataToParams(conditions)
      if (jsb.keys(conditions).length === 0) {
        this.tableDataFiltered = null
      } else {
        this.tableDataFiltered = localFilter(this.tableData, conditions, mode)
      }
    },
    // eslint-disable-next-line no-unused-vars
    proxyQueryData({done, params} = {}) {
      let hasFilter = false
      if (this.isFilterRemote()) {
        hasFilter = this.remoteFilterDataToParams(params)
      }
      if (this.pagerConfigRef.enable) {
        params = this.PagerAddToParams(params)
      }
      params = this.addRemoteSortParams(params)

      this.queryCount += 1
      return this.tryPromise('query', {params: params, queryCount: this.queryCount}, ({resp, error}) => {
        if (resp) {
          // 不能直接赋值，vue检测array元素变化存在一些问题
          // if (this.isModeInplace()) {
          //   // inPlace模式下直接使用传入的数据，增加入proxy，编辑，缺少提交的窗口
          //   this.tableData = jsb.pathGet(resp, 'Data')
          //   this.processTableData(this.tableData)
          // } else {
          //   this.tableData = []
          //   const _this = this
          //   jsb.each(this.processTableData(jsb.pathGet(resp, 'Data')), (item) => {
          //     _this.tableData.push(item)
          //   })
          // }
          this.tableData.splice(0, this.tableData.length)
          const _this = this
          jsb.each(this.processTableData(jsb.pathGet(resp, 'Data')), (item) => {
            _this.tableData.push(item)
          })


          this.PagerTotal = jsb.pathGet(resp, 'PagerTotal')
          if (!this.PagerTotal) {
            this.PagerTotal = jsb.pathGet(resp, 'Total', this.tableData.length)
          }
          // 没有filter 且没有激活pager的情况下检测数据长度
          if (!hasFilter && !this.pagerConfigRef.enable && this.PagerTotal > this.tableData.length) {
            this.toastWarning(`未激活分页模式，获取到 ${this.tableData.length} 行数据，总数据行数 ${this.PagerTotal}`)
          }

          this.treeProps = Object.assign(this.treeProps, jsb.pathGet(resp, 'treeProps'))
          if (this.treeProps.enable) {
            if (jsb.pathGet(this.treeProps, 'transfer')) {
              // 转换为树形数据
              this.tableData = jsb.arrayToTree(this.tableData, this.treeProps)
            } else {
              // 无需转行的行处理添加控制信息，如 xid
              jsb.eachTree(this.tableData, v => {
                if (v[this.treeProps.children]) {
                  v[this.treeProps.children] = this.processTableData(v[this.treeProps.children])
                }
              })
            }
          }
          this.doLayoutNextTick(true)
          if (this.afterQueryData) {
            this.afterQueryData()
          }
        }
        done && done({error})
      })
    },
    // remoteFilterDataToParams 远端模式下使用该方式填充数据并进行格式化操作
    remoteFilterDataToParams(params) {
      params = params || {}
      const _this = this
      let hasFilterData = false
      jsb.each(_this.filterData, function (val, key) {
        const filter = _this.filterTypeMapping[key]
        let formatter = jsb.pathGet(filter, 'formatter')
        if (!formatter) {
          formatter = jsb.pathGet(filter, 'format')
        }
        const valFormatted = formatter ? formatter(val) : formatValue(filter.type, val)
        if (!valFormatted) {
          return
        }
        hasFilterData = true
        if (filter['fieldRemote']) {
          params[filter['fieldRemote']] = valFormatted
        } else {
          params[key] = valFormatted
        }
      })
      return hasFilterData
    },
    rowWatchFunc(expOrFn, callback, options) {
      this.rowWatcher.push(this.$watch(expOrFn, callback, options))
    },
    cleanRowWatcher() {
      // 取消之前的监听器
      this.rowWatcher.forEach((watcher) => watcher());
      this.rowWatcher = []
    },
    processTableData(data) {
      data = cleanDataForTable(data, this.schema, this.proxyConfigRef.item2Row)
      return this.sortTableData(data)
    },
    sortTableData(data) {
      if (!this.sortConfigRef.enable || this.sortConfigRef.remote) {
        // 远端排序
        return data
      }
      const _this = this
      const orders = []
      jsb.each(this.sortConfigRef.orders || [], v => {
        const fs = jsb.find(_this.schema, fs => fs.field === v.field)
        v.orderFunc = v.orderFunc || fs?fs.sortMethod:null
        orders.push(v)
      })
      if (orders.length > 0) {
        data = jsb.orderBy(data, orders)
      }
      return data
    }
  }
}
</script>
