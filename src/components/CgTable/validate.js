import {xidRow} from "@/components/CgTable/table";

const jsb = require("@sandwich-go/jsb")
const uniqueFieldNameValidator = (fieldSchema) => {
    return (rule, value, callback, params) => {
        const rowData = params.row || {}
        const tableData = params.data || []
        const xidCurrent = xidRow(rowData)
        let error = null
        jsb.every(tableData, function (row) {
            const rowId = xidRow(row)
            if (rowId === xidCurrent) {
                return true
            }
            if (value === row[fieldSchema.field]) {
                error = new Error(`${fieldSchema.name} 当前赋值: ${value} 不满足唯一性要求`)
                return false
            }
            return true
        })
        callback(error);
    }
}


export function formRulesFromSchema(schema, paramsVisitor=undefined, nameField = 'name') {
    let rules = {}
    jsb.each(schema, function (fs) {
        rules[fs.field] = fs.rules || []
        if (fs.required) {
            rules[fs.field].push([{required: true, message: `${fs[nameField]}不能为空`, trigger: 'blur'}])
        }
        if (fs.uniq) {
            rules[fs.field].push([{
                validator: uniqueFieldNameValidator(fs),
                trigger: 'blur',
                params: paramsVisitor,
            }])
        }
    })
    return rules
}

