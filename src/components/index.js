import AimTable from './AimTable/index.vue'
import AimFormInput from './AimFormInput/index.vue'
import AimPopup from './AimPopup/index.vue'
import AimTinymce from "@/components/AimTinymce/index.vue";
import AimCodeMirror from "@/components/AimCodeMirror/index.vue";

const components = [
    AimTable,
    AimFormInput,
    AimPopup,
    AimTinymce,
    AimCodeMirror,
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