<template>
  <div>
    <div class="ef-node-form" id="nod">
      <div class="ef-node-form-header">
        编辑
      </div>
      <div class="ef-node-form-body">
        <el-form :model="node" ref="dataForm" label-width="auto" v-show="type === 'node'" size="mini">
<!--          基础信息不允许编辑调整-->
<!--          <el-form-item label="类型">-->
<!--            <el-input v-model="node.type" :disabled="true"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="left坐标">-->
<!--            <el-input v-model="node.left" :disabled="true"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="top坐标">-->
<!--            <el-input v-model="node.top" :disabled="true"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="图标">-->
<!--            <el-input v-model="node.ico"></el-input>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="状态">-->
<!--            <el-select v-model="node.state" placeholder="请选择">-->
<!--              <el-option-->
<!--                  v-for="item in stateList"-->
<!--                  :key="item.state"-->
<!--                  :label="item.label"-->
<!--                  :value="item.state">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
          <el-form-item label="名称">
            <el-input v-model="node.name"></el-input>
          </el-form-item>
          <el-form-item label="版本" >
            <el-select v-model="node.version" style="width: 100%">
              <el-option value="1.0.3"></el-option>
              <el-option value="1.0.2"></el-option>
              <el-option value="1.0.1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="输入参数" >
            <aim-form-input
                v-if="nodeID"
                :key="nodeID"
                :schema="inputSchema"
                :data="node.data_input"
            />
          </el-form-item>

          <el-form-item label="执行失败时">
            <el-radio v-model="node['failTo']" label="suspend">挂起</el-radio>
            <el-radio v-model="node['failTo']" label="ignore">忽略</el-radio>
          </el-form-item>

          <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="save">保存</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="line" ref="dataForm" label-width="80px" v-show="type === 'line'">
          <el-form-item label="条件">
            <el-input v-model="line.label"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-close">重置</el-button>
            <el-button type="primary" icon="el-icon-check" @click="saveLine">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--            <div class="el-node-form-tag"></div>-->
    </div>
  </div>

</template>

<script>
import { cloneDeep } from 'lodash'
import jsb from "@sandwich-go/jsb";
import AimFormInput from "@/components/AimFormInput/index.vue";
import {FillDefaultDataWithSchema} from "@/components/AimTable/default";
export default {
  components: {AimFormInput},
  computed:{
    inputSchema(){
      return jsb.pathGet(this.nodeTemplate,'input.schema',[])
    },
    nodeID(){
      return jsb.pathGet(this.node,'id')
    },
  },
  data() {
    return {
      visible: true,
      // node 或 line
      type: 'node',
      node: {},
      nodeTemplate: {},
      line: {},
      data: {},
      stateList: [{
        state: 'success',
        label: '成功'
      }, {
        state: 'warning',
        label: '警告'
      }, {
        state: 'error',
        label: '错误'
      }, {
        state: 'running',
        label: '运行中'
      }]
    }
  },
  methods: {
    // 表单修改，这里可以根据传入的ID进行业务信息获取
    nodeInit(data, node,nodeTemplate) {
      this.type = 'node'
      this.data = data

      this.node = cloneDeep(node)
      this.node.data_input =  FillDefaultDataWithSchema(this.inputSchema,this.node.data_input)
      this.nodeTemplate = nodeTemplate
    },
    lineInit(line) {
      this.type = 'line'
      this.line = line
    },
    // 修改连线
    saveLine() {
      this.$emit('setLineLabel', this.line.from, this.line.to, this.line.label)
    },
    save() {
      this.data.nodeList.filter((node) => {
        if (node.id === this.node.id) {
          node.name = this.node.name
          node.left = this.node.left
          node.top = this.node.top
          node.ico = this.node.ico
          node.state = this.node.state
          this.$emit('repaintEverything')
        }
      })
    }
  }
}
</script>

<style>
.el-node-form-tag {
  position: absolute;
  top: 50%;
  margin-left: -15px;
  height: 40px;
  width: 15px;
  background-color: #fbfbfb;
  border: 1px solid rgb(220, 227, 232);
  border-right: none;
  z-index: 0;
}
</style>