<template>
  <div>
    <div class="toolbars-container-flex-end">
      <el-form :inline="true" class="demo-form-inline" size="mini">
        <el-form-item label="差异化范围">
          <el-select v-model="contextLineNumber" placeholder="Context">
            <el-option label="10" value="10"></el-option>
            <el-option label="30" value="30"></el-option>
            <el-option label="50" value="50"></el-option>
            <el-option label="100" value="100"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="sideBySide" size="mini">
            <el-radio-button :label="false">逐行对比</el-radio-button>
            <el-radio-button :label="true">并排对比</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <slot name="code-diff-toolbar"></slot>
    <code-diff
        v-if="diffContentList.length ===1"
        :old-string="diffContentList[0].old"
        :new-string="diffContentList[0].new"
        :filename="diffContentList[0].name"
        :language="getLang(diffContentList[0].language)"
        :output-format="sideBySide?'side-by-side':'line-by-line'"
        :drawFileList="true"
        :maxHeight="maxHeightString()"
        :context="contextLineNumber"/>
    <el-tabs v-else v-model="activeTabName">
      <el-tab-pane v-for="(item,index) in diffContentList" :key="index" :label="item.name" :name="item.name">
        <span slot="label">
          {{item.name}}
          <i v-if="item.changed" class="el-icon-heavy-rain"/>
        </span>
        <code-diff
            :old-string="item.old"
            :new-string="item.new"
            :language="getLang(item.language)"
            :output-format="sideBySide?'side-by-side':'line-by-line'"
            :drawFileList="true"
            :maxHeight="maxHeightString(80)"
            :context="contextLineNumber"
            :is-show-no-change="true"
            @diff="(e)=>{diffEvent(e,item)}"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import CodeDiff from 'vue-code-diff'
import jsb from "@cg-devcenter/jsb";
import {getLang} from "@/components/AimCodeDiffWrapper/lang";

export default {
  name: 'AimCodeDiffWrapper',
  components: {
    CodeDiff,
  },
  props: {
    language:{
      type: String,
      default:'json'
    },
    diffContentList:{
      type: Array,
      default:()=>{return[{old:'',new:'',name:'',language:'json'}]}
    },
    maxHeight:{
      type: Number,
      default:jsb.clientHeight(140)
    },
    fileName:String,
    versionMod:Boolean,
  },
  data(){
    return {
      activeTabName:'',
      sideBySide: true,
      contextLineNumber: 10,
    }
  },
  created() {
    this.activeTabName = jsb.pathGet(this.diffContentList,'0.name')
  },
  methods:{
    getLang,
    diffEvent(e,item){
      item.changed = jsb.pathGet(e,'stat.isChanged',false)
    },
    maxHeightString(diff){
      return `${this.versionMod?this.maxHeight-30-diff:this.maxHeight-diff}px`
    },
  }
}
</script>
<style scoped>
.toolbars-container-flex-end{
  display: flex;
  align-items: center;
  font-size: 13px;
  color: gray;
  justify-content: flex-end;
  overflow: hidden;
  z-index: 10;
}
</style>
