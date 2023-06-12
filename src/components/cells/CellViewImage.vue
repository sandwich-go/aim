<template>
  <el-tooltip v-if="fieldValueFormatted" class="item" effect="light" :open-delay="500">
    <div slot="content">
      <el-image  slot="content" :src="_val.src">
        <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
      </el-image>
    </div>
    <el-image v-bind="_val">
      <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
    </el-image>
  </el-tooltip>
  <el-image v-else v-bind="_val">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import jsb from "@sandwich-go/jsb";
import {assignWithMerge} from "@/components/utils/jsb";

export default {
  name: "CellViewImage",
  mixins: [MixinCell],
  computed: {
    _val() {
      // fixme 显示在表格内的时候设定高度，外部传入，同表格行高度，暂时写死
      let obj = {src: '', style: {height: "30px"}, lazy: true}
      if (jsb.isString(this.fieldValueFormatted)) {
        obj.src = this.fieldValueFormatted
      } else {
        assignWithMerge(obj,this.fieldValueFormatted,['style'])
      }
      return obj
    }
  }
}
</script>