
const jsb = require("@cg-devcenter/jsb")

import {xidRow} from "@/components/AimTable/table";

const uniqueFieldNameValidator = (fieldSchema,params) => {
    // eslint-disable-next-line no-unused-vars
    return (rule, value, callback) => {
        const rowData = jsb.pathGet(params,'row',{})
        const tableData =  jsb.pathGet(params,'data',{})
        const xidCurrent = xidRow(rowData)
        jsb.every(tableData, function (row) {
            if (xidRow(row) === xidCurrent) {
                return true
            }
            if (value === row[fieldSchema.field]) {
                callback(new Error(`${fieldSchema.name} 当前赋值不满足唯一性要求`));
                return false
            }
            return true
        })
        callback();
    }
}

// FormRulesFromSchema 构造schema的rules
export function FormRulesFromSchema(schema, paramsVisitor = undefined, nameField = 'name') {
    let rules = {}
    nameField = nameField || 'name'
    jsb.each(schema, function (fs) {
        if (!rules[fs.field]) {
            rules[fs.field] = []
        }
        if (fs.rules) {
            rules[fs.field].push(...fs.rules)
        }
        if (fs.required) {
            rules[fs.field].push({required: true, message: `${fs[nameField]}不能为空`, trigger: 'blur'})
        }
        if (fs.uniq && paramsVisitor) {
            rules[fs.field].push({validator: uniqueFieldNameValidator(fs,paramsVisitor), trigger: 'blur'})
        }
    })
    return rules
}


