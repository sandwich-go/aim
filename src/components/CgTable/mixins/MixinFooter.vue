<script>
import {initToolbarConfig} from "@/components/CgTable/mixins/toolbar";
import jsb from "@sandwich-go/jsb";
import {CreateMixinState} from "@/components/CgTable/mixins/CreateMixinState";

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
    this.footerConfigRef = initToolbarConfig(this.footerConfigRef,{style: {'padding-top': '9px'}})

    let pagerFound = false
    const _this = this
    jsb.each(['leftCells', 'rightCells'], function (val) {
      jsb.each(_this.footerConfigRef[val], function (codeOrItem) {
        if (codeOrItem.cell === 'CgPager') {
          pagerFound = true
          // Pager的数据绑定到table组件
          codeOrItem.data = _this.thisTarget()
        }
      })
    })
    if (this.pagerConfigRef.enable && !pagerFound) {
      this.footerConfigRef.rightCells.push({cell: 'CgPager', data: this.thisTarget()})
    }
  }
}
</script>