import jsb from "@sandwich-go/jsb";

export function treeNodeMapping(group, mapping) {
    group = group || []
    for (const item of group) {
        if (mapping[item.id]) {
            console.log(`duplicate tree id with ${item.id}`)
            return item.id
        } else {
            mapping[item.id] = item
        }
    }
    for (let index in group) {
        const duplicated = treeNodeMapping(group[index]['children'], mapping)
        if (duplicated) {
            return duplicated
        }
    }
    return ''
}
export function groupItemIsApp(item) {
    return item['isApp']
}
function app2TreeItem(app,idField='id',labelField='name') {
    const id = app[idField]
    const name = app[labelField]
    return {
        id: id,
        label: name,
        value: id,
        icon: app.icon || 'el-icon-s-grid',
        dropDisabled: true,
        selected: false,
        isApp: true,
    }
}

function appendAppToTreeNode(mapping, nodeID, appList,treeRootID) {
    let node = mapping[nodeID] || mapping[treeRootID]
    if (!node.children) {
        node.children = []
    }
    for (const app of appList) {
        const treeItem = app2TreeItem(app)
        node.children.push(treeItem)
    }
}
export function groupID2Path(path, group, dst) {
    for (const item of group) {
        const newPath = path + "/" + item.label
        dst[item.id] = newPath
        groupID2Path(newPath, jsb.pathGet(item, 'children', []), dst)
    }
}

export function groupTreeDataAppendApp(treeData, appList,appIDField='id',groupIDField='group_id',treeRootID='root') {
    treeData = tryFixTree(treeData,treeRootID)
    let groupXid2AppMapping = {}
    let appMapping = {}
    for (const item of appList) {
        const groupID  = jsb.pathGet(item,groupIDField,treeRootID)
        if (!groupXid2AppMapping[groupID || treeRootID]) {
            groupXid2AppMapping[groupID || treeRootID] = []
        }
        groupXid2AppMapping[groupID || treeRootID].push(item)
        // 缓存app数据
        appMapping[item[appIDField]] = item
    }
    // 构建节点映射
    let mapping = {}
    treeNodeMapping(treeData, mapping)
    // 填充节点元素
    for (const nodeID in groupXid2AppMapping) {
        appendAppToTreeNode(mapping, nodeID, groupXid2AppMapping[nodeID],treeRootID)
    }
    const fixedTree = tryFixTree(treeData,treeRootID)
    return {'tree': fixedTree, 'appMap': appMapping}
}
function getInitData(treeRootID) {
    return {
        "id": treeRootID,
        "label": "",
        "icon": "el-icon-s-home",
        "opened": true,
        "noBrother": true, // 根节点不允许添加同级节点
        "itemSize": '',
        "children": [],
    }
}
// tryFixTree 修正树, 引入一个根节点,同时保护pmtRootID，envRootID不被删除
export function tryFixTree(treeData,treeRootID) {
    if(treeData.length ===0) {
        treeData = [jsb.clone(getInitData(treeRootID))]
    }
    if (treeData.length > 1 || (treeData.length === 1 && treeData[0].id !== treeRootID)) {
        let fixedTree = jsb.clone(getInitData(treeRootID))
        // 初始数据有且只有一个节点
        fixedTree[0].children = treeData
        return fixedTree
    }
    return treeData
}