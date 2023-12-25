import * as excel from "./export2Excel";

function formatJson(filterVal, jsonData) {
    return jsonData.map(v => filterVal.map(j => {
        return v[j]
    }))
}
export function exportTable2Excel(tableScheme,tableData,exportFields=null) {
    let tableTitle = []
    let tableField= []
    let tableRows = []
    for(const fieldSchema of tableScheme) {
        if(!exportFields || exportFields.includes(fieldSchema.name||fieldSchema.title)){
            tableTitle.push(fieldSchema.name||fieldSchema.title)
            tableField.push(fieldSchema.field)
        }
    }
    for(const row of tableData) {
        let rowData = {}
        for(const fieldSchema of tableScheme) {
            if(!exportFields || exportFields.includes(fieldSchema.name||fieldSchema.title)){
                rowData[fieldSchema.field] = row[fieldSchema.field] || ''
            }
        }
        tableRows.push(rowData)
    }
    excel.export_json_to_excel({
        header: tableTitle,
        data: formatJson(tableField,tableRows),
        autoWidth: true,
        filename:'',
    })
}
