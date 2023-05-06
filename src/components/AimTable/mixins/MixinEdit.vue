<script>
import {
  EditTriggerClick,
  EditTriggerDBLClick,
  EditTriggerDBLClickOrSwitcher,
  EditTriggerSwitchButton, mustCtrlData,
  RowEditorFormInput, RowEditorInplace
} from "@/components/AimTable/table";
import {CodeButtonRowDelete, CodeButtonRowHistory, CodeButtonRowSaveRemote} from "@/components/cells/const";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";
import {
  AimFormInputModeCopy,
  AimFormInputModeEdit,
  AimFormInputModeInsert,
  AimFormInputModeView
} from "@/components/AimFormInput";
import {defaultRow} from "@/components/AimTable/schema";

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
      trigger: EditTriggerDBLClickOrSwitcher,
      rowEditor: RowEditorFormInput,
      // 当尝试编辑某一行时回调该方法
      // eslint-disable-next-line no-unused-vars
      triggerRowFunc: function ({row}) {
        // 如果只是返回字符串则：view状态，显示alert信息
        return true
      },
      // 新建一行数据
      newRow(schema, row) {
        return defaultRow(schema, row)
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
      formEditorCells: function ({row}) {
        return [CodeButtonRowSaveRemote, CodeButtonRowDelete, CodeButtonRowHistory]
      }
    })
  },
  methods: {
    updateRowInEdit(row) {
      this.rowInEdit = row
    },
    rowClickWithTriggerName(row, triggerName) {
      this.currentChange(row)
      if (!this.isEditTriggerAccepted(triggerName)) {
        return;
      }
      const triggerRet = this.editConfigRef.triggerRowFunc({row: row})

      this.rowEditorMode = AimFormInputModeEdit
      this.rowEditorAlert = null

      if (jsb.isString(triggerRet)) {
        // 如果只是返回字符串则：view状态，显示alert信息
        this.rowEditorMode = AimFormInputModeView
        this.rowEditorAlert = triggerRet
      } else if (jsb.isObjectOrMap(triggerRet)) {
        // 如果返回的是一个object，索引其中的:active与alert字段
        // active默认为true, 如为true则进入edit状态
        // 可根据需求定制返回alert的样式
        if (jsb.pathGet(triggerRet, 'active', true)) {
          this.rowEditorMode = AimFormInputModeEdit
        }
        this.rowEditorAlert = jsb.pathGet(triggerRet, 'alert')
      } else if (!triggerRet) {
        // 不允许编辑
        return;
      }
      if (this.isInplaceEditor() && this.rowEditorMode === AimFormInputModeView && this.rowEditorAlert) {
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
      if (!this.isInplaceEditor()) {
        // form 表单编辑逻辑
        this.rowFormEditorVisible = true
      }
    },
    addRow({initRow, isCopy} = {initRow: {}, isCopy: false}) {
      if (jsb.eqNull(this.tableData)) {
        this.tableData = []
      }
      this.rowEditorAlert = ''
      this.rowEditorMode = AimFormInputModeInsert
      if (isCopy) {
        this.rowEditorMode = AimFormInputModeCopy
      }
      let newRow = mustCtrlData(this.editConfigRef.newRow(this.schema, initRow))
      this.currentRow = newRow
      this.updateRowInEdit(newRow)

      if (this.isInplaceEditor()) {
        // inplace编辑模式
        this.tableData.push(newRow)
      } else {
        // form 表单编辑逻辑
        this.rowFormEditorVisible = true
      }
    },
    isInplaceEditor() {
      return this.editConfigRef.rowEditor === RowEditorInplace
    },
    rowDblClick(row) {
      this.rowClickWithTriggerName(row, EditTriggerDBLClick)
    },
    rowClick(row) {
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
      return this.editConfigRef.trigger === EditTriggerDBLClickOrSwitcher && (triggerName === EditTriggerSwitchButton || triggerName === EditTriggerDBLClick);
    },
  }
}
</script>
