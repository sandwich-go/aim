<script>
import {
  EditTriggerClick,
  EditTriggerDBLClick,
  EditTriggerManualAndDBLClick,
  EditTriggerManual,
  EditModeFormInput, isModeInplace,
} from "@/components/AimTable/table";
import {CodeButtonRowDelete, CodeButtonRowSave} from "@/components/cells/const";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {
  AimFormInputCopy,
  AimFormInputEdit, AimFormInputInsert,
  AimFormInputView
} from "@/components/AimFormInput";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinEdit',
  props: {
    editConfig: Object,
  },
  mixins:[CreateMixinState()],
  data() {
    return {
      // 如果未传递editConfig则认为禁用edit
      editConfigRef: this.editConfig || {enable: false},
    }
  },
  created() {
    jsb.objectAssignNX(this.editConfigRef, {
      enable: true,
      trigger: EditTriggerManualAndDBLClick,
      mode: EditModeFormInput,
      formWrapperDrawer:true,
      // 当尝试编辑某一行时回调该方法
      // eslint-disable-next-line no-unused-vars
      triggerRowFunc: function ({row}) {
        // 如果只是返回字符串则：view状态，显示alert信息
        return true
      },
      // 新建一行数据
      newRow(schema, row) {
        return FillDefaultDataWithSchema(schema, row)
      },
      // 拷贝一行数据,逻辑层替换关键数据
      // eslint-disable-next-line no-unused-vars
      copyRow(row) {
        jsb.each(['Id', 'ID', 'id'], function (key) {
          delete row[key]
        })
        return row
      },
      // eslint-disable-next-line no-unused-vars
      formEditorCells: function ({row,mode}) {
        if(mode === AimFormInputInsert || mode === AimFormInputCopy) {
          return [CodeButtonRowSave]
        }
        return [CodeButtonRowDelete, CodeButtonRowSave]
      },
      // eslint-disable-next-line no-unused-vars
      formHeaderSlot:'',
      formFooterSlot:'',
    })
    this.debug && this.setDebugMessage("editConfig",JSON.stringify(this.editConfigRef))
  },
  methods: {
    updateRowInEdit(row) {
      this.debug && this.setDebugMessage(`rowInEdit  ${JSON.stringify(row)}`)
      if(this.isModeInplace()){
        // 本地编辑时切换为非编辑状态
        this.rowInEdit = row === this.rowInEdit?null:row
      }else{
        this.rowInEdit = row
      }
      if(this.rowInEdit){
        this.updateRowWatcher(this.rowInEdit)
      }
    },
    rowClickWithTriggerName(row, triggerName) {
      this.currentChange(row)
      if (!this.isEditTriggerAccepted(triggerName)) {
        return;
      }
      const triggerRet = this.editConfigRef.triggerRowFunc({row: row})

      this.rowEditState = AimFormInputEdit
      this.rowEditorAlert = null

      if (jsb.isString(triggerRet)) {
        // 如果只是返回字符串则：view状态，显示alert信息
        this.rowEditState = AimFormInputView
        this.rowEditorAlert = triggerRet
      } else if (jsb.isObjectOrMap(triggerRet)) {
        // 如果返回的是一个object，索引其中的:active与alert字段
        // active默认为true, 如为true则进入edit状态
        // 可根据需求定制返回alert的样式
        if (jsb.pathGet(triggerRet, 'active', true)) {
          this.rowEditState = jsb.pathGet(triggerRet, 'mode', AimFormInputEdit)
        }
        this.rowEditorAlert = jsb.pathGet(triggerRet, 'alert')
      } else if (!triggerRet) {
        // 不允许编辑
        return;
      }
      if (this.isModeInplace() && this.rowEditState === AimFormInputView && this.rowEditorAlert) {
        this.toastError(this.rowEditorAlert, {timeout: 3000})
        return
      }
      this.setEditRow(row)
    },
    // 设定当前编辑的行
    setEditRow(row) {
      this.debug && this.setDebugMessage(`setEditRow row  ${this.summaryRow(row)}`)
      this.currentRow = row
      this.updateRowInEdit(row)
      if (!this.isModeInplace()) {
        // form 表单编辑逻辑
        this.showFormEditorForRow(this.rowInEdit)
      }
    },
    showFormEditorForRow(row) {
      // form 表单编辑逻辑,拷贝当前编辑行
      this.rowInEditForm = jsb.clone(row)
      this.rowInEditFormBackup = jsb.clone(this.rowInEditForm)
      // 使用form的watcher
      this.cleanRowWatcher()
      this.rowFormEditorVisible = true
    },
    isModeInplace() {
      return isModeInplace(this.editConfigRef.mode)
    },
    privateRowDblClick(row) {
      if(this.rowDbClick){
        // 逻辑层拦截
        const ret = this.rowDbClick({row})
        if (ret){
          return
        }
      }
      this.rowClickWithTriggerName(row, EditTriggerDBLClick)
    },
    privateRowClick(row) {
      if(this.rowClick){
        // 逻辑层拦截
        const ret = this.rowClick({row})
        if (ret){
          return
        }
      }
      this.rowClickWithTriggerName(row, EditTriggerClick)
    },
    // isTriggerAccepted triggerName是否符合设定的编辑策略
    isEditTriggerAccepted(triggerName) {
      if (this.readOnly || !this.editConfigRef || !this.editConfigRef.enable) {
        return false;
      }
      if (this.editConfigRef.trigger === triggerName) {
        return true
      }
      return this.editConfigRef.trigger === EditTriggerManualAndDBLClick && (triggerName === EditTriggerManual || triggerName === EditTriggerDBLClick);
    },
  }
}
</script>
