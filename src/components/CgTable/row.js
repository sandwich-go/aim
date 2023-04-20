import {xidRow} from "@/components/CgTable/table";
import jsb from "@sandwich-go/jsb";

export function  summaryRow(schema,row) {
    let info = [`xid(${xidRow(row)})`]
    jsb.each(schema, function (fieldSchema) {
        if (fieldSchema.summary) {
            info.push(`${fieldSchema.name}(${row[fieldSchema.field]})`)
        }
    })
    return info.join(" , ")
}