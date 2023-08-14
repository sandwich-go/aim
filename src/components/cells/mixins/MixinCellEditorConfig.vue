<script>
import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinCellEditorConfig',
  props: {
    cellConfig:{},          // 组件配置，editor的cellConfig必须为Object,但是对viewer可以为组件需要的值

    data: Object,           // 父对象数据，必须是一个Object,组件的model为data[fieldName]
    fieldName: String,

    formatter:Function, // 格式化化方法

    options:[Function,Array,Promise],

    styleOverride: Object, // 便于组件覆盖基础配置，如form中所有的元素设定为100% width，但是少数对象如checkbox不允许100%
    styleBase: Object,     // 便于父对象定义基础配置，如form中所有的元素设定为100% width
    disabled: Boolean,    // 是否只读

    fieldSchema:Object,   // trigger时需要通过fieldSchema定位fields字段数据

    getRow:Function,
  },
  data() {
    const _this = this
    return {
      dataRef: {},
      cc: {
        style: {},
        change: _this.emitChange
      },
      optionsUsing:[],
    }
  },
  async created() {
    if (this.data) {
      this.dataRef = this.data
    }
    await this.fetchOptionsData()
  },
  methods: {
    async fetchOptionsData() {
      if (typeof this.options === 'function') {
        // 如果 options 是一个函数，则调用它并等待它的返回值（一个 Promise）
        this.optionsUsing = await this.options();
      } else if (this.options instanceof Promise) {
        // 如果 options 是一个 Promise，则等待 Promise 完成并赋值给 optionsInner
        this.optionsUsing = await this.options;
      } else if (Array.isArray(this.options)) {
        // 如果 options 是一个数组，则直接赋值给 optionsInner
        this.optionsUsing = this.options;
      }
    },
    emitChange(valNew) {
      this.$emit("input", valNew)
    },
    calcWidthPixString(defaultVal){
      this.cc.style.width = this.cc.style.width?(jsb.isString(this.cc.style.width)?this.cc.style.width : `${ this.cc.style.width}px`):defaultVal
      return this.cc.style.width
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
      this.cc.placeholder = jsb.pathGet(this.fieldSchema,'placeholder',this.cc.placeholder )
    },
    change(newVal) {
      this.$forceUpdate()
      if (this.cc.change) {
        this.cc.change(newVal)
      }
    },
    emitClick(jsEvent) {
      this.$emit('code-cell-click', {code: this.cc.code, jsEvent: jsEvent})
    },
    emitClickWithCode(jsEvent,code) {
      this.$emit('code-cell-click', {code: code, jsEvent: jsEvent})
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
