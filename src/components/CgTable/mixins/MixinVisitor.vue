<script>
import {CreateMixinState} from "@/components/CgTable/mixins/CreateMixinState";
import jsb from "@sandwich-go/jsb";
export default {
  name: 'MixinVisitor',
  props: {
    visitorConfig: Object,
  },
  mixins:[CreateMixinState()],
  data(){
    return {
      visitorConfigRef : this.visitorConfig
    }
  },
  methods:{
    schemaApplyVisitorData(){
      jsb.each(this.schema,(fs)=>{
        const vs = this.visitorConfigRef[fs.field]
        if(!vs) {
          return
        }
        fs.width = jsb.pathGet(vs,'width',fs.width)
        fs.show  = jsb.pathGet(vs,'show',fs.show)
        fs.tips  = jsb.pathGet(vs,'tips',fs.tips)
      })
      console.log(this.schema)
    }
  }
}
</script>