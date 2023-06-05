<template>
  <el-form-item :key="fs.field" :label="showLabel?formLabel(fs):''" :prop="fs.field" :ref="fs.field"
                :label-width="labelWidth">

  <span slot='label' v-if="showLabel">
      <column-header :field-schema="fs" :ignore-required="true" :name="formLabel(fs)">
        <template v-if="tipSlotName(fs)" v-slot:[getProxyTipSlotName(fs)]="{}">
          <slot :name="tipSlotName(fs)" :field-schema="fs"/>
        </template>
      </column-header>
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

    <span v-if="fs.comment" class="aim-form-item-comment" :style="commentStyle">{{ comment(getRow(), fs, 'comment') }}</span>
    <span v-if="fs.commentHTML" class="aim-form-item-comment" :style="commentStyle" v-html="comment(getRow(),fs,'commentHTML')"></span>
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
import {comment} from "@/components/AimFormInput/index";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";
import {getProxyTipSlotName, tipSlotName} from "@/components/AimTable/slot";
import ColumnHeader from "@/components/AimTable/Column/ColumnHeader.vue";

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
        cc.editConfig = jsb.objectAssignNX(cc.editConfig, {
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
    ColumnHeader,
    CellViewLabelTooltip,
    AimFormInput: () => import("@/components/AimFormInput/index.vue"),
    AimTable: () => import("@/components/AimTable/index.vue"),
  },
  created() {
    // 占位
    this.getProxyTipSlotName()
  },
  data(){
    return {
      commentStyle :jsb.cc.aimFormCommentStyle || {
        'font-style':'italic',
        'color':'dodgerblue',
        'font-size':'12px'
      }
    }
  },
  methods: {
    getProxyTipSlotName,
    tipSlotName,
    isAimFormInput,
    isAimTable,
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