<template>
  <div style="display: inline">
    <template v-for="(cell,index) of cellsRef">
      <div :key="index" :style="divStyle">
        <template v-if="!shouldCellHide({cell:cell,code:cell.code ||'',row:row})">
          <template v-if="cell.cell && registeredComponentMap[cell.cell]">
            <el-tooltip v-if="disableTooltip(cell,row).tooltip" :content="disableTooltip(cell,row).tooltip">
              <component
                  :is="registeredComponentMap[cell.cell]"
                  :key="`toolbar_component_${index}`"
                  :cell-config="cell"
                  :data="cell.data || cell"
                  :field-name="cell.field || 'value'"
                  :options="cell.options || []"
                  :disabled="disableTooltip(cell,row).disable"
                  @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
              />
            </el-tooltip>
            <component
                v-else
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
          <!-- 使用逻辑层实现的slot组件 -->
          <slot v-else-if="cell.slot"
                :name="getProxySlotName(cell.slot)"
                :cell-config="cell"
                :data="cell.data || cell"
                :field-name="cell.field || 'value'"
                :options="cell.options || []"
                :disabled="disableTooltip(cell,row).disable"
                @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
          />
          <template v-else-if="!cell.cell">
            <el-divider v-if="isDivider(cell)" :key="`toolbar_item_divider_${index}`" direction="vertical"/>
            <span v-if="isPaddingLeft(cell)" :key="`toolbar_item_gap_${index}`" :style="{'padding-left':parseWidthToPixelString(cell.paddingLeft)}"/>
            <span v-if="isPaddingRight(cell)" :key="`toolbar_item_gap_${index}`" :style="{'padding-right':parseWidthToPixelString(cell.paddingRight)}"/>
          </template>
          <template v-else>
            {{`${cell.cell} not supported.`}}
          </template>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {makeCellFromString} from "@/components/cells/make";
import {getProxySlotName} from "@/components/AimTable/slot";
import {parseWidthToPixelString} from "@/components/utils/ui";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: "CellList",
  mixins: [mixinComponentMap],
  props: {
    shouldCellDisable: Function,
    shouldCellHide: Function,
    cells: Array, // 组件列表
    divStyle:Object,
    shortcutButtonOptions:Object,
    cellReplace:Function,
    row:Object,
  },
  data(){
    return {
      cellsRef:this.cells,
    }
  },
  methods: {
    parseWidthToPixelString,
    getProxySlotName,
    disableTooltip(cell,row){
      const ret = this.shouldCellDisable({cell:cell,code:cell.code ||'',row:row})
      if(jsb.isString(ret)) {
        return {disable:true,tooltip:ret}
      }
      return {disable: ret}
    },
    isDivider(item) {
      return jsb.isEmpty(item)
    },
    isPaddingLeft(item) {
      return !item.cell && !item.slot &&  item.paddingLeft
    },
    isPaddingRight(item) {
      return !item.cell && !item.slot &&  item.paddingRight
    },
  },
  created() {
    const _this = this
    jsb.each(this.cellsRef , function (codeOrItem, key) {
      if (!codeOrItem.cell && codeOrItem.code) {
        _this.cellsRef[key]= makeCellFromString(codeOrItem.code,codeOrItem)
        codeOrItem.cell = 'CellButton'
      }
      // 纯字符串，认为是一个code按钮，内部如已设定了code的icon映射则直接使用
      if (jsb.isString(codeOrItem)) {
        _this.cellsRef[key] = makeCellFromString(codeOrItem, _this.shortcutButtonOptions)
      }
      if(jsb.cellReplace){
        _this.cellsRef[key] = jsb.cellReplace(_this.cellsRef[key])
      }
    })
  },
}
</script>