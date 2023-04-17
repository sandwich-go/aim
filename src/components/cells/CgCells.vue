<template>
  <el-col :span="span" :style="colStyle">
    <template v-for="(item,index) of cells">
      <!-- 使用系统预注册的内置组件 -->
      <component
          v-if="item.slot && registeredComponentMap[item.slot] && shouldToolbarItemHide({scope:item,code:item.code ||''})"
          :is="registeredComponentMap[item.slot]"
          :key="`toolbar_component_${index}`"

          :cell-config="item"
          :data="item.dataWrapper || item"
          :field-name="item.field || 'value'"
          :options="item.options || []"
          :disabled="shouldToolbarItemDisable({scope:item,code:item.code ||''})"
          @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
      />
      <!-- 使用逻辑层实现的slot组件 -->
      <slot v-else-if="item.slot"
            :name="getProxySlotName(item.slot)"
            :cell-config="item"
            :data="item.dataWrapper || item"
            :field-name="item.field || 'value'"
            :options="item.options || []"
            :disabled="shouldToolbarItemDisable({scope:item,code:item.code ||''})"
            @code-cell-click="({code,jsEvent}) => $emit('code-cell-click',{code,jsEvent})"
      />
      <el-divider v-if="isDivider(item)" :key="`toolbar_item_divider_${index}`" direction="vertical"/>
    </template>
  </el-col>
</template>
<script>
import {getProxySlotName} from "@/components/CgTable/table";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "CgCells",
  mixins: [mixinComponentMap],
  props: {
    shouldToolbarItemDisable: Function,
    shouldToolbarItemHide: Function,
    span: Number, // 宽度span
    cells: Array, // 组件列表
    colStyle: Object,
  },
  methods: {
    getProxySlotName,
    isDivider(item) {
      return jsb.isEmpty(item)
    },
  },
  created() {
    jsb.each(this.cells || [], function (item) {
      if (!item.slot && item.code) {
        item.slot = 'CgButton'
      }
    })
  },
}
</script>