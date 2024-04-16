<template>
  <el-popover
      placement="bottom-start"
      trigger="click"
      v-bind:style="widthStyle()"
      @show="$refs['iconSelect'].reset()">
    <aim-icon-selector ref="iconSelect" v-bind:style="widthStyle()" :element="element" @selected="selectedIcon" />
    <el-input slot="reference" v-model="model" readonly v-bind="$attrs">
      <i v-if="!model" slot="prefix" class="el-icon-search el-input__icon"/>
      <i v-else-if="element" slot="prefix" :class="model" class="el-input__icon" style="height: 32px;width: 16px;" />
      <svg-icon v-else slot="prefix" :icon-class="model" class="el-input__icon" style="height: 32px;width: 16px;" />
    </el-input>
  </el-popover>
</template>

<script>
import AimIconSelector from '@/components/AimIconSelector'
export default {
  name: 'IconSelectWrapper',
  components: {
    AimIconSelector
  },
  props: {
    width:{
      type:String,
      default:"100%"
    },
    showLabel:{
      type:Boolean,
      default: true
    },
    iconChanged:{
      type: Function,
      default:null,
    },
    element:{
      type:Boolean,
      default: false
    },
    iconName:{
      type:String,
      default: ''
    }
  },
  computed: {
    model: {
      get() {
        return this.iconName;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
  },
  methods:{
    widthStyle(){
      return {width: this.width}
    },
    selectedIcon(name) {
      this.model = name
      if(this.iconChanged){
        this.iconChanged(name)
      }
    },
  }
}
</script>
