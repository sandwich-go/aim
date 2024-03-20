<template>
  <div class="flow-menu" ref="tool">
    <div v-for="menu  in  menuList" :key="menu.id">
      <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
      <ul v-show="menu.open" class="ef-node-menu-ul">
        <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
          <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :id="subMenu.id">
            <i :class="subMenu.ico" :style="subMenu.style"></i> {{subMenu.name}}
          </li>
        </draggable>
      </ul>
    </div>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

var mousePosition = {
  left: -1,
  top: -1
}

export default {
  data() {
    return {
      activeNames: '1',
      // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
      draggableOptions: {
        preventOnFilter: false,
        sort: false,
        disabled: false,
        ghostClass: 'tt',
        // 不使用H5原生的配置
        forceFallback: true,
        // 拖拽的时候样式
        // fallbackClass: 'flow-node-draggable'
      },
      // 默认打开的左侧菜单的id
      defaultOpeneds: ['1', '2'],
      menuList: [
        {
          id: '1',
          type: 'group',
          name: '触发器',
          ico: 'el-icon-video-play',
          open: true,
          children: [
            {
              id: '10001',
              type: 'timer',
              name: '数据接入',
              ico: 'el-icon-time',
              // 自定义覆盖样式
              style: {}
            },
            {
              id: '10002',
              type: 'task',
              name: '接口调用',
              ico: 'el-icon-odometer',
              // 自定义覆盖样式
              style: {},
              // 输入参数
              input:{
                schema:[
                  {field:'field1',name:'字段1',type:'input',valType:'string'},
                  {field:'field2',name:'字段2',type:'select',valType:'string'},
                  {field:'field3',name:'字段3',type:'checkbox',valType:'boolean'},
                ],
              },
              // 输出参数
              output:{},
            },
            {
              id: '10003',
              type: 'cron',
              name: '周期调用',
              ico: 'el-icon-timer',
              // 自定义覆盖样式
              style: {},
            }
          ]
        },
        {
          id: '2',
          type: 'group',
          name: '结束节点',
          ico: 'el-icon-video-pause',
          open: true,
          children: [
            {
              id: '10004',
              type: 'end',
              name: '流程结束',
              ico: 'el-icon-caret-right',
              // 自定义覆盖样式
              style: {}
            }, {
              id: '10005',
              type: 'over',
              name: '数据清理',
              ico: 'el-icon-shopping-cart-full',
              // 自定义覆盖样式
              style: {}
            }
          ]
        }
      ],
      nodeMenu: {}
    }
  },
  components: {
    draggable
  },
  created() {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function (event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX
        mousePosition.top = event.clientY - 50
        event.preventDefault();
        event.stopPropagation();
      }
    }
  },
  methods: {
    // 根据类型获取左侧菜单对象
    getMenuByTemplateID(templateID) {
      for (let i = 0; i < this.menuList.length; i++) {
        let children = this.menuList[i].children;
        for (let j = 0; j < children.length; j++) {
          if (children[j].id === templateID) {
            return children[j]
          }
        }
      }
    },
    // 拖拽开始时触发
    // eslint-disable-next-line no-unused-vars
    move(evt, a, b, c) {
      const templateID = evt.item.attributes.id.nodeValue;
      this.nodeMenu = this.getMenuByTemplateID(templateID)
    },
    // 拖拽结束时触发
    // eslint-disable-next-line no-unused-vars
    end(evt, e) {
      this.$emit('addNode', evt, this.nodeMenu, mousePosition)
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent
      if (userAgent.indexOf("Firefox") > -1) {
        return true
      }
      return false
    }
  }
}
</script>