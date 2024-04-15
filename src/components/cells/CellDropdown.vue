<template>
  <div style="display: inline">
    <el-dropdown>
      <span><i class="el-icon-more"></i></span>
      <el-dropdown-menu slot="dropdown" style="padding: 10px 18px;">
        <template v-for="(cell,index) of cellsRef">
          <template v-if="cell.cell && registeredComponentMap[cell.cell]">
              <component
                  style="line-height:2.2;"
                  :is="registeredComponentMap[cell.cell]"
                  :key="`toolbar_component_${index}`"
                  :cell-config="cell"
                  :data="cell.data || cell"
                  :field-name="cell.field || 'value'"
                  :options="cell.options || []"
                  :disabled="disableTooltip(cell,row).disable"
                  @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
              />
          </template>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {makeCellFromString} from "@/components/cells/make";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CellDropdown",
  mixins: [mixinComponentMap],
  props: {
    shouldCellDisable: Function,
    shouldCellHide: Function,
    cells: Array, // 组件列表
    divStyle: Object,
    shortcutButtonOptions: Object,
    cellReplace: Function,
    row: Object,
  },
  data() {
    return {
      cellsRef: this.cells,
    }
  },
  methods: {
    disableTooltip(cell, row) {
      const ret = this.shouldCellDisable({cell: cell, code: cell.code || '', row: row})
      if (jsb.isString(ret)) {
        return {disable: true, tooltip: ret}
      }
      return {disable: ret}
    },
  },
  created() {
    const _this = this
    jsb.each(this.cellsRef, function (codeOrItem, key) {
      if (!codeOrItem.cell && codeOrItem.code) {
        _this.cellsRef[key] = makeCellFromString(codeOrItem.code, codeOrItem)
        codeOrItem.cell = 'CellButton'
      }
      // 纯字符串，认为是一个code按钮，内部如已设定了code的icon映射则直接使用
      if (jsb.isString(codeOrItem)) {
        _this.cellsRef[key] = makeCellFromString(codeOrItem, _this.shortcutButtonOptions)
      }
      if (jsb.cellReplace) {
        _this.cellsRef[key] = jsb.cellReplace(_this.cellsRef[key])
      }
    })
  },
}
</script>

<style scoped>
.el-dropdown:hover, .el-dropdown:focus {
  color: #409EFF !important;
}
</style>