<script>
import jsb from "@sandwich-go/jsb";

// 动态组件的数据为data[fieldName]，组件属性为cellConfig，区分的比较明确
// 静态组件显示的数据可能直接来自 formatter(data[fieldName])，也可能被转化成了cellConfig(如tag属性)
export default {
  name: 'MixinCell',
  props: {
    // fixme options与formatter在fieldSchema存在的情况下并不需要传递
    // 可编辑组件关联的数据: data[fieldName],但并非所有组件都需要，如只读组件，只读组件的渲染依赖cellConfig完成
    fieldName: String,      // 组件关联的数据名称
    data: Object,           // 父对象数据，必须是一个Object,组件的model为data[fieldName]
    formatter: Function,     // 数据格式化化方法，当数据用于显示时，显示的数据为formatter(data[fieldName])
    // 组件配置，使用v-bind直接绑定
    cellConfig: {},
    // 特殊配置,当cell需要option时
    options: [Function, Array],
    // table或object按trigger模式配置时需要通过fieldSchema定位fields字段数据
    fieldSchema: Object,
    // 动态属性，外层根据row数据等决定当前组件状态
    disabled: Boolean,
    // 内部使用, 便于在不同场景时根据使用场景设定style, 最终style = styleDefault + styleBase + styleUser + styleOverride
    styleOverride: Object,  // 便于组件覆盖基础配置，如form中所有的元素设定为100% width，但是少数对象如checkbox不允许100%
    styleBase: Object,      // 便于父对象定义基础配置，如form中所有的元素设定为100% width
  },
  data() {
    const _this = this
    return {
      dataRef: this.data || {},
      cc: {
        size:'mini',
        style: {},
        change: _this.emitChange
      }
    }
  },
  computed: {
    optionsComputed() {
      let options = this.options
      if (!options) {
        options = jsb.pathGet(this.fieldSchema, 'options', [])
      }
      return (jsb.isFunction(options) ? options() : options) || []
    },
    fieldValueFormatted(){
      const formatter = this.formatter || function ({value}) {return value}
      return formatter({value:jsb.pathGet(this.data, this.fieldName,null),row:this.data})
    },
  },
  methods: {
    emitChange(valNew) {
      this.$emit("input", valNew)
    },
    calcWidthPixString(defaultVal) {
      this.cc.style.width = this.cc.style.width ? (jsb.isString(this.cc.style.width) ? this.cc.style.width : `${this.cc.style.width}px`) : defaultVal
      return this.cc.style.width
    },
    // ccMerge 合并组件配置
    ccMerge(initVal = {}) {
      const _this = this
      // style = styleDefault + styleBase + styleUser + styleOverride
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
      if (!this.cc.placeholder) {
        this.cc.placeholder = jsb.pathGet(this.fieldSchema, 'placeholder', '')
      }
    },
    change(newVal) {
      this.$forceUpdate()
      if (this.cc.change) {
        this.cc.change(newVal)
      }
    },
    emitClick(jsEvent) {
      this.emitClickWithCode(jsEvent, this.cc.code)
    },
    emitClickWithCode(jsEvent, code) {
      this.$emit('code-cell-click', {code: code, jsEvent: jsEvent})
    },
    emitData(options) {
      return Object.assign({
        // 这里使用实际数据
        fieldValue: jsb.pathGet(this.data, this.fieldName)
      }, options)
    }
  }
}
</script>
