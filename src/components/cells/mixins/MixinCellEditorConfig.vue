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
    tableDataGetter:Function,
  },
  watch:{
    options: {
      handler: function () {
        this.fetchOptionsData()
      },
      deep:true
    }
  },
  data() {
    const _this = this
    return {
      dataRef: {},
      cc: {
        style: {},
        change: _this.emitChange,
        clearable:true,
      },
      inOptionLoading:false,
      optionsUsing:[],
      optionsRefresh:false,
      fieldSchemaRef:this.fieldSchema,
    }
  },
  async created() {
    if (this.data) {
      this.dataRef = this.data
    }
    await this.fetchOptionsData()
  },
  methods: {
    optionsParameter(force=false){
      return {force:force,parent:this.dataRef,row:this.getRow?this.getRow():null,table:this.tableDataGetter?this.tableDataGetter():null}
    },
    async manualFetchOptionsData() {
      return this.fetchOptionsData(true)
    },
    async fetchOptionsData(force=false) {
      try {
        this.inOptionLoading = true
        await this.__fetchOptionsData(force)
      }catch (error){
        if(this.fieldSchemaRef){
          this.fieldSchemaRef.errorMessage = error
        }else{
          console.log("aim option fresh got error ",error)
        }
      }finally {
        this.inOptionLoading = false
      }
    },
    async __fetchOptionsData(force=false) {
      let optionsGot = []
      let tmpOptionsRefresh = false
      if (typeof this.options === 'function') {
        tmpOptionsRefresh = true
        // 如果 options 是一个函数，则调用它并等待它的返回值
        optionsGot = this.options(this.optionsParameter(force));
        if(optionsGot instanceof Promise){
          optionsGot = await optionsGot;
        }
      } else if (this.options instanceof Promise) {
        tmpOptionsRefresh = true
        // 如果 options 是一个 Promise，则等待 Promise 完成并赋值给 optionsInner
        optionsGot = await this.options;
      } else if (Array.isArray(this.options)) {
        tmpOptionsRefresh = false
        // 如果 options 是一个数组,直接赋值
        optionsGot = this.options;
      }
      let autoGroupField = ''
      let autoGroupSort = ''
      if(jsb.isObjectOrMap(optionsGot)){
        tmpOptionsRefresh = jsb.pathGet(optionsGot,'refresh',false)
        autoGroupField = jsb.pathGet(optionsGot,'autoGroup','')
        autoGroupSort = jsb.pathGet(optionsGot,'autoGroupSort','desc')
        optionsGot = jsb.pathGet(optionsGot,'options',[])
      }
      this.optionsUsing = []
      jsb.each(this.optionsFmt(optionsGot,autoGroupField,autoGroupSort),v=>{
        this.optionsUsing.push(v)
      })
      this.optionsRefresh = tmpOptionsRefresh
    },
    optionsTryGroup(options,field,autoGroupSort){
      let group2Options = {}
      jsb.each(options,item=>{
        const groupVal = item[field] || ''
        if(!group2Options[groupVal]){
          group2Options[groupVal] = []
        }
        group2Options[groupVal].push(item)
      })
      let optionGroup = []
      jsb.each(group2Options,(item,key)=>{
        optionGroup.push({label:key,options:item})
      })
      // 优先显示group
      optionGroup = jsb.orderBy(optionGroup,[{field:'label',order:autoGroupSort}])

      if(optionGroup.length === 1 && optionGroup[0].label===""){
        return optionGroup[0].options
      }
      return optionGroup
    },
    optionsFmt(optionsGot,autoGroupField,autoGroupSort){
      const options = []
      // 将数组转换为option对象
      jsb.each(optionsGot,v=>{
        if(jsb.isString(v) || jsb.isNumber(v)){
          options.push({label:v,value:v})
        }else{
          options.push(v)
        }
      })
      if(autoGroupField) {
        // 如果option的属性字段中含有aimGroup,则自动将其聚合为group
        return this.optionsTryGroup(options,autoGroupField,autoGroupSort)
      }
      return options
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
