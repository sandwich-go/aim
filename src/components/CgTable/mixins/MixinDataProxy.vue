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
    tryProxyDeleteRow(row, {done} = {}) {
      this.debug && (this.debugMessage = `tryProxyDeleteRow called ${this.summaryRow(row)}`)
      const deleteFunc = this.proxyConfigRef.delete
      if (!deleteFunc) {
        this.toastWarning("proxy中未指定delete方法")
        return
      }
      const confirmConfig = deleteConfirmConfig(this.proxyConfigRef, row)
      const _this = this
      confirmConfig.doneFunc = () => {
        _this.inLoading = true
        Promise.resolve(deleteFunc({row})).then(() => {
          this.toastSuccess("删除成功")
          this.tryProxyQueryData()
          done && done()
        }).catch(e => {
          this.toastError(e)
          done && done(e)
        }).finally(() => {
          this.inLoading = false
        })
      }
      jsb.cc().confirm(_this, confirmConfig)
    },
    // eslint-disable-next-line no-unused-vars
    tryProxySaveRow(row, {done} = {}) {
      this.debug && (this.debugMessage = `tryProxySaveData called ${this.summaryRow(row)}`)
      const saveFunc = this.proxyConfigRef.save
      if (!saveFunc) {
        this.toastWarning("proxy中未指定save方法")
        return
      }
      this.inLoading = true
      const rowClean = removeCtrlData(jsb.clone(row))
      Promise.resolve(saveFunc({row: rowClean})).then(() => {
        this.toastSuccess("提交成功")
        done && done()
        this.tryProxyQueryData()
      }).catch(e => {
        done && done(e)
        this.toastError(e)
      }).finally(() => {
        this.inLoading = false
      })
    },
    // eslint-disable-next-line no-unused-vars
    tryProxyQueryData({done} = {}) {
      this.debug && (this.debugMessage = `tryProxyQueryData called`)
      const queryFunc = this.proxyConfigRef.query
      if (!queryFunc) {
        return
      }
      let params = {}
      this.inLoading = true
      Promise.resolve(queryFunc({params: params})).then((ret) => {
        this.tableData = cleanData(jsb.pathGet(ret, 'Data'))
        this.PagerTotal = jsb.pathGet(ret, 'Total', this.tableData.length)
        done && done()
      }).catch(e => {
        done && done(e)
        this.toastError(e)
      }).finally(() => {
        this.inLoading = false
      })
    },
  }
}
</script>
