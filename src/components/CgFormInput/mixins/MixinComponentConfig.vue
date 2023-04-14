<script>
import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinComponentConfig',
  props: {
    fieldSchema: Object,     // 字段属性
    data: Object,            // 父对象数据
    rowTop:Object,           // 顶层行对象
    disabled: Boolean,       // 是否只读
  },
  data() {
    return {
      dataRef:{},
      cc: {
        style:{width:"100%"},
        change: function (valNew) {
          this.$emit("input", valNew)
        }
      }
    }
  },
  created() {
    this.dataRef = this.data
  },
  methods: {
    initComponentConfig(initVal){
      this.cc = initVal?Object.assign(this.cc,initVal):this.cc
      this.cc = Object.assign(this.cc,jsb.pathGet(this.fieldSchema,'formConfig',this.fieldSchema))
    },
    change(newVal){
      this.$forceUpdate()
      if(this.cc.change){
        this.cc.change(newVal)
      }
    },
    fieldName() {
      return this.fieldSchema['field']
    },
    options() {
      let ret = this.__fieldOptions(this.cc)
      if(jsb.isNull(ret)){
        ret = this.__fieldOptions(this.fieldSchema)
      }
      return ret || []
    },
    __fieldOptions(parent){
      if(parent.options) {
        if(jsb.isFunction(parent.options)) {
          return parent.options({fieldSchema:this.fieldSchema,row:this.rowTop})
        }
        return parent.options
      }
      return null
    }
  }
}
</script>
