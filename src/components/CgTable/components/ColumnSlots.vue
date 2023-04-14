<template>
  <el-col :span="span" :style="colStyle">
    <template v-for="(item,index) of items">
      <component
          v-if="item.slot && registeredComponentMap[item.slot] && shouldToolbarItemHide({item:item,code:item.code ||''})"
          :is="registeredComponentMap[item.slot]"
          :scope="item"
          :target="target"
          :disabled="shouldToolbarItemDisable({item:item,code:item.code ||''})"
          :key="`toolbar_component_${index}`"
      ></component>
      <slot v-else-if="item.slot" :name="getProxySlotName(item.slot)" :item="item"></slot>
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
        item.slot = 'SlotButton'
      }
    })
  },
}
</script>