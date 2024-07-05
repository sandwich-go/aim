<template>
  <span v-if="name">
    <el-tooltip v-if="errorMessage(fieldSchema)" effect="light">
      <div slot="content">
        <div v-html="errorMessage(fieldSchema)"></div>
      </div>
      <span><i class="el-icon-warning" style="color: red"></i></span>
    </el-tooltip>
    <i v-if="!ignoreRequired&&fieldSchema.required" class="aim-required-icon"></i>
    <i v-if="fieldSchema.locked" class="el-icon-lock"></i>
    <el-tooltip v-if="fieldSchema.uniq" effect="light">
      <div slot="content">
        <span>表内唯一</span>
      </div>
      <span> <i class="el-icon-key"></i></span>
    </el-tooltip>

    <template v-for="(item,index) in fieldSchema['iconList'] || []">
      <el-tooltip v-if="item['tooltip'] && item.icon" effect="light" :key="index">
        <div slot="content">
          <div v-html="item['tooltip']"></div>
        </div>
        <span><i v-bind="item.icon"></i></span>
      </el-tooltip>
      <i :key="index" v-else v-bind="item.icon"></i>
    </template>

        <template v-for="(item,index) in fieldSchema['tagList'] || []">
          <el-tooltip v-if="item['tooltip'] && item.icon" effect="light" :key="index">
            <div slot="content">
              <div v-html="item['tooltip']"></div>
            </div>
            <tag v-if="item.tag" v-bind="item.tag"></tag>
          </el-tooltip>
          <tag :key="index" v-else v-bind="item.tag">{{item.tag.label}}</tag>
    </template>

    <cell-view-label-tooltip
        v-if="fieldSchema['tips'] || fieldSchema['tipsHTML'] || (showStaticHelp && fieldSchema['staticHelp'])"
        :cell-config="{
          label:name,
          labelSub:sub,
          containerStyleForSub:containerStyleForSub,
          tips:fieldSchema['tips'],
          tipsHTML:fieldSchema['tipsHTML']|| (showStaticHelp?fieldSchema['staticHelp']:null)
        }"></cell-view-label-tooltip>
    <el-tooltip v-else-if="tipSlotName(fieldSchema)" effect="light">
      <div slot="content">
        <slot :name="getProxyTipSlotName(fieldSchema)" :field-schema="fieldSchema"></slot>
      </div>
      <span><i class="el-icon-info"></i>{{ name }}</span>
    </el-tooltip>
    <span v-else-if="sub" class="aim-title-sub-container" :style="containerStyleForSub">
      <span class="aim-title-sub-main">{{ name }}</span>
      <span class="aim-title-sub-info">{{ sub }}</span>
    </span>
    <span v-else>{{ name }}</span>
  </span>
</template>

<script>

import CellViewLabelTooltip from "@/components/cells/CellViewTooltip.vue";
import {getProxyTipSlotName, tipSlotName} from "@/components/AimTable/slot";
import {errorMessage} from "@/components/AimFormInput";

export default {
  name: 'ColumnHeader',
  methods: {
    errorMessage,
    getProxyTipSlotName,
    tipSlotName,

  },
  components: {CellViewLabelTooltip},
  props: {
    fieldSchema: Object,
    name: String,
    sub: String,
    showStaticHelp:Boolean,
    containerStyleForSub: {},
    ignoreRequired: Boolean,
  },
}
</script>

<style>
.aim-required-icon {
  display: inline-block;
  color: #f56c6c;
  width: 0.4em;
  height: 1em;
  line-height: 1em;
  margin-right: 0.2em;
  font-weight: normal;
  font-size: 15px;
  position: relative;

  &:before {
    content: "*";
    position: absolute;
    left: 0;
    top: 0.4em;
  }
}

.aim-title-sub-container {
  display: inline-block;
  position: relative;
  line-height: 1.5; /* 设置行高 */
  text-align: right; /* 右对齐文本 */
  white-space: nowrap; /* 防止文字换行 */
}

.aim-title-sub-main {
  display: block;
}

.aim-title-sub-info {
  position: absolute;
  font-size: 10px; /* 设置说明信息字号 */
  bottom: -1.6em; /* 负的字号差值，用于在主文本下方显示 */
  right: 0; /* 右对齐说明信息 */
  color: #707070;
  font-weight: lighter;
}

</style>