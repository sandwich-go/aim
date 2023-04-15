<template>
  <el-col :span="span" :style="colStyle">
    <template v-for="(item,index) of items">
      <component
          v-if="item.slot && registeredComponentMap[item.slot] && shouldToolbarItemHide({scope:item,code:item.code ||''})"
          :is="registeredComponentMap[item.slot]"
          :scope-config="item"
          :disabled="shouldToolbarItemDisable({scope:item,code:item.code ||''})"
          :data="item.dataWrapper || item"
          :key="`toolbar_component_${index}`"
          @code-button-click="({code,jsEvent}) => $emit('code-button-click',{code,jsEvent})"
      ></component>
      <slot v-else-if="item.slot"
            :name="getProxySlotName(item.slot)"
            @code-button-click="({code,jsEvent}) => $emit('code-button-click',{code,jsEvent})"
            :data="item.dataWrapper || item"
            :scope-config="item"></slot>
      <el-divider v-if="isDivider(item)" :key="`toolbar_item_divider_${index}`" direction="vertical"/>
    </template>
  </el-col>
</template>
<script>
import { getProxySlotName} from "@/components/CgTable/table";
import mixinComponentMap from "@/components/mixins/MixinComponentMap.vue";

const jsb = require("@sandwich-go/jsb")

export default {
  name: "ColumnSlots",
  mixins:[mixinComponentMap],
  props: {
    shouldToolbarItemDisable: Function,
    shouldToolbarItemHide: Function,
    items:Array,
    span:Number,
    target:Object,
    colStyle:Object,
  },
  methods: {
    getProxySlotName,
    isDivider(item) {
      return jsb.isEmpty(item)
    },
  },
  created() {
    jsb.each(this.items || [],function (item) {
      if(!item.slot && item.code) {
        item.slot = 'CgButton'
      }
    })
  },
}
</script>