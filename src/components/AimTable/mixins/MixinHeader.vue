<script>
import {initToolbarConfig} from "@/components/AimTable/toolbar";

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
    this.headerConfigRef = initToolbarConfig(this.headerConfigRef, {'display':'flex','align-items':'center','padding-bottom':'3px'})
  }
}
</script>