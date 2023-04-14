import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

const jsb = require("@sandwich-go/jsb")

jsb.ccAssign({PagerConfig:{
    FieldNamePagerTotal:'PagerTotal',
    FieldNameCurrentPage:'PagerAutoGenPage',
}})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
