<script>
import {initToolbarConfig} from "@/components/CgTable/mixins/toolbar";

export default {
  name: 'MixinHeader',
  props: {
    headerConfig: Object,
  },
  data() {
    return {
      // 如果未传递headerConfigRef则认为禁用header
      headerConfigRef: this.headerConfig || {enable: false},
    }
  },
  created() {
    this.headerConfigRef = initToolbarConfig(this.headerConfigRef,{style: {'padding-bottom': '9px'}})
  }
}
</script>