<template>
  <div>
    <loading :active.sync="inLoading" loader="bars" :is-full-page="false"/>
    <splitpanes vertical v-bind:style="splitPaneStyle()" :first-splitter="false">
      <pane max-size="30" size="20">
        <template v-if="groupByArray.length > 1">
          <el-radio-group  v-model="groupByNow" size="mini" @change="groupByNowChanged">
            <el-radio-button v-for="(group,index) in groupByArray"
                             :label="groupValue(group)"
                             :key="index">{{ groupLabel(group) }}
            </el-radio-button>
            <div style="padding-top: 9px"/>
          </el-radio-group>
        </template>
        <div class="container-for-height">
          <v-jstree ref="jsTree"
                    :data="treeData"
                    :draggable="true"
                    :multiple="false"
                    :allow-batch="false"
                    :size="!treeItemSize?null:treeItemSize"
                    text-field-name="label"
                    @item-drop-before = "itemDropBefore"
                    @item-click="itemClick"
                    @item-drop="itemDrop">
            <template slot-scope="_">
              <i :class="_.vm.themeIconClasses" role="presentation"></i>
              <div v-bind:style="bindTreeItemStyle(_.model)">
                <span>{{_.model.label}}</span>
                <i v-if="_.model.systemLock" class="el-icon-lock"></i>
              </div>
            </template>
          </v-jstree>
        </div>
      </pane>
      <pane max-size="100" class="container-for-height" style="padding-left: 3px">
        <template v-for="(app,key) of appMapping">
          <div v-if="app[appIdField] === currentAppID" :key="key">
            <aim-form-input
                v-if="appSchema"
                :schema="appSchema"
                :data="app"
                v-bind="aimFormInput"
            ></aim-form-input>
            <slot v-else name="app" :app="app"></slot>
            <div class="aim-drawer-footer">
              <slot name="action" :app="app" :isEdit="true"></slot>
            </div>
          </div>
        </template>
        <div v-show="!currentAppID">
          <el-divider content-position="left">当前视图结构</el-divider>
          <el-input type="textarea" disabled :value="JSON.stringify(currentTreeConfigJSON(treeData))"
                    :autosize="{minRows:5,maxRows:10}"></el-input>
          <el-divider content-position="left">当前节点</el-divider>
          <el-form label-position="right" size="mini">
            <el-form-item v-if="!isRoot" label="标题" label-width="80px">
              <el-input :disabled="!editingNode" v-model="editingItem.label"/>
            </el-form-item>
            <el-form-item v-if="!isRoot"  label="标题颜色" label-width="80px">
              <el-color-picker v-model="editingItem.color" show-alpha size="mini" :predefine="colorPredefined" :disabled="!editingNode"/>
            </el-form-item>
            <el-form-item v-if="!isRoot" label="节点别名" label-width="80px">
              <el-input :disabled="!editingNode" v-model="editingItem.alias"/>
              <span class="aim-form-item-comment" :style="commentStyle">分组视图内保证唯一，便于通过该字段索引下属节点数据</span>
            </el-form-item>
            <el-form-item v-if="!isRoot"  label="图标" label-width="80px">
              <icon-select-wrapper width="700px" :disabled="!editingNode"
                                 :element="true"
                                 :icon-name="editingItem.icon"
                                 :icon-changed="function(name) {editingItem.icon = name}"/>
            </el-form-item>
            <el-form-item label="默认打开" label-width="80px">
              <el-switch :disabled="!editingNode" v-model="editingItem.opened"/>
            </el-form-item>

            <el-button :disabled="!editingNode" type="primary" size="mini" icon='el-icon-check' @click="saveTreeConfig()">保存分组视图</el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button :disabled="!editingNode" plain size="mini" icon="el-icon-bottom-right" type="primary"
                       @click="addChildNode">添加子节点
            </el-button>
            <el-button v-if="showBtnAddBrotherNode(editingItem)" icon="el-icon-bottom"
                       :disabled="!editingNode" plain size="mini"
                       type="primary" @click="addAfterNode">添加平级节点
            </el-button>
            <el-button :disabled="!editingNode" icon="el-icon-s-grid" plain size="mini" type="success" @click="addChildApp">添加叶子节点
            </el-button>
            <el-divider direction="vertical"></el-divider>
            <el-button v-if="showBtnRemove(editingItem)" :disabled="!editingNode || !couldRemove(editingItem)"
                       size="mini" type="danger" icon='el-icon-delete' @click="removeNode">移除当前节点
            </el-button>
          </el-form>
          <el-alert class="small-padding" type="success" show-icon style="margin-top: 10px">
            <template slot='title'>拽节点以快速调整从属关系，
              <el-tag size="mini" type="warning">叶子节点</el-tag>不允许添加子节点。
            </template>
          </el-alert>
        </div>
      </pane>
    </splitpanes>
    <!-- 弹出新建逻辑 -->
    <aim-popup v-if="visibleNewAppDialog" :drawer="false" :is-show.sync="visibleNewAppDialog" :config="{appendToBody:true}">
      <template v-slot:aim-popup-body>
        <aim-form-input
            v-if="appSchema"
            :schema="appSchema"
            :data="newAppData"
            v-bind="aimFormInput"
        ></aim-form-input>
        <slot v-else name="app" :app="newAppData" :isEdit="false"></slot>
      </template>
      <template v-slot:aim-popup-footer>
        <slot name="action" :app="newAppData" :isEdit="false"></slot>
      </template>
    </aim-popup>
  </div>
