<script>

import jsb from "@sandwich-go/jsb";
import {cellNameForFormByType} from "@/components/cells/types";
import {CodeButtonFilterSearch} from "@/components/cells/const";

export default {
  name: 'MixinFilter',
  props: {
    filterConfig: Object,
  },
  data() {
    return {
      filterConfigRef: this.filterConfig || {}
    }
  },
  methods: {
    filterRemote() {
      return jsb.pathGet(this.filterConfigRef, 'remote', true)
    },
    processSchemaFilter() {
      const _this = this
      let schemaFilter = []
      const filterConfigFields = jsb.pathGet(this.filterConfigRef, 'fields', [])
      jsb.each(this.schema, function (fs) {
        let fieldFilter = fs.filter
        if (!fieldFilter) {
          fieldFilter = jsb.find(filterConfigFields, item => item.field === fs.field)
        }
        if (!fieldFilter) {
          return
        }
        if (jsb.isBoolean(fieldFilter)) {
          fieldFilter = {}
        }
        if (!fieldFilter.type) {
          fieldFilter.type = fs.type
        }
        if (!fieldFilter.field) {
          fieldFilter.field = fs.field
        }
        if (jsb.isEmpty(fieldFilter.options)) {
          fieldFilter.options = fs.options
        }
        if (!fieldFilter.cell) {
          fieldFilter.cell = cellNameForFormByType(fieldFilter.type)
        }
        fieldFilter.data = _this.filterData
        _this.filterTypeMapping[fieldFilter.field] = fieldFilter
        schemaFilter.push(fieldFilter)
      })
      if (schemaFilter.length) {
        schemaFilter.push({code: CodeButtonFilterSearch})
        let leftCells = jsb.pathGet(this.headerConfigRef, 'leftCells', ['FILTER'])
        if(jsb.isEmpty(leftCells)){
          leftCells = ['FILTER']
        }
        jsb.each(leftCells, function (cell, index) {
          if (jsb.isString(cell) && cell.toUpperCase() === 'FILTER') {
            leftCells.splice(index, 1, ...schemaFilter);
          }
        })
        if (!this.headerConfigRef) {
          this.headerConfigRef = {}
        }
        // 强制机会
        this.headerConfigRef.enable = true
        this.headerConfigRef.leftCells = leftCells
      }
    }
  }
}
</script>