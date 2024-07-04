<template>
  <div>
    <loading :active.sync="proxyLoading" loader="bars" :is-full-page="false"/>
    <div style="position: relative">
      <aim-full-screen-dialog class="codemirror-wrapper"
                              :style="cssVars"
                              :show-button-enter="false"
                              :show-button-exit="false"
                              ref="fullScreen">
        <el-row style="padding-bottom: 3px">
          <el-col :span="directionToolbarSpan(headerConfigRef,'left')">
            <cell-list
                :style="headerConfigRef['leftStyle']"
                :cells="headerConfigRef['leftCells']"
                :should-cell-hide="privateShouldCellHide"
                :should-cell-disable="privateShouldCellDisable"
                :cell-replace="cellReplace"
                @code-cell-click="privateCellClick">
            </cell-list>
          </el-col>
          <el-col :span="directionToolbarSpan(headerConfigRef,'right')" :style="headerConfigRef['rightStyle']">
            <cell-list
                style="display:flex"
                :cells="headerConfigRef['rightCells']"
                :should-cell-hide="privateShouldCellHide"
                :should-cell-disable="privateShouldCellDisable"
                :cell-replace="cellReplace"
                @code-cell-click="privateCellClick">
            </cell-list>
            <el-button
                v-if="lintSupport() && !disableLint &&!useJSONEditor"
                icon="el-icon-magic-stick"
                type="info"
                plain
                :disabled="!codeLatest"
                size="mini" @click="formatCode()">
            </el-button>
            <el-button
                v-if="!disableCopy"
                icon="el-icon-document-copy"
                type="info"
                plain
                :disabled="!codeLatest"
                size="mini" @click="handleCopy($event)">
            </el-button>
            <el-button
                v-if="isJSON"
                icon="el-icon-set-up"
                type="info"
                plain
                size="mini" @click="useJSONEditor=!useJSONEditor"/>
            <el-button
                icon="el-icon-full-screen"
                type="info"
                plain
                size="mini" @click="switchFullScreen">
            </el-button>
          </el-col>
        </el-row>
        <v-jsoneditor
            v-if="useJSONEditor"
            v-model="codeUsingObject"
            :plus="true"
            disabled
            class="aim-json-editor"
            :options="jsonEditorOptionsInner"
        />
        <codemirror
            v-else
            :value="codeUsing"
            :indent-with-tab="true"
            :options="optionsUsing()"
            @input="privateOnInputEvent"
            @ready="this.onCmReady"
            :placeholder="placeholder"
            :id="codemirrorEditorID"
            ref="codemirror"
            @keydown.native="onKeyDown"
        />
      </aim-full-screen-dialog>
    </div>
    <aim-popup :drawer="true" :is-show.sync="visibleLintError" :config="{appendToBody:popupAppendToBody,direction:'btt',size:'40%'}">
      <template v-slot:aim-popup-body>
        <div class="class-lint-error">
          <codemirror :value="lintError" :indent-with-tab="true" :options="{readOnly:true}"/>
        </div>
      </template>
    </aim-popup>
  </div>
</template>

<script>
import VJsoneditor from 'v-jsoneditor'
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
import 'codemirror/mode/yaml-frontmatter/yaml-frontmatter.js'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

// theme css
import 'codemirror/theme/idea.css'
import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/mbo.css'
import 'codemirror/theme/rubyblue.css'

import 'codemirror/mode/toml/toml.js'
import "codemirror/mode/yaml/yaml.js";
import "codemirror/mode/sql/sql.js";
import "codemirror/mode/protobuf/protobuf.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/go/go.js";
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/mode/verilog/verilog.js'

// JSON代码高亮需要由JavaScript插件支持
import "codemirror/mode/javascript/javascript.js";

import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/match-highlighter.js";

