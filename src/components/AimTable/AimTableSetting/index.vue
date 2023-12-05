<template>
  <div class="aim-table-setting">
    <el-tabs v-model="activeTabName" @tab-click="tabChange" class="aim-table-setting-tabs">
      <el-tab-pane name="row_template">
        <el-tooltip
            slot="label"
            effect="light"
            content="默认值将作为新建条目时的默认数据存在"
        ><span><i class="el-icon-tickets" style="padding-right: 3px"/>默认值</span>
        </el-tooltip>
        <aim-form-input
            v-if="rowTemplate"
            ref="rowTemplate"
            style="padding-right: 9px"
            :schema="schemaCleaned"
            :group-config="groupConfig"
            :data="rowTemplate"
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
      <el-tab-pane  name="setting">
        <el-tooltip
            slot="label"
            effect="light"
            content="自定义字段显示与否、宽度、字段级授权"
        ><span><i class="el-icon-setting" style="padding-right: 3px"/>字段控制</span>
        </el-tooltip>
        <aim-table
            v-if="fields"
            :schema="fieldSettingSchema()"
            :proxy-config="newLocalDataProxyWithFieldName(thisTarget(),'fields')"
            :table-property="{autoWidth:false,heightSubVH:160}"
            :popup-append-to-body="true"
            :drag-config="{icon:true}"
            :edit-config="{}"
        ></aim-table>
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
import {fieldSetting, fieldSettingSchema} from "@/components/AimTable/AimTableSetting/setting";
import {newLocalDataProxyWithFieldName} from "@/components/AimTable/proxy_local";
import {CleanTableForStorage} from "@/components/AimTable/formatterForUpdate";

export default {
  name:'AimTableSetting',
  components: {
    AimFormInput,
    AimTable: () => import("@/components/AimTable"),
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
  data() {
    return {
      AimFormInputTemplate: AimFormInputTemplate,
      schemaCleaned: [],
      activeTabName: 'row_template',
      rowTemplate: null,
      fields: null,
    }
  },
  created() {
    this.schemaCleaned = this.cleanSchema()
    this.query()
  },
  methods:{
    newLocalDataProxyWithFieldName,
    thisTarget(){
      return this
    },
    fieldSettingSchema() {
      return fieldSettingSchema
    },
    tipSlotName:tipSlotName,
    getProxyTipSlotName:getProxyTipSlotName,
    getProxyCommentSlotNameWithName:getProxyCommentSlotNameWithName,
    tabChange(){
      jsb.cc.emitter.emit('aim_table_layout')
    },
    query() {
      const querySetting = jsb.pathGet(this.proxy, 'querySetting')
      if (!querySetting) {
        jsb.cc.toastWarning("querySetting not found")
        return
      }
      Promise.resolve(querySetting()).then((resp) => {
        this.rowTemplate = jsb.pathGet(resp, 'template', {})
        this.fields= fieldSetting(this.schemaCleaned,jsb.pathGet(resp, 'fields', []))
      })
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
      const data = {}
      data.template = row2ItemSetting(this.$refs.rowTemplate.getDataForStorage())
      data.fields = CleanTableForStorage(fieldSettingSchema,this.fields,true,true,true)

      Promise.resolve(saveSetting({setting:data})).then(()=>{
        jsb.cc.toastSuccess("更新成功")
        return true}
      )
    },
    cleanSchema(){
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

<style lang="scss" scoped>
.aim-table-setting-tabs.el-tabs {
  ::v-deep .el-tabs--card {
    height: calc(100vh - 160px);
  }

  ::v-deep .el-tab-pane {
    height: calc(100vh - 160px);
    overflow-y: auto;
  }
}
</style>