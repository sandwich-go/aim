<template>
  <div>
    <el-tag
        size="small"
        :key="tag"
        v-for="tag in tags"
        closable
        style="font-weight: bold"
        :disable-transitions="false"
        :type="tagType(tag)"
        :effect="tagEffect(tag)"
        @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input
        :size="size"
        class="input-new-tag"
        v-if="inputVisible && optionsList.length === 0"
        v-model="userValue"
        ref="saveTagInput"
        @keyup.enter.native="handleUserConfirm"
        @blur="handleUserConfirm"
    >
    </el-input>
    <el-select v-else-if="inputVisible && optionsList.length >0" :size="size" v-model="userValue" filterable allow-create placeholder="请选择" @change="handleUserConfirm()">
      <el-option
          v-for="item in optionsList"
          :key="item.Name"
          ref="saveTagSelect"
          :label="item.Name"
          :value="item.Name"
      >
        <el-popover v-if="item.Comment !==''" placement="right" :content="item.Comment" trigger="hover" effect="dark" >
          <span slot="reference">{{item.Name}}</span>
        </el-popover>
        <span v-else>{{ item.Name }}</span>
      </el-option>
    </el-select>
    <el-button v-else :size="size" style="margin-left: 5px" @click="showInput">{{add}}</el-button>
  </div>
</template>

<script>
const jsb = require("@cg-devcenter/jsb")

export default {
  name: 'AimTagEditor',
  props: {
    tags: {
      required: true,
      type: Array
    },
    size: {
      type: String,
      default:'mini'
    },
    optionsList:{
      default(){
        return []
      },
      type: Array
    },
    add: {
      type: String,
      default(){
        return '+ ADD'
      }
    }
  },
  data() {
    return {
      inputVisible: false,
      userValue: '',
      tagsRef:this.tags
    }
  },
  methods: {
    tagType(tag){
      tag = tag || ""
      return jsb.pathGet(tag.split('@'),[1],'primary')
    },
    tagEffect(tag){
      tag = tag || ""
      return jsb.pathGet(tag.split('@'),[2],'light')
    },
    handleClose(tag) {
      this.tagsRef.splice(this.tagsRef.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      if(this.optionsList===undefined || this.optionsList.length === 0 ) {
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    handleUserConfirm() {
      let userValue = this.userValue;
      if (userValue) {
        for(let item of this.tags) {
          if (item === userValue) {
            return
          }
        }
        this.tagsRef.push(userValue);
      }
      this.inputVisible = false;
      this.userValue = '';
    }
  }
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.input-new-tag {
  width: 180px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
