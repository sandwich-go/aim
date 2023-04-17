<script>
import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinCellEditorConfig',
  props: {
    cellConfig:{},          // 组件配置
    data: Object,           // 父对象数据，必须是一个Object,组件的model为data[fieldName]
    options:[Function,Array],
    fieldName: String,

    styleOverride: Object, // 便于组件覆盖基础配置，如form中所有的元素设定为100% width，但是少数对象如checkbox不允许100%
    styleBase: Object,     // 便于父对象定义基础配置，如form中所有的元素设定为100% width
    disabled: Boolean,    // 是否只读
  },
  data() {
    const _this = this
    return {
      dataRef: {},
      cc: {
        style: {},
        change: _this.emitChange
      }
    }
  },
  created() {
    if (this.data) {
      this.dataRef = this.data
    }
  },
  methods: {
    emitChange(valNew) {
      this.$emit("input", valNew)
    },
    ccConfigMerge(initVal = {}) {
      const _this = this
      // styleDefault => styleBase => styleUser => styleOverride
      const mergeFiled = ['style']
      this.cc.style = Object.assign(this.cc.style, this.styleBase)
      jsb.each(initVal, function (val, key) {
        if (mergeFiled.includes(key)) {
          _this.cc[key] = jsb.merge(_this.cc[key], val)
        } else {
          _this.cc[key] = val
        }
      })
      if (jsb.isPlainObject(this.cellConfig)) {
        this.cc = Object.assign(this.cc, this.cellConfig)
      }
      this.cc.style = jsb.assign(this.cc.style, this.styleOverride)
    },
    change(newVal) {
      this.$forceUpdate()
      if (this.cc.change) {
        this.cc.change(newVal)
      }
    },
    getOptions() {
      return (jsb.isFunction(this.options)?this.options():this.options) || []
    },
    emitData(options){
      return Object.assign({
        // 这里使用实际数据
        fieldValue:jsb.pathGet(this.data,this.fieldName)
      },options)
    }
  }
}
</script>
