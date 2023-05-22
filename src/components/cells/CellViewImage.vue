<template>
  <span v-if="fieldValueFormatted">
    <el-tooltip class="item" effect="light">
      <div slot="content">
        <el-image :src="fieldValueFormatted">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    <el-image
        :lazy="true"
        style="height:40px;padding-left: 3px"
        :src="fieldValueFormatted">
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
    </el-tooltip>
  </span>
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