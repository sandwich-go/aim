<script>

export default {
  name: 'MixinComponentMap',
  data() {
    return {
      registeredComponentMap: {},
    }
  },
  created() {
    this.registerFiles(require.context('@/components/types', true, /^((?!\.\/_).)*\.vue$/))
  },
  methods: {
    registerFiles(files){
      const _this = this
      files.keys().forEach(key => {
        const name = key.replace(/(\.\/|\.vue)/g, '')
        const component = files(key).default
        _this.registerComponent(name, component)
      })
    },
    registerComponent(name, component) {
      this.registeredComponentMap[name] = component
    }
  },
  mounted() {
  },
  computed: {}
}
</script>
