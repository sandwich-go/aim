<script>
export default {
  name: 'MixinCgPager',
  data () {
    return {
      PagerTotal:0,
      PagerAutoGenPage: 0,
      PagerAutoGenSize: 30,
      PagerFreshFunc:null,
    }
  },
  methods: {
    PagerInit(onPageChangeFunc,autoGenSize=30){
      this.PagerFreshFunc = onPageChangeFunc
      this.PagerAutoGenSize = autoGenSize
    },
    PagerPageChange(e) {
      this.PagerAutoGenPage = e - 1
      this.PagerFreshFunc()
    },
    PagerPageSizeChange(e) {
      this.PagerAutoGenPage = 0
      this.PagerAutoGenSize = e
      this.PagerFreshFunc()
    },
    PagerAddToParams(params){
      if(!params) {
        params = {}
      }
      params.AutoGenPage = this.PagerAutoGenPage
      params.AutoGenSize = this.PagerAutoGenSize
      return params
    },
  },
  mounted () {},
  computed: {}
}
</script>
