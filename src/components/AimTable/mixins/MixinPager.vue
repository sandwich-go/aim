<script>
const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinPager',
  props: {
    pagerConfig: Object,
  },
  data() {
    return {
      // 如果未传递pagerConfig则认为禁用Pager组件
      pagerConfigRef: this.pagerConfig ||{enable:false},
      PagerTotal: 0,
      PagerAutoGenPage: 0,
      PagerAutoGenSize: jsb.ccPath('aimTablePagerSize', 20),
      PagerFreshFunc: null,
    }
  },
  created() {
    this.pagerConfigRef = jsb.objectAssignNX(this.pagerConfigRef, {
      enable: true,
      layout: `->,total, prev, pager, next,sizes`,
      background: true,
      pageSizes :[10,20,30,50],
    })
    if(this.pagerConfigRef.pageSize){
      this.PagerAutoGenSize  = this.pagerConfigRef.pageSize
    }
    this.pagerConfigRef.cell = 'CellPager'
    this.pagerConfigRef.data = this.thisTarget()
    this.PagerInit(this.proxyQueryData)
  },
  methods: {
    PagerInit(onPageChangeFunc) {
      this.PagerFreshFunc = onPageChangeFunc
    },
    PagerPageChange(e) {
      this.PagerAutoGenPage = e - 1
      this.PagerFreshFunc()
    },
    PagerPageSizeChange(e) {
      this.PagerAutoGenPage = 0
      this.PagerAutoGenSize = e
      this.PagerFreshFunc()
    },
    PagerAddToParams(params) {
      if (!params) {
        params = {}
      }
      params.AutoGenPage = this.PagerAutoGenPage
      params.AutoGenSize = this.PagerAutoGenSize
      return params
    },
  },
}
</script>
