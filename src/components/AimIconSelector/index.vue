<template>
  <div class="icon-body">
    <div v-if="!element" class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;"/>
        <span class="svn-icon">{{ item }}</span>
      </div>
    </div>
    <div v-else class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <i :class="'el-icon-' + item"/>
        <span class="element-icon">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import jsb from "@sandwich-go/jsb";
import elementIcons from './element-icons'
export default {
  name: 'AimIconSelector',
  props: {
    element: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      name: '',
      iconList: this.sourceIconList(),
    }
  },
  methods: {
    sourceIconList() {
      return this.element ? elementIcons : jsb.ccPath('svgIconList',[])
    },
    selectedIcon(name) {
      this.$emit('selected', this.element ? 'el-icon-' + name : name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.iconList = this.sourceIconList()
    }
  }
}
</script>

<style scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    height: 200px;
    overflow-y: scroll;

    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }

    .element-icon {
      display: inline-block;
      vertical-align: -0.6em;
      fill: currentColor;
      overflow: hidden;
    }

    .svn-icon {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
