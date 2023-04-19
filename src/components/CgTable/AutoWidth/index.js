function adjustColumnWidth(table, bindingValue) {
    if(!bindingValue.enabled) {
        return
    }
    forceAdjustColumnWidth(table, bindingValue)
}
function forceAdjustColumnWidth(table, bindingValue) {
    // doLayout后刷新一次宽度，解决fixed right导致的错乱问题
    // 注意这里不要主动更新table的组件属性，属性更新会导致componentUpdated，继而更新属性，循环调用
    bindingValue.doLayout(()=>{
        const padding = bindingValue.padding || 32
        const colgroup = table.querySelector("colgroup");
        const colDefs = [...colgroup.querySelectorAll("col")];
        colDefs.forEach((col) => {
            const clsName = col.getAttribute("name");
            const cells = [
                ...table.querySelectorAll(`td.${clsName}`),
                ...table.querySelectorAll(`th.${clsName}`),
            ];
            if (cells[0]?.classList?.contains?.("cg-column-fixed-width")) {
                return;
            }
            const widthList = cells.map((el) => {
                return el.querySelector(".cell")?.scrollWidth || 0;
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
            update() {},
            bind() {},
            inserted(el, binding) {
                setTimeout(() => {
                    adjustColumnWidth(el, binding.value);
                }, 300);
            },
            componentUpdated(el, binding) {
                setTimeout(() => {
                    el.classList.add("cg-table-auto-width");
                    adjustColumnWidth(el, binding.value);
                }, 300);
            },
            unbind() {},
        });
    },
};