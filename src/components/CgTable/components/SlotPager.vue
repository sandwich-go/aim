<template>
  <el-pagination
      background
      :layout="scopeData.layout"
      :total="target['PagerTotal']"
      :current-page="target['PagerAutoGenPage'] + 1"
      :page-size="target['PagerAutoGenSize']"
      @size-change="target['PagerPageSizeChange']"
      @current-change="target['PagerPageChange']"
  />
</template>

<script>

export default {
  name: 'SlotPager',
  props: {
    target: {type: Object},
    scope: Object,
  },
  created() {
    this.scopeData = Object.assign(this.scopeData,this.config)
  },
  data(){
    return {
      scopeData:{
        layout: `->,total, prev, pager, next, sizes`,
      }
    }
  }
}
</script>