</template>
<script>
import VJstree from 'vue-jstree'
import {Splitpanes, Pane} from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import jsb from "@sandwich-go/jsb";
import {
  groupID2Path,
  groupItemIsApp,
  groupTreeDataAppendApp,
  checkDuplicated
} from "@/components/AimTreeView/tree";
import AimPopup from "@/components/AimPopup/index.vue";
import AimFormInput from "@/components/AimFormInput/index.vue";
import Loading from "vue-loading-overlay";
import IconSelectWrapper from "@/components/AimTreeView/IconSelectWrapper.vue";

export default {
  name: "AimTreeView",
  components: {
    IconSelectWrapper,
    Loading,
    AimFormInput,
    AimPopup,
    VJstree,
    Splitpanes, Pane
  },
  props: {
    groupBy: {
      type: [String, Array],
      required: true
    },
    treeDataRowSave:{
      type:Function,
      // eslint-disable-next-line no-unused-vars
      default:(row) => {
        return new Promise((resolve, reject) => {
          reject("should implement treeDataRowSave")
        })
      },
    },
    treeDataQuery:{
      type:Function,
      default:() => {
        return new Promise((resolve, reject) => {
          reject("should implement treeDataQuery")
        })
      },
    },
    treeConfigQuery:{
      type:Function,
      default:() => {
        return new Promise((resolve, reject) => {
          reject("should implement treeConfigQuery")
        })
      },
    },
    treeConfigSave:{
      type:Function,
      default:() => {
        return new Promise((resolve, reject) => {
          reject("should implement treeConfigSave")
        })
      },
    },
    treeRootID: {
      type: String,
      default: 'root'
    },
    treeItemSize: {
      type: String,
      default: ''
    },
    appIdField: {
      type: String,
      default: 'id'
    },
    appLabelField: {
      type: String,
      default: 'name'
    },
    levelLimit:{
      type:Number,
      default:0,
    },
    aimFormInput: {
      type: Object,
      default:()=>{return null}
    },
    appSchema: {
      type: Array,
      default:()=>{return null}
    },
    viewHeight: {
      type: Number,
      default: () => {
        return jsb.clientHeight(80)
      }
    },
    defaultAppData:{
      type:Object,
      default:()=>{return {}}
    },
  },
  watch: {
    treeData: function () {
      this.$refs.jsTree.initializeData(this.treeData);
    }
  },
  computed:{
    isRoot(){
      return jsb.pathGet(this.editingItem,'id') === this.treeRootID
    }
  },
  data() {
    return {
      colorPredefined:jsb.cc.colorPredefined,
      treeConfigObject:{},
      inLoading:false,
      currentAppID: '',
      editingNode: null,
      editingItem: {},
      treeData: [],
      groupByArray: jsb.wrapArray(this.groupBy),
      groupByNow: '',
      groupID2PathMap: {},
      appMapping: {},
      draggedItem:null,
      newAppData: jsb.clone(this.defaultAppData),
      visibleNewAppDialog: false,
      commentStyle :jsb.cc.aimFormCommentStyle
    }
  },
  created() {
    this.groupByNow = this.groupValue(this.groupByArray[0])
    this.initNewAppData()
    this.fetchData()
  },
  methods: {
    groupItemIsApp,
    initNewAppData(){
      this.newAppData = jsb.clone(this.defaultAppData)
    },
    groupLabel(group) {
      if (jsb.isString(group)) {
        return group
      }
      return jsb.pathGet(group, 'label', 'no-label')
    },
    addChildApp() {
      this.initNewAppData()
      this.newAppData[this.groupByNow] = this.editingItem.id
      this.visibleNewAppDialog = true
    },
    groupValue(group) {
      if (jsb.isString(group)) {
        return group
      }
      return jsb.pathGet(group, 'value', 'no-value')
    },
    toNewItem(node,shouldContinue){
      if(shouldContinue){
        this.editingNode = node
        this.editingItem = node.model
        if (groupItemIsApp(this.editingItem)) {
          this.currentAppID = this.editingItem.value
        } else {
          this.currentAppID = 0
        }
      }else{
        node.model.selected = false
        if(this.editingItem) {
          this.editingItem.selected = true
        }
      }
    },
    // eslint-disable-next-line no-unused-vars
    itemClick(node) {
      this.toNewItem(node,true)
    },
    itemDropBefore(node, item, draggedItem){
      this.draggedItem = draggedItem
    },
    itemDrop(node, item){
      if(!this.draggedItem) {
        return
      }
      if(!groupItemIsApp(this.draggedItem)){
        // 目录调整此时保存数据会出现duplicated
        this.$nextTick(()=>{
          this.saveTreeConfig(false)
        })
        return;
      }
      // 如果目标是 folder
      let app = this.appMapping[this.draggedItem.value]
      if(app){
        app[this.groupByNow] = item.id
        this.treeDataRowSave(app).finally(()=>{this.inLoading = false})
      }
      this.draggedItem = null
      this.inLoading = true
    },
    bindTreeItemStyle(item) {
      let style = {display: "inherit"}
      if (item.color) {
        style['color'] = item.color
      }
      if(!groupItemIsApp(item)){
        style['font-weight'] = 'bold'
        style['color'] = style['color'] || '#1f78d1'
      }
      return style
    },
    addAfterNode: function () {
      if (this.editingItem.id) {
        this.editingItem.addAfter(this.newChild(), this.editingNode)
        // 树结构变动
        this.saveTreeConfig(false)
      }
    },
    couldRemove(item) {
      if (item && item.children && item.children.length > 0) {
        return false
      }
      return !jsb.pathGet(item, 'systemLock', false)
    },
    showBtnAddBrotherNode(item) {
      if (!item) {
        return false
      }
      return !jsb.pathGet(item, 'noBrother', false)
    },
    showBtnRemove(item) {
      if (!item) {
        return false
      }
      return !jsb.pathGet(item, 'systemLock', false)
    },
    newChild() {
      return {
        id: jsb.xid(),
        icon: 'el-icon-folder',
        label: jsb.timestamp(),
        opened: true,
      }
    },
    resetTreeCurrentState() {
      this.editingItem = {}
      this.editingNode = null
      this.currentAppID = 0
    },
    removeNode: function () {
      if (this.editingItem.id !== undefined) {
        this.editingNode.parentItem.splice(this.editingNode.parentItem.indexOf(this.editingItem), 1)
      }
      this.resetTreeCurrentState()
      // 树结构变动
      this.saveTreeConfig(false)
    },
    addChildNode: function () {
      if (this.editingItem.id) {
        this.editingItem.addChild(this.newChild())
      }
      // 树结构变动
      this.saveTreeConfig(false)
    },
    splitPaneStyle() {
      return {height:`${jsb.clientHeight(140)}`}
    },
    currentTreeConfigJSON(group) {
      let groupCopy = jsb.clone(group)
      return this.groupClean(groupCopy)
    },
    groupByNowChanged(){
      this.fetchData(true)
    },
    fetchData(cleanState=false) {
      this.inLoading = true
      const _this = this
      Promise.all([this.treeConfigQuery(), this.treeDataQuery()]).then(rest => {
        const appList = rest[1]
        try {
          this.treeConfigObject = JSON.parse(rest[0])
          // eslint-disable-next-line no-empty
        }catch (_){
          this.treeConfigObject = {}
        }
        const treeConfigNow = jsb.pathGet(this.treeConfigObject,this.groupByNow,[])
        let data = groupTreeDataAppendApp(treeConfigNow, appList,this.appIdField,this.appLabelField,this.groupByNow)
        _this.treeData = data['tree']
        _this.appMapping = data['appMap']
        groupID2Path("", treeConfigNow, _this.groupID2PathMap)
        for (const treeNode of this.treeData) {
          if (treeNode.id === this.treeRootID) {
            treeNode.dragDisabled = true
          }
        }
        return data
      }).finally(()=>{
        this.inLoading = false
        if(cleanState){
          this.resetTreeCurrentState()
        }
      })
    },
    saveTreeConfig(fetchData=true) {
      this.inLoading = true
      const duplicated = checkDuplicated(this.treeData,'id')
      if (duplicated) {
        this.inLoading = false
        jsb.cc.toastError(`分组数据存在同 id 分组 :${duplicated}`)
        return
      }
      const duplicatedAlias = checkDuplicated(this.treeData,'alias')
      if (duplicatedAlias) {
        this.inLoading = false
        jsb.cc.toastError(`分组数据存在同别名分组 :${duplicatedAlias}`)
        return
      }

      const _this = this
      this.treeConfigObject[this.groupByNow] = this.currentTreeConfigJSON(this.treeData)
      this.treeConfigSave(JSON.stringify(this.treeConfigObject)).then(() => {
        if(fetchData){
          _this.fetchData()
        }
      }).finally(()=>{
        this.inLoading = false
      })
    },
    // 移除不需要的字段,只保留树的基础结构
    groupClean(group) {
      group = group.filter(item => {
        return !groupItemIsApp(item)
      })
      for (let index in group) {
        delete group[index]['value']
        delete group[index]['disabled']
        delete group[index]['loading']
        group[index]['children'] = this.groupClean(group[index]['children'])
      }
      return group
    },
  }
}
</script>


<style lang="scss">
.container-for-height{
  height: calc(100vh - 120px);
  overflow: auto;
}
.folder-underline{
  text-decoration:none;
  border-bottom:1px solid gray;
}
</style>
