<script>
import {initToolbarConfig} from "@/components/AimTable/toolbar";
import jsb from "@cg-devcenter/jsb";
import {CreateMixinState} from "@/components/AimTable/mixins/CreateMixinState";

export default {
  name: 'MixinHeader',
  props: {
    footerConfig: Object,
  },
  mixins:[CreateMixinState()],
  data() {
    return {
      // 如果未传递headerConfigRef则认为禁用footer
      footerConfigRef: this.footerConfig || {enable: false},
    }
  },
  created() {
    this.footerConfigRef = initToolbarConfig(this.footerConfigRef,{'padding-top': '9px'})

    let pagerFound = false
    const _this = this
    jsb.each(['leftCells', 'rightCells'], function (val) {
      jsb.each(_this.footerConfigRef[val], function (codeOrItem) {
        if (codeOrItem.cell === 'CellPager') {
          pagerFound = true
          // Pager的数据绑定到table组件
          codeOrItem.data = _this.thisTarget()
        }
      })
    })
    // 不启用pager请求数据，但是使用组件显示总数
    if ((this.pagerConfigRef.enable || this.pagerConfigRef.showTotal) && !pagerFound) {
      this.footerConfigRef.rightCells.push(this.pagerConfigRef)
    }
  }
}
</script>