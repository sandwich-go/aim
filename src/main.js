import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

const jsb = require("@cg-devcenter/jsb")

jsb.ccAssign({PagerConfig:{
    FieldNamePagerTotal:'PagerTotal',
    FieldNameCurrentPage:'PagerAutoGenPage',
}})

Vue.config.productionTip = false

window.addEventListener('error', e => {
    if (e.message === 'ResizeObserver loop limit exceeded') {
        const resizeObserverErrDiv = document.getElementById(
            'webpack-dev-server-client-overlay-div'
        );
        const resizeObserverErr = document.getElementById(
            'webpack-dev-server-client-overlay'
        );
        if (resizeObserverErr) {
            resizeObserverErr.setAttribute('style', 'display: none');
        }
        if (resizeObserverErrDiv) {
            resizeObserverErrDiv.setAttribute('style', 'display: none');
        }
    }
});
new Vue({
  render: h => h(App),
}).$mount('#app')
