<template>
  <el-form-item :key="fs.field" :label="showLabel?formLabel(fs):''" :prop="fs.field" :ref="fs.field"
                :label-width="labelWidth">
          <span v-if="fs.tips && showLabel" slot='label'>
            <cell-view-label-tooltip :cell-config="{label:formLabel(fs),tips:fs.tips}"></cell-view-label-tooltip>
          </span>
    <template v-if="registeredComponentMap[cellName(fs)]">
      <component
          :is="registeredComponentMap[cellName(fs)]"
          :data="dataRef"
          :field-name="fs.field"
          :options="fs.options || []"
          :style-base="{width:'100%'}"
          :cell-config="cellConfig(fs)"
          :field-schema="fs"
          :disabled="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
          :key="fieldComponentKey(fs)"
      ></component>
    </template>
    <div v-else-if="isAimTable(cellName(fs))">
      <el-card class="box-card" shadow="always">
        <aim-table
            :schema="fs.fields"
            :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
            v-bind="cellConfigForTable(fs)"
            :key="fieldComponentKey(fs)"
        ></aim-table>
      </el-card>
    </div>
    <div v-else-if="isAimFormInput(cellName(fs))">
      <el-card class="box-card" shadow="always">
        <aim-form-input
            :schema="fs.fields"
            :data="dataRef[fs.field]"
            :row-top="getRow()"
            :parent-key="fs.field"
            :key="fieldComponentKey(fs)"
            :read-only="privateShouldCellDisable({fieldSchema:fs,cell:cellConfig(fs) ||{}})"
            :should-cell-disable="shouldCellDisable"
            :popup-append-to-body="true"
        ></aim-form-input>
      </el-card>
    </div>
    <div v-else>{{ cellName(fs) }} not supported</div>

    <span v-if="fs.comment" class="aim-form-item-comment">{{ comment(getRow(), fs) }}</span>
    <span v-if="fs.commentHTML" class="aim-form-item-comment" v-html="commentHTML(getRow(),fs)"></span>
  </el-form-item>
</template>

<script>
import {cellConfigForForm, cellNameForForm} from "@/components/AimTable/cell";
import jsb from "@sandwich-go/jsb";
import {
  CodeButtonAdd, CodeButtonRowSave,
  CodeButtonRowSelectedMinus
} from "@/components/cells/const";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import {xidRow} from "@/components/AimTable/table";
import {isAimFormInput, isAimTable} from "@/components/cells/is";
import {comment, commentHTML} from "@/components/AimFormInput/index";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";

export default {
  name: "AimFormItem",
  props: {
    getRow: Function,
    fs: Object,
    privateShouldCellDisable: Function,
    shouldCellDisable: Function,
    dataRef: Object,
    labelWidth: String,
    showLabel: {
      type: Boolean,
      default: true
    },
  },
  mixins: [mixinComponentMap],
  computed: {
    cellName() {
      return (fs) => {
        return cellNameForForm(fs, this.getRow())
      }
    },
    // 如果类型为table，返回字段对应的table配置
    cellConfigForTable() {
      return (fs) => {
        let cc = Object.assign({
          righterConfig: {cells: [CodeButtonAdd, CodeButtonRowSelectedMinus]},
          proxyConfig: newLocalDataProxyWithFieldName(this.dataRef, fs.field),
          selection: true,
          popupAppendToBody: true,
        }, this.cellConfig(fs))
        cc.editConfig = jsb.objectAssignNX(cc.editConfig,{
          formEditorCells: function () {
            return [CodeButtonRowSave]
          }
        })
        return cc
      }
    },
    cellConfig() {
      return (fs) => {
        return cellConfigForForm(fs, this.getRow())
      }
    }
  },
  components: {
    CellViewLabelTooltip,
    AimFormInput: () => import("@/components/AimFormInput/index.vue"),
    AimTable: () => import("@/components/AimTable/index.vue"),
  },
  methods: {
    isAimFormInput,
    isAimTable,
    commentHTML,
    comment,
    formLabel(si) {
      return jsb.pathGet(si, 'nameForm', si['name'])
    },
    fieldComponentKey(fs) {
      return `${this.parentKey}_${fs.field}_${xidRow(this.getRow())}`
    },
  }
}
</script>