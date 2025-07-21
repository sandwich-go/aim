<script>
import Cookies from "js-cookie";

const jsb = require("@cg-devcenter/jsb")

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
      showTotal:false,
      layout: `->,total, prev, pager, next,sizes`,
      background: true,
      pageSizes :[10,20,30,50],
    })
    if(this.pagerConfigRef.pageSize){
      this.PagerAutoGenSize  = this.pagerConfigRef.pageSize
    }
    if (this.pagerConfigRef.pageSizeCookieKey) {
      const pageSizeCached = Number(Cookies.get(this.pagerConfigRef.pageSizeCookieKey))
      if (pageSizeCached) {
        this.PagerAutoGenSize = pageSizeCached
      }
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
      if (this.pagerConfigRef.pageSizeCookieKey) {
        Cookies.set(this.pagerConfigRef.pageSizeCookieKey, e)
      }
      this.PagerFreshFunc()
    },
    PagerAddToParams(params) {
      if (!params) {
        params = {}
      }
      // 上层指定分页
      if(jsb.isNull(params.AutoGenPage) || jsb.isUndefined(params.AutoGenPage)){
        params.AutoGenPage = this.PagerAutoGenPage
      }else{
        this.PagerAutoGenPage = params.AutoGenPage
      }
      params.AutoGenSize = this.PagerAutoGenSize
      return params
    },
  },
}
</script>
