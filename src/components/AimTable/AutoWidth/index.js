import {minWidthTableColumn} from "@/components/cells/types";

export const AimTableAutoWidthClass = 'aim-table-auto-width'

export function forceAdjustColumnWidth(tableEL, bindingValue) {
    // doLayout后刷新一次宽度，解决fixed right导致的错乱问题,但是导致了当inplace编辑时填写数据后组件刷新，正在编辑的数据跳出视野
    // 注意这里不要主动更新table的组件属性，属性更新会导致componentUpdated，继而更新属性，循环调用
    bindingValue.doLayout(() => {
        const padding = bindingValue.padding || 60
        const colgroup = tableEL.querySelector("colgroup");
        const colDefs = [...colgroup.querySelectorAll("col")];
        colDefs.forEach((col) => {
            const clsName = col.getAttribute("name");
            const cells = [
                ...tableEL.querySelectorAll(`td.${clsName}`),
                ...tableEL.querySelectorAll(`th.${clsName}`),
            ];
            if (cells[0] && cells[0].classList && cells[0].classList.contains("aim-column-fixed-width")) {
                return;
            }
            const widthList = cells.map((el) => {
                const cell = el.querySelector(".cell");
                if(cell && cell.scrollWidth){
                    return cell.scrollWidth
                }
                return 0
            });
            const max = Math.max(...widthList);
            tableEL.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
                el.setAttribute("width", `${max + padding}px`);
                console.log("set width ",el,max,el.getAttribute("width"))
            });
        });
    })
}

const jsb = require("@sandwich-go/jsb")

// 使用min_width_dynamic承接动态宽度需求，防止所有的列计算完宽度后有剩余，el 自动分配剩余宽度
export function flexColumnWidth(schema,tableData) {
    jsb.each(schema,async (fieldSchema) => {
        if (fieldSchema.width || fieldSchema.min_width || fieldSchema.min_width_dynamic) {
            return
        }
        let headerExtraWidth = 0
        if (fieldSchema.required) {
            headerExtraWidth = headerExtraWidth + 40
        }
        if (jsb.pathGet(fieldSchema, 'sortable', true)) {
            headerExtraWidth = headerExtraWidth + 40
        }
        if (fieldSchema.lock) {
            headerExtraWidth = headerExtraWidth + 40
        }
        if (fieldSchema.tips) {
            headerExtraWidth = headerExtraWidth + 40
        }
        // 两侧padding
        let headerTextWidth = jsb.textWidth(fieldSchema.name) + 20
        const headerWidth = headerTextWidth + headerExtraWidth
        const minWidth = minWidthTableColumn(fieldSchema.type)

        const valueToString = fieldSchema['valueToString']
        const arr = tableData.map(x =>{
            if(valueToString){
                return valueToString(x[fieldSchema.field])
            }
            return String(x[fieldSchema.field])
        })
        const isHTML = fieldSchema.type === "html" || fieldSchema.cell === "CellViewHTML"
        jsb.remove(arr, item => jsb.isEmpty(item))
        let contentWidth = 0
        if (isHTML) {
            // 页面创建过程中，浏览器可能还没有完成对 HTML 内容的渲染和布局，无法获取html宽度
            contentWidth = await jsb.longestHTMLWidth(arr)
        } else {
            contentWidth = jsb.longestTextWidth(arr)
        }
        if (contentWidth < minWidth) {
            contentWidth = minWidth
        }
        if (contentWidth < headerWidth) {
            contentWidth = headerWidth
        }
        // shortcut 14宽度+ 3 padding
        fieldSchema.min_width_dynamic = contentWidth + jsb.size(fieldSchema.shortcuts || {}) * 20
        if(fieldSchema.max_width && fieldSchema.min_width_dynamic > fieldSchema.max_width){
            // 如果设定了最大宽度且当前计算的动态宽度已大于最大宽度则限定 width
            fieldSchema.width = fieldSchema.max_width
        }
    })
}