// 行注释
import "codemirror/addon/display/placeholder.js";
import "codemirror/addon/comment/comment.js";
// 搜索功能的依赖
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
// 支持搜索功能
import "codemirror/addon/search/search";
import "codemirror/addon/search/searchcursor.js";
// 支持括号自动匹配
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
// 支持自动刷新
import "codemirror/addon/display/autorefresh.js";
// 支持代码区域全屏功能
import "codemirror/addon/display/fullscreen.css";
import "codemirror/addon/display/fullscreen.js";
// 支持各种代码折叠
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/indent-fold.js";
// 支持代码自动补全
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/anyword-hint.js";
// JSON错误检查
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/json-lint.js";
// 引入jsonlint
import jsonlint from "jsonlint-mod";
// require active-line.js
import {
  CodeMirrorModeJSON,
  CodeMirrorModeOptions, CodeMirrorModeYAML, CodeMirrorSettingDefault,
  getCodeMirrorMode,
  getDefaultOptions
} from "@/components/AimCodeMirror/mode";
import {directionToolbarSpan, initToolbarConfig} from "@/components/AimTable/toolbar";
import CellList from "@/components/cells/CellList.vue";
import {
  CodeButtonCopy, CodeButtonLint, CodeButtonRefresh, CodeButtonRowSave,
} from "@/components/cells/const";
import AimPopup from "@/components/AimPopup/index.vue";
import AimFullScreenDialog from "@/components/AimFullScreenDialog/index.vue";
// eslint-disable-next-line no-undef
const yaml = require('js-yaml');

window.jsonlint = jsonlint;
const jsb = require("@sandwich-go/jsb")

