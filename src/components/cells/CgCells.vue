<template>
  <div>
    <template v-for="(cell,index) of cellsRef">
      <div :key="index" :style="divStyle">
        <component
            v-if="cell.slot && registeredComponentMap[cell.slot] && shouldToolbarItemHide({scope:cell,code:cell.code ||''})"
            :is="registeredComponentMap[cell.slot]"
            :key="`toolbar_component_${index}`"
            :cell-config="cell"
            :data="cell.data || cell"
            :field-name="cell.field || 'value'"
            :options="cell.options || []"
            :disabled="shouldToolbarItemDisable({scope:cell,code:cell.code ||''})"
            @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
        />
        <!-- 使用逻辑层实现的slot组件 -->
        <slot v-else-if="cell.slot"
              :name="getProxySlotName(cell.slot)"
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
import {code2OptionsMapping, getProxySlotName} from "@/components/CgTable/table";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";
import {makeButton} from "@/components/cells/types";

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
    jsb.each(this.cells , function (codeOrItem, key) {
      if (!codeOrItem.slot && codeOrItem.code) {
        codeOrItem.slot = 'CgButton'
      }
      // 纯字符串，认为是一个只有code按钮，内部如已设定了code的icon映射则直接使用
      if (jsb.isString(codeOrItem)) {
        _this.cellsRef[key] = makeButton(
            code2OptionsMapping[codeOrItem] || {code: codeOrItem},
            _this.shortcutButtonOptions
        )
      }
    })
  },
}
</script>