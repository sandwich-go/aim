import Sortable from "sortablejs";
export function setRowDrag(tabelRef,tableData){
    const el = tabelRef.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    return Sortable.create(el, {
        ghostClass: 'sortable-ghost', // el-talbe fixed模式下会导致这个效果失效，导致操作不明显
        animation: 100,
        setData: function (dataTransfer) {
            // to avoid Firefox bug
            // Detail see : https://github.com/RubaXa/Sortable/issues/1012
            dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
            const targetRow = tableData.splice(evt.oldIndex, 1)[0]
            tableData.splice(evt.newIndex, 0, targetRow)
        }
    })
}