export default {
  name: 'AimCodeMirror',
  components: {
    AimFullScreenDialog,
    AimPopup,
    CellList,
    codemirror,
    Loading,
    VJsoneditor,
  },
  watch: {
    code: {
      handler: function (val) {
        this.codeLatest = val
      }
    },
    readOnly: function (val) {
      this.options['readOnly'] = val
    },
    codeUsingObject:function(val){
      this.codeLatest = JSON.stringify(val)
    },
    codeUsing:function (){this.freshObjectForJsonEditor()}
  },
  props: {
    popupAppendToBody: Boolean,
    theme: String,
    infoConfig: Object,
    code: String,
    proxyConfig: Object,
    disableCopy:Boolean,
    disableLint:Boolean,
    codeChange: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function (newCode) {
      }
    },
    placeholder:String,
    modeOptions: CodeMirrorModeOptions,
    height: {
      type: String,
      default: "100%"
    },
    width: {
      type: String,
      default: "100%"
    },
    readOnly:Boolean,
    fontSize: {
      type: Number,
    },
    lineHeight: {
      type: Number,
    },
    codeItemClick: {
      type: Function,
      // eslint-disable-next-line no-unused-vars
      default: function ({code}) {
      },
    },
    preferJsonEditor:Boolean,
    headerConfig: {},
    jsonEditorOptions:Object,
  },
  data() {
    return {
      jsonEditorOptionsInner: {
        onChange: (e) => {
          console.log(e)
        },
        mode: 'code',
        modes: ['tree', 'code','form'],
        search: false,
        sortObjectKeys: false,
        language: 'en',
        statusBar: true,
        enableTransform: false,
        navigationBar: true,
        enableSort: false
      },
      heightInner:this.height,
      CodeMirrorModeJSON,
      proxyLoading: false,
      codemirrorEditorID: jsb.xid(),
      codeLatest: '',// 当前最新code，用于提醒数据变化用
      codemirrorEditor: null,
      options: Object.assign(getDefaultOptions(), {
        readOnly: this.readOnly,
      }),
      codeProxy: '',// 通过proxy获取的数据，组件内的初始数据可能是prop中code也可能是这里的codeProxy
      lintError: '',
      visibleLintError: false,
      headerConfigRef: this.headerConfig || {enable:false},
      proxyConfigRef: this.proxyConfig || {enable:false},
      infoConfigRef: this.infoConfig || {},
      codeUsingObject:{},
      useJSONEditor:false,
    }
  },
  created() {
    if(this.jsonEditorOptions){
      this.jsonEditorOptionsInner = Object.assign(this.jsonEditorOptionsInner,this.jsonEditorOptions)
    }
    this.headerConfigRef = initToolbarConfig(this.headerConfigRef, {'padding-bottom': '9px'})
    jsb.objectAssignNX(this.infoConfigRef, {name: '', mode: ''})
    jsb.objectAssignNX(this.proxyConfigRef, {
      enable:true,
      // eslint-disable-next-line no-unused-vars
      query: function ({params}) {
        return new Promise((resolve, reject) => {
          reject("query not implemented")
        })
      },
      // eslint-disable-next-line no-unused-vars
      save: function ({info, params, code}) {
        return new Promise((resolve, reject) => {
          reject("query not implemented")
        })
      },
    })
    if(this.isJSON && this.preferJsonEditor){
      this.useJSONEditor = true
    }
    this.freshObjectForJsonEditor()
  },
  computed: {
    isJSON(){
      return getCodeMirrorMode(this.infoConfigRef.mode) === CodeMirrorModeJSON
    },
    codeUsing() {
      return this.proxyConfigRef.enable ? this.codeProxy : this.codeLatest
    },
    cssVars() {
      const setting = jsb.ccPath('CodeMirrorSetting',CodeMirrorSettingDefault)
      const fontSize = this.fontSize ||  jsb.pathGet(setting, 'FontSize')
      const lineHeight = this.lineHeight ||  jsb.pathGet(setting, 'LineHeight')
      return {
        "--font-size": `${fontSize}px`,
        "--line-height": `${lineHeight}%`,
        "--height": `${this.heightInner}`
      };
    }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    // this.codemirrorEditor = $('#' + this.codemirrorEditorID).find('.CodeMirror').get(0).CodeMirror;
    if(this.$refs.codemirror){
      this.codemirrorEditor = this.$refs.codemirror.codemirror
      this.codemirrorEditor.setSize('100%', this.height);
    }
    // code会由于数据通知到父组件导致父组件数据更新，导致changed判断错误
    this.refreshData(this.code)
    if (this.proxyConfigRef.enable) {
      // 在mounted的时候主动触发一次数据刷新，上层可以指定tab的lazy状态
      this.proxyRefresh()
    }
  },
  methods: {
    directionToolbarSpan,
    freshObjectForJsonEditor(){
      if(!this.isJSON){
        return
      }
      try {
        this.codeUsingObject= JSON.parse(this.codeUsing)
        // eslint-disable-next-line no-empty
      } catch (_) {
      }finally {
        if(!this.codeUsingObject){
          this.codeUsingObject = {}
        }
      }
    },
    privateCellClick({code, jsEvent}) {
      this.debug && this.setDebugMessage(`privateCodeItemClick code: ${code}`)
      if (this.codeItemClick({code})) {
        return
      }
      this.defaultCellClick({code, jsEvent})
    },
    handleCopy(jsEvent) {
      jsb.clipCopy(this.codeLatest, jsEvent)
    },
    defaultCellClick({code, jsEvent}) {
      switch (code) {
        case CodeButtonCopy:
          jsb.clipCopy(this.codeLatest, jsEvent)
          break;
        case CodeButtonRowSave:
          this.proxySave()
          break;
        case CodeButtonRefresh:
          this.proxyRefresh()
          break
        case CodeButtonLint:
          this.formatCode()
          break
        default:
          jsb.cc.toastWarning(`code ${code} no handler`)
      }
    },
    optionsUsing() {
      let theme = this.theme
      if (!theme) {
        theme = jsb.pathGet(jsb.ccPath('CodeMirrorSetting',CodeMirrorSettingDefault),'Theme')
      }
      this.options['mode'] = getCodeMirrorMode(this.infoConfigRef.mode)
      this.options['theme'] = theme
      return this.options
    },

    cellReplace(cell) {
      if (cell.code === CodeButtonLint) {
        cell.label = this.formatLintButtonTitle()
        cell.disable = this.formatLintButtonDisable()
      }
      return cell
    },
    // save操作要求返回设定之后的语句，进行对比，如果不同则认为设定失败
    proxySave() {
      this.proxyLoading = true
      let err = false;
      Promise.resolve(this.proxyConfigRef.save({
        info: this.infoConfig,
        params: jsb.pathGet(this.proxyConfigRef, 'params', []),
        code: this.codeLatest,
      })).catch(() => {
        err = true;
      }).then(() => {
        if (err) {
          return;
        }
        jsb.cc.toastSuccess(`提交成功`)
      }).finally(() => {
        this.proxyLoading = false
      })
    },
    proxyRefresh() {
      this.proxyLoading = true
      Promise.resolve(this.proxyConfigRef.query({params: jsb.pathGet(this.proxyConfigRef, 'params', {})})).catch(e => e).then(rest => {
        this.codeProxy = rest
        this.codeLatest = rest
      }).finally(() => {
        this.proxyLoading = false
      })
    },
    formatLintButtonTitle() {
      const mode = getCodeMirrorMode(this.infoConfigRef.mode)
      if (mode === CodeMirrorModeJSON) {
        return "语法检查 & 格式化"
      }
      if (mode === CodeMirrorModeYAML) {
        return "语法检查"
      }
      return "语法检查 & 格式化"
    },
    formatLintButtonDisable() {
      const mode = getCodeMirrorMode(this.infoConfigRef.mode)
      return !(mode === CodeMirrorModeJSON || mode === CodeMirrorModeYAML);
    },
    lintCheck() {
      const mode = getCodeMirrorMode(this.infoConfigRef.mode)
      try {
        if (mode === CodeMirrorModeJSON) {
          JSON.parse(this.codeLatest)
        } else if (mode === CodeMirrorModeYAML) {
          yaml.load(this.codeLatest)
        }
        return true
      } catch (e) {
        this.lintError = e.message
        this.visibleLintError = true
        return false
      }
    },
    lintSupport(){
      const mode = getCodeMirrorMode(this.infoConfigRef.mode)
      return mode === CodeMirrorModeJSON || mode === CodeMirrorModeYAML
    },
    formatCode() {
      // 格式校验
      if (!this.lintCheck()) {
        return
      }
      const mode = getCodeMirrorMode(this.infoConfig.mode)
      // 代码格式化
      if (mode === CodeMirrorModeJSON) {
        this.codeLatest = JSON.stringify(JSON.parse(this.codeLatest), null, 2)
      }
      jsb.cc.toastSuccess(`${this.formatLintButtonTitle()} 通过`)
    },
    onKeyDown(codeEvent) {
      if (codeEvent.ctrlKey || codeEvent.metaKey || codeEvent.shiftKey || codeEvent.altKey || codeEvent.code === 'Escape') {
        //组合按键
        return
      }
      if (codeEvent.target && codeEvent.target.className === 'CodeMirror-search-field') {
        // 搜索框
        return false
      }
      if (this.options.readOnly) {
        jsb.cc.toastWarning("只读模式,不允许修改.", {id: "codemirror-readonly"})
      }
    },
    privateShouldCellDisable({cell}) {
      if (this.readOnly) {
        // 按钮的禁用需要根据code区分，暂时全部屏蔽
        return true
      }
      return !!(cell.disable || cell.disabled);
    },
    privateShouldCellHide({cell}) {
      if (!cell) {
        return false
      }
      if (cell.hide || !jsb.pathGet(cell, 'show', true)) {
        return true
      }
      return false
    },
    privateOnInputEvent(newCode) {
      this.codeLatest = newCode
      if (this.codeChange) {
        this.codeChange(newCode)
      }
    },
    switchEdit() {
      this.options.readOnly = !this.options.readOnly
    },
    borderClass() {
      if (this.options.readOnly) {
        return 'codemirror-readonly'
      }
      return 'codemirror-editing'
    },
    onCmReady() {
      // cm.doc.clearHistory();
      // cm.refresh();
      // cm.on('keypress', () => {
      //   cm.showHint({completeSingle: false})
      // })
    },
    refreshData(code) {
      this.codeLatest = code
    },
    switchFullScreen(){
      this.$refs.fullScreen.switch()
    },
  },
}
</script>
<style lang="scss" scoped>

.codemirror-wrapper {
  ::v-deep .CodeMirror {
    font-size: var(--font-size) !important;
    line-height: var(--line-height) !important;
    height: var(--height) !important;
  }
}
.codemirror-matchhighlight {
  background-color: #ae00ae;
}

.codemirror-readonly {
  border: 1px solid gray
}

.codemirror-editing {
  border: 1px solid red
}

.class-lint-error .CodeMirror {
  background-color: #F8F8F8;
  border: 1px solid #eee;
  border-radius: 3px;
}
</style>
