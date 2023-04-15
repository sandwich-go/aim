<template>
  <span v-if="cc">
    <template style="align-items: center">
      <template v-if="isString(cc)">
         <el-link type="primary" :href="cc" target="_blank">{{ cc }}</el-link>
      </template>
      <template v-else-if="cc.code || cc.href">
        <el-link :type="cc.type || 'primary'" @click="emitClick($event)" :href="cc.href" target="_blank">
          <cg-icon v-if="cc.icon" :scope-config="cc.icon"/>
          <cg-label v-if="cc.label" :scope-config="cc.label" style="padding-left: 3px"></cg-label>
        </el-link>
      </template>
    </template>
  </span>
</template>

<script>
import {isString} from "xe-utils";
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";
import CgLabel from "@/components/types/CgLabel.vue";

export default {
  name: "CgLink",
  components: {CgLabel},
  mixins: [MixinComponentConfig],
  methods: {
    isString,
    emitClick(jsEvent) {
      if(!this.cc.code){
        return
      }
      this.$emit('code-button-click', this.emitData({
        code: this.cc.code,
        jsEvent:jsEvent,
      }))
    }
  }
}
</script>