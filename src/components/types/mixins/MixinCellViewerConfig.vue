<script>
import jsb from "@sandwich-go/jsb";

export default {
  name: 'MixinCellViewerConfig',
  props: {
    cellConfig:null, // 组件配置
    options:null,
  },
  methods: {
    getOptions() {
      return (jsb.isFunction(this.options)?this.options():this.options) || []
    }
  }
}
</script>
