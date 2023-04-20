<script>

const jsb = require("@sandwich-go/jsb")

export default {
  name: 'MixinRighter',
  props: {
    righterConfig: Object,
  },
  data() {
    return {
      // 如果未传递headerConfigRef则认为禁用righter
      righterConfigRef: this.righterConfig || {enable: false},
    }
  },
  created() {
    this.righterConfigRef =  jsb.objectAssignNX(this.righterConfigRef,{
      enable:true,
      cells:[]
    })
  }
}
</script>