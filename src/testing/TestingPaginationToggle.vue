<template>
  <div class="testing-pagination-toggle">
    <el-alert
      title="本地分页 / 无限滚动切换"
      type="info"
      :closable="false"
      show-icon>
      <template slot="default">
        默认勾选“显示分页”，使用普通本地分页；取消勾选后，页码隐藏并显示“共 xx 条”。表格会先渲染 50 条，滚动到表格底部后继续加载下一批数据。
      </template>
    </el-alert>

    <div class="toolbar">
      <el-input
        v-model="keyword"
        class="keyword-input"
        clearable
        placeholder="按名称筛选，回车或失焦后查询"
        @change="queryTable"/>
    </div>

    <aim-table
      ref="table"
      :schema="schema"
      :pager-config="pagerConfig"
      :sort-config="{remote: false, multi: true, orders: []}"
      :filter-config="{remote: false}"
      :table-property="{maxHeight: 460}"
      :proxy-config="proxyConfig"/>
  </div>
</template>

<script>
import AimTable from "@/components/AimTable/index.vue"

const departments = ['研发', '市场', '运营', '客服']
const statuses = ['启用', '停用']

export default {
  name: 'TestingPaginationToggle',
  components: {AimTable},
  data() {
    const rows = Array.from({length: 150}, (_, index) => {
      const id = index + 1
      return {
        id,
        name: `演示用户 ${id}`,
        department: departments[index % departments.length],
        status: statuses[index % statuses.length],
        updatedAt: `2026-09-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}`,
      }
    })

    return {
      keyword: '',
      rows,
      pagerConfig: {
        enable: true,
        showTotal: true,
        isLocal: true,
        infiniteScroll: true,
        paginationToggle: true,
        paginationDefault: true,
        pageSize: 10,
        infinitePageSize: 50,
        pageSizes: [10, 20, 50, 100],
        layout: 'total,prev,pager,next,sizes,->',
      },
      schema: [
        {field: 'id', name: 'ID', type: 'input', sortable: true, width: 100},
        {field: 'name', name: '名称', type: 'input', sortable: true, minWidth: 220},
        {field: 'department', name: '部门', type: 'input', sortable: true, minWidth: 160},
        {field: 'status', name: '状态', type: 'input', sortable: true, minWidth: 160},
        {field: 'updatedAt', name: '更新时间', type: 'input', sortable: true, minWidth: 220},
      ],
      proxyConfig: {
        id: 'testing-pagination-toggle',
        query: ({params}) => {
          const keyword = String((params && params.keyword) || '').trim()
          const data = keyword
            ? rows.filter(row => row.name.includes(keyword))
            : rows
          return Promise.resolve({Data: data, Total: data.length})
        },
      },
    }
  },
  methods: {
    queryTable() {
      this.$refs.table && this.$refs.table.fresh({params: {keyword: this.keyword}})
    },
  },
}
</script>

<style scoped>
.testing-pagination-toggle {
  padding: 12px;
}

.toolbar {
  margin: 16px 0;
}

.keyword-input {
  width: 360px;
}
</style>
