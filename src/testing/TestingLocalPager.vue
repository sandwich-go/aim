<template>
  <div>
    <el-alert
        style="height: 28px;margin-bottom: 9px;font-weight: bold"
        title="本地分页演示"
        show-icon
        :closable="false"
        type="info"></el-alert>

    <!-- 本地分页演示 -->
    <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 10px 0; font-size: 18px;">📄 本地分页演示表格 - 前端分页功能</h3>
      <p style="margin: 0 0 8px 0; opacity: 0.9; font-size: 14px;">
        演示前端本地分页能力：数据一次性加载到前端，通过前端逻辑进行分页，提高用户体验，减少服务器请求
      </p>
      <p style="margin: 0; opacity: 0.9; font-size: 14px;">
        支持排序、筛选与分页的完美结合
      </p>
    </div>

    <el-input
      placeholder="输入名称过滤 回车确认"
      v-model="inputValue"
      @change="onInputChange"
      style="margin-bottom: 15px;"
    />

    <aim-table
        ref="tableLocalPager"
        :schema="schemaLocalPager"
        :pager-config="{isLocal:true}"
        :sort-config="{
          remote: false,
          multi: true,
          orders: []
        }"
        :filter-config="{remote:false}"
        :proxy-config="proxyConfigLocalPager">
    </aim-table>
  </div>
</template>

<script>
import AimTable from "@/components/AimTable/index.vue";

const jsb = require("@cg-devcenter/jsb")

export default {
  name: 'TestingLocalPager',
  components: {AimTable},
  data() {
    const _this = this
    return {
      inputValue: '',
      schemaLocalPager: [
        {field: 'id', name: 'ID', type: 'input', sortable: true, align: 'center', default: 0},
        {field: 'name', name: 'Name', type: 'input', sortable: true, align: 'center', default: 0},
        {field: 'age', name: 'Age', type: 'input_number', sortable: true, align: 'center', default: 0},
        {field: 'department', name: 'Department', type: 'select', sortable: true, align: 'center', default: 0, options: [{label: 'Engineering', value: 1}, {label: 'Marketing', value: 2}, {label: 'Sales', value: 3}, {label: 'HR', value: 4}], filter: true},
        {field: 'status', name: 'Status', type: 'select', sortable: true, align: 'center', default: 0, options: [{label: 'Active', value: 1}, {label: 'Inactive', value: 0}], filter: true},
      ],
      // 本地分页演示数据
      localPagerData: [],
      proxyConfigLocalPager: {
        id:'testing-table-local-pager',
        query({params}) {
          // 生成演示数据（如果还没有数据）
          if (_this.localPagerData.length === 0) {
            for (let i = 1; i <= 150; i++) {
              _this.localPagerData.push({
                id: i,
                name: `Employee ${i}`,
                age: Math.floor(Math.random() * 40) + 20,
                department: Math.floor(Math.random() * 4) + 1,
                status: Math.random() > 0.3 ? 1 : 0,
              })
            }
          }

          let data = jsb.clone(_this.localPagerData)

          // 应用筛选条件
          if (params.name) {
            jsb.remove(data, item => !item.name.toLowerCase().includes(params.name.toLowerCase()))
          }

          return Promise.resolve({
            Data: data,
            Total: data.length,
          })
        },
      },
    }
  },
  methods: {
    onInputChange() {
      this.$refs.tableLocalPager && this.$refs.tableLocalPager.fresh({params: {name: this.inputValue}})
    },
  }
}
</script>
