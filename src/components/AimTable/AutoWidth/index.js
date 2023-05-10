function adjustColumnWidth(table,bindingValue) {
    if (!bindingValue.enabled) {
        return
    }
    table.classList.add("aim-table-auto-width");
    forceAdjustColumnWidth(table, bindingValue)
}

function forceAdjustColumnWidth(table, bindingValue) {
    // doLayout后刷新一次宽度，解决fixed right导致的错乱问题,但是导致了当inplace编辑时填写数据后组件刷新，正在编辑的数据跳出视野
    // 注意这里不要主动更新table的组件属性，属性更新会导致componentUpdated，继而更新属性，循环调用
    bindingValue.doLayout(() => {
        const padding = bindingValue.padding || 60
        const colgroup = table.querySelector("colgroup");
        const colDefs = [...colgroup.querySelectorAll("col")];
        colDefs.forEach((col) => {
            const clsName = col.getAttribute("name");
            const cells = [
                ...table.querySelectorAll(`td.${clsName}`),
                ...table.querySelectorAll(`th.${clsName}`),
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
            table.querySelectorAll(`col[name=${clsName}]`).forEach((el) => {
                el.setAttribute("width", max + padding);
            });
        });
    })
}

export default {
    install(Vue) {
        Vue.directive("fit-columns", {
            update() {
            },
            bind() {
            },
            inserted(el, binding) {
                setTimeout(() => {
                    adjustColumnWidth(el, binding.value);
                }, 300);
            },
            componentUpdated(el, binding) {
                setTimeout(() => {
                    adjustColumnWidth(el, binding.value,true);
                }, 300);
            },
            unbind() {
            },
        });
    },
};