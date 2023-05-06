const jsb = require("@sandwich-go/jsb")

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

export function formRulesFromSchema(schema, paramsVisitor = undefined, nameField = 'name') {
    let rules = {}
    jsb.each(schema, function (fs) {
        if (fs.rules) {
            rules[fs.field] = fs.rules
        }
        if (fs.required) {
            if (!rules[fs.field]) {
                rules[fs.field] = []
            }
            rules[fs.field].push({required: true, message: `${fs[nameField]}不能为空`, trigger: 'blur'})
        }
        if (fs.uniq) {
            if (!rules[fs.field]) {
                rules[fs.field] = []
            }
            rules[fs.field].push({
                validator: uniqueFieldNameValidator(fs,paramsVisitor),
                trigger: 'blur',
            })
        }
    })
    return rules
}

