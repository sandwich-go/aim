<script>
import MixinPager from "@/components/AimTable/mixins/MixinPager.vue";
import jsb from "@sandwich-go/jsb";
import {AimFormInputView} from "@/components/AimFormInput";
import {xidRow} from "@/components/AimTable/table";

export default {
  name: 'MixinState',
  mixins: [MixinPager],
  props: {
    enableDebug: Boolean,
    schema:Array,
    readOnly: Boolean,
    groupConfig:Array,
  },
  data() {
    return {
      tipMessage:'',
      stateXID: jsb.xid(),
      tableData: [],
      tableDataFiltered: null,
      currentRow: null,
      radioChecked:null,
      rowInEdit: null,
      rowInEditForm: null, // form正在编辑的行，区别于rowInEdit，form正在编辑的行需要完整拷贝rowInEdit，便于取消提交操作时的回滚操作
      rowInEditFormBackup: null,

      rowFormEditorVisible: false,
      inLoading: false,
      rowEditorAlert: null,
      rowEditState: AimFormInputView,
      funcProcessQueryParams: [],
      sortConfigRef:{},
      // schema中抽取而来的filter cell
      filterData:{},
      filterTypeMapping:{},
      debug:this.enableDebug,
      inSortIndexEdit:false,
      sortIndexChanged:false,
    }
  },
  watch:{
    // eslint-disable-next-line no-unused-vars
    rowEditState(v){
    }
  },
  methods: {
    tipWarning(message) {
      this.tipMessage = message
    },
    updateRowWatcher(row) {
      //移除老旧watcher
      this.cleanRowWatcher()
      if(!row) {
        return;
      }
      const _this = this
      jsb.each(_this.schema,function (fieldSchema){
        if(!fieldSchema.watch){
          return
        }
        _this.rowWatchFunc(() => row[fieldSchema.field],(newValue, oldValue) => {
          fieldSchema.watch({newValue, oldValue,row})
        },fieldSchema.watchOptions || fieldSchema.watchOption);
      })
    },
    getTableRef() {
      return this.$refs.table
    },
    thisTarget() {
      return this
    },
    fresh({done,params}={}){
      this.proxyQueryData({done,params})
    },
    clean(){
      this.tableData = []
      this.PagerTotal = 0
      if(this.pagerConfigRef){
        this.pagerConfigRef.PagerAutoGenPage = 0
      }
    },
    getData(){
      return this.tableData
    },
    each(visitor){
      jsb.each(this.tableData || [],visitor)
    },
    eachSelected(visitor,clean=false){
      jsb.each(this.getSelectionRows(clean),visitor)
    },
    setInLoading(inLoading,tryForm=false){
      if(inLoading){
        if(tryForm && this.$refs.aimFormInput){
          // tryForm时如果 form 存在则只设定 form
          this.$refs.aimFormInput.setInLoading(inLoading)
          return
        }
        this.inLoading = inLoading
      }else{
        // 设定为 false 时都尝试一次
        this.inLoading = false
        this.$refs.aimFormInput && this.$refs.aimFormInput.setInLoading(false)
      }
    },
    setLoading(inLoading,tryForm=false){
      this.setInLoading(inLoading,tryForm)
    },
    summaryRow(row) {
      let info = [`xid(${xidRow(row)})`]
      jsb.each(this.schema, function (fieldSchema) {
        if (fieldSchema.summary) {
          info.push(`${fieldSchema.name}(${row[fieldSchema.field]})`)
        }
      })
      return info.join(" , ")
    }
  },
}
</script>