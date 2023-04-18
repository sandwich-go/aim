<template>
  <div>
    <template v-for="(cell,index) of cellsRef">
      <div :key="index" :style="divStyle">
        <component
            v-if="cell.cell && registeredComponentMap[cell.cell] && shouldToolbarItemHide({scope:cell,code:cell.code ||''})"
            :is="registeredComponentMap[cell.cell]"
            :key="`toolbar_component_${index}`"
            :cell-config="cell"
            :data="cell.data || cell"
            :field-name="cell.field || 'value'"
            :options="cell.options || []"
            :disabled="shouldToolbarItemDisable({scope:cell,code:cell.code ||''})"
            @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
        />
        <!-- 使用逻辑层实现的slot组件 -->
        <slot v-else-if="cell.cell"
              :name="getProxySlotName(cell.cell)"
              :cell-config="cell"
              :data="cell.dataWrapper || cell"
              :field-name="cell.field || 'value'"
              :options="cell.options || []"
              :disabled="shouldToolbarItemDisable({scope:cell,code:cell.code ||''})"
              @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
        />
        <el-divider v-if="isDivider(cell)" :key="`toolbar_item_divider_${index}`" direction="vertical"/>
      </div>
    </template>
  </div>
</template>
<script>
import {getProxySlotName} from "@/components/CgTable/table";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {makeCellFromString} from "@/components/cells/make";
import {CellNameButton} from "@/components/cells/const";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgCells",
  mixins: [mixinComponentMap],
  props: {
    shouldToolbarItemDisable: Function,
    shouldToolbarItemHide: Function,
    cells: Array, // 组件列表
    divStyle:Object,
    shortcutButtonOptions:Object
  },
  data(){
    return {
      cellsRef:this.cells,
    }
  },
  methods: {
    getProxySlotName,
    isDivider(item) {
      return jsb.isEmpty(item)
    },
  },
  created() {
    const _this = this
    jsb.each(this.cellsRef , function (codeOrItem, key) {
      if (!codeOrItem.cell && codeOrItem.code) {
        _this.cellsRef[key]= makeCellFromString(codeOrItem.code,codeOrItem)
        codeOrItem.cell = CellNameButton
      }
      // 纯字符串，认为是一个只有code按钮，内部如已设定了code的icon映射则直接使用
      if (jsb.isString(codeOrItem)) {
        _this.cellsRef[key] = makeCellFromString(codeOrItem, _this.shortcutButtonOptions)
      }
    })
  },
}
</script>