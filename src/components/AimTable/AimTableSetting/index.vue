<template>
  <div class="aim-table-setting">
    <el-tabs v-model="activeTabName" @tab-click="tabChange">
      <el-tab-pane name="row_template">
        <span slot="label"><i class="el-icon-tickets" style="padding-right: 3px"/>模版</span>
        <aim-form-input
            style="padding-right: 9px"
            ref="aimFormInput"
            :schema="cleanField()"
            :group-config="groupConfig"
            :data="data.template"
            :mode="AimFormInputTemplate"
            :enable-watcher="true"
            :submit-remove-field-not-in-schema="true"
        >
          <template v-for="fs in schema" v-slot:[getProxyTipSlotName(fs)]="{}">
            <slot v-if="tipSlotName(fs)" :name="tipSlotName(fs)" :field-schema="fs"/>
          </template>
          <template v-for="name in allCommentSlotName"
                    v-slot:[getProxyCommentSlotNameWithName(name)]="{fieldSchema,row}">
            <slot :name="name" :field-schema="fieldSchema" :row="row"/>
          </template>
        </aim-form-input>
      </el-tab-pane>
      <el-tab-pane  name="setting" disabled>
        <span slot="label"><i class="el-icon-setting" style="padding-right: 3px"/>显示控制</span>
<!--        <aim-table-editor-->
<!--            editor-table-key="aim-table-editor"-->
<!--            :editor-group-options="editorGroupOptions"-->
<!--            :editor-user-options="editorUserOptions"-->
<!--            :editor-proxy-config="editorProxyConfig"-->
<!--            :schema="cloneSchema()">-->
<!--        </aim-table-editor>-->
      </el-tab-pane>
    </el-tabs>
    <div class="aim-popup aim-drawer-footer" style="background-color: #b3e6c8">
      <el-button size="mini" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import AimFormInput from "@/components/AimFormInput/index.vue";
import {filterVirtualField} from "@/components/AimTable/virtual_field";
import {AimFormInputTemplate} from "@/components/AimFormInput";
import {
  allSlotName,
  getProxyCommentSlotNameWithName,
  getProxyTipSlotName,
  tipSlotName
} from "@/components/AimTable/slot";

import jsb from "@sandwich-go/jsb";
export default {
  name:'AimTableSetting',
  components: {
    AimFormInput
  },
  props:{
    schema:Array,
    groupConfig:Array,
    proxy:Object,
  },
  computed:{
    allCommentSlotName() {
      return allSlotName(this.schema, 'commentSlot')
    }
  },
  data(){
    return{
      AimFormInputTemplate:AimFormInputTemplate,
      activeTabName:'row_template',
      data:{
        template:{},
      },
    }
  },
  created() {
    const querySetting = jsb.pathGet(this.proxy,'querySetting')
    if(!querySetting){
      jsb.cc.toastWarning("querySetting not found")
      return
    }
    Promise.resolve(querySetting).then((resp) => {
      this.data = resp || {}
    })
  },
  methods:{
    tipSlotName:tipSlotName,
    getProxyTipSlotName:getProxyTipSlotName,
    getProxyCommentSlotNameWithName:getProxyCommentSlotNameWithName,
    tabChange(){
      jsb.cc.emitter.emit('aim_table_layout')
    },
    save(){
      const saveSetting = jsb.pathGet(this.proxy,'saveSetting')
      if(!saveSetting){
        jsb.cc.toastWarning("saveSetting not found")
        return
      }

      // 不进行form级别的验证
      let row2ItemSetting  = jsb.pathGet(this.proxy,'row2ItemSetting')
      if(!row2ItemSetting){
        row2ItemSetting = jsb.pathGet(this.proxy,'row2Item',(v)=>{return v})
      }
      this.data.template = row2ItemSetting(this.data.template)
      Promise.resolve(saveSetting({setting:this.data})).then(
          jsb.cc.toastSuccess("更新成功")
      )
    },
    cloneSchema() {
      return jsb.clone(this.schema)
    },
    cleanField(){
      let schemaValid = []
      jsb.each(filterVirtualField(this.schema), function (fieldSchema) {
        if(jsb.pathGet(fieldSchema,'showTemplate',true)){
          const tmp = jsb.clone(fieldSchema)
          // 模版中移除所有的规则
          tmp.rules = []
          tmp.required= false
          tmp.uniq = false
          schemaValid.push(tmp)
        }
      })
      return schemaValid
    },
  }
}
</script>