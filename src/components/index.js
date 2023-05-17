import AimTable from './AimTable/index.vue'
import AimFormInput from './AimFormInput/index.vue'
import AimDrawer from './AimDrawer/index.vue'
import AutoWidth from './AimTable/AutoWidth';
import LoadingOverlay from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

const components = [
    AimTable,
    AimFormInput,
    AimDrawer,
]

const install = (Vue) => {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
    Vue.use(AutoWidth)
    Vue.use(LoadingOverlay)
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}