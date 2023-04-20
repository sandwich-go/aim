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
      PagerAutoGenSize: 30,
      PagerFreshFunc: null,
    }
  },
  created() {
    this.pagerConfigRef = jsb.objectAssignNX(this.pagerConfigRef, {
      enable: false,
      pagerConfig: {
        layout: `->,total, prev, pager, next, sizes`,
        background: true,
        totalFiled: 'PagerTotal',
        currentPageField: 'PagerAutoGenPage',
        pageSizeField: 'PagerAutoGenSize',
      }
    })
    this.PagerInit(this.tryProxyQueryData)
  },
  methods: {
    PagerInit(onPageChangeFunc, autoGenSize = 30) {
      this.PagerFreshFunc = onPageChangeFunc
      this.PagerAutoGenSize = autoGenSize
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
