let dataA = {
    name: '流程A',
    nodeList: [
        {
            id: 'nodeA',
            template_id:'',
            name: '流程A-节点A',
            left: '26px',
            top: '161px',
            ico: 'el-icon-user-solid',
        },
        {
            id: 'nodeB',
            template_id:'',
            name: '流程A-节点B',
            left: '340px',
            top: '161px',
            ico: 'el-icon-goods'
        },
        {
            id: 'nodeC',
            template_id:'',
            node_type:'',
            name: '流程A-节点C',
            left: '739px',
            top: '161px',
            ico: 'el-icon-present'
        }
    ],
    lineList: [{
        from: 'nodeA',
        to: 'nodeB'
    }, {
        from: 'nodeB',
        to: 'nodeC'
    }]
}

export function getDataA () {
    return dataA
}