<script>
import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinComponentConfig',
  props: {
    scopeConfig:Object,   // 组件配置
    data: null,           // 父对象数据，组件的model为data[fieldName]
    fieldName:{
      type:String,
      default:'value'
    },
    disabled: Boolean,    // 是否只读
    styleOverride:Object,
    styleBase:Object
  },
  data() {
    const _this = this
    return {
      dataRef: {},
      cc: {
        size:'mini',
        style: {},
        change: _this.emitChange
      }
    }
  },
  created() {
    if(this.data){
      this.dataRef = this.data
    }
  },
  methods: {
    emitChange(valNew) {
      this.$emit("input", valNew)
    },
    initComponentConfig(initVal={}) {
      const _this = this
      // styleDefault => styleBase => styleUser => styleOverride
      const mergeFiled = ['style']
      this.cc.style = Object.assign(this.cc.style,this.styleBase)
      jsb.each(initVal,function (val,key){
        if(mergeFiled.includes(key)){
          _this.cc[key] = jsb.merge(_this.cc[key],val)
        }else{
          _this.cc[key] = val
        }
      })
      this.cc = Object.assign(this.cc,this.scopeConfig)
      this.cc.style = jsb.assign(this.cc.style,this.styleOverride)
    },
    change(newVal) {
      this.$forceUpdate()
      if (this.cc.change) {
        this.cc.change(newVal)
      }
    },
    options() {
      return (jsb.isFunction(this.cc.options)?this.cc.options():this.cc.options) || []
    }
  }
}
</script>
