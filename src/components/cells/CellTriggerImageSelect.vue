<template>
  <cell-trigger :cell-config="cc"
                :field-name="fieldName"
                :field-schema="fieldSchema"
                :data="dataRef"
                :popup-append-to-body="popupAppendToBody"
                @code-cell-click="({code,jsEvent})=>emitClickWithCode(jsEvent,code)">
    <template v-slot:target>
      <el-input
          placeholder="搜索"
          clearable
          size="mini"
          style="width: 100%"
          @input="imagePickerFilter"
          v-model="currentImagePickerSelected">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <vue-select-image
          style="padding-top: 9px"
          :dataImages="imageListFiltered"
          :useLabel="true"
          @onselectimage="onSelectImage">
      </vue-select-image>
    </template>
    <template v-slot:summary>
      <div style="padding-left: 9px;display: inline">
        <cell-view-image
            :cell-config="cellConfig"
            :field-schema="fieldSchema"
            :field-name="fieldName"
            :data="data"
            :disabled="disabled"
        ></cell-view-image>
      </div>
    </template>
  </cell-trigger>
</template>


<script>
import VueSelectImage from 'vue-select-image'
require('vue-select-image/dist/vue-select-image.css')
import MixinCell from "@/components/cells/mixins/MixinCell.vue";
import CellTrigger from "@/components/cells/CellTrigger.vue";
import jsb from "@sandwich-go/jsb";
import CellViewImage from "@/components/cells/CellViewImage.vue";

export default {
  name: 'CellTriggerImageSelect',
  components: {CellViewImage, CellTrigger,VueSelectImage},
  mixins: [MixinCell],
  props:{
    popupAppendToBody: Boolean
  },
  data(){
    return {
      imageList:[],
      imageListFiltered:[],
      currentImagePickerSelected:'',
    }
  },
  created() {
    this.ccMerge()
    this.cc.trigger = jsb.objectAssignNX(this.cc.trigger, {
      isButton: false,
      icon: 'el-icon-edit-outline',
    })

    const _this = this
    jsb.each(this.optionsComputed,(v)=>{
      const option = {
        id:v.id || v.key || v.value,
        src:v.src || v.value,
        alt:v.alt || v.label,
      }
      _this.imageListFiltered.push(option)
      _this.imageList.push(option)
    })
  },
  methods:{
    onSelectImage(v){
      this.dataRef[this.fieldName] = v.src
    },
    imagePickerFilter() {
      if (this.currentImagePickerSelected) {
        let value = this.currentImagePickerSelected.toLowerCase();
        this.imageListFiltered = this.imageList.filter((item) => {
          if (item.alt.toLowerCase().indexOf(value) > -1) {
            return true
          }
        })
      } else {
        this.imageListFiltered = this.imageList;
      }
    },
  }
}
</script>
