<template>
  <el-tooltip v-if="fieldValueFormatted"  class="item" effect="light" :open-delay="500">
    <div slot="content">
      <el-image slot="content" :src="fieldValueFormatted">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </div>
    <el-image
        :lazy="true"
        style="height:30px;padding-left: 3px"
        :src="fieldValueFormatted">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </el-tooltip>
  <el-image
      v-else
      :lazy="true"
      style="height:30px;padding-left: 3px"
      :src="fieldValueFormatted">
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
import MixinCellViewConfig from "@/components/cells/mixins/MixinCellViewConfig.vue";

export default {
  name: "CellViewImage",
  mixins: [MixinCellViewConfig],
  created() {
    console.log("fieldValueFormatted ",this.fieldValueFormatted)
  }
}
</script>