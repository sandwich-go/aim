import AimTable from './AimTable/index.vue'
import AimFormInput from './AimFormInput/index.vue'
import AimDrawer from './AimDrawer/index.vue'

const components = [
    AimTable,
    AimFormInput,
    AimDrawer,
]

const install = (Vue) => {
    components.forEach(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}
export default {
    install
}