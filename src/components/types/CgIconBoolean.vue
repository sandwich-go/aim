<template>
  <cg-icon
      :scopeConfig="scopeConfigTrans()"
  ></cg-icon>
</template>

<script>
import MixinComponentConfig from "@/components/types/mixins/MixinComponentConfig.vue";
import CgIcon from "@/components/types/CgIcon.vue";

export default {
  name: "CgIconBoolean",
  components: {CgIcon},
  mixins: [MixinComponentConfig],
  methods:{
    scopeConfigTrans(){
      if(this.cc){
        return {class: 'el-icon-check', style: 'color:green;'}
      }else{
        return {class: 'el-icon-close', style: 'color:red;'}
      }
    }
  },
  created() {
    this.initComponentConfig()
  }
}
</script>