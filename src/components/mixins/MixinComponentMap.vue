<script>
import RowSlotTag from "@/components/CgTable/components/RowSlotTag.vue";
import RowSlotIcon from "@/components/CgTable/components/RowSlotIcon.vue";
import RowSlotIconTrueFalse from "@/components/CgTable/components/RowSlotIconTrueFalse.vue";
import SlotOptions from "@/components/CgTable/components/SlotOptions.vue";
import SlotAlert from "@/components/CgTable/components/SlotAlert.vue";
import SlotCheckbox from "@/components/CgTable/components/SlotCheckbox.vue";
import SlotButton from "@/components/CgTable/components/SlotButton.vue";
import SlotInput from "@/components/CgTable/components/SlotInput.vue";
import SlotSelectGroup from "@/components/CgTable/components/SlotSelectGroup.vue";
import SlotDateTimeRange from "@/components/CgTable/components/SlotDateTimeRange.vue";
import SlotPager from "@/components/CgTable/components/SlotPager.vue";

export default {
  name: 'MixinComponentMap',
  data() {
    return {
      registeredComponentMap: {},
    }
  },
  created() {
    this.registerComponent(RowSlotTag.name, RowSlotTag)
    this.registerComponent(RowSlotIcon.name, RowSlotIcon)
    this.registerComponent(RowSlotIconTrueFalse.name, RowSlotIconTrueFalse)

    this.registerComponent(SlotOptions.name, SlotOptions)
    this.registerComponent(SlotAlert.name, SlotAlert)
    this.registerComponent(SlotButton.name, SlotButton)
    this.registerComponent(SlotCheckbox.name, SlotCheckbox)
    this.registerComponent(SlotDateTimeRange.name, SlotDateTimeRange)
    this.registerComponent(SlotInput.name, SlotInput)
    this.registerComponent(SlotSelectGroup.name, SlotSelectGroup)
    this.registerComponent(SlotPager.name, SlotPager)
  },
  methods: {
    registerComponent(name,component){
      this.registeredComponentMap[name]=component
    }
  },
  mounted () {},
  computed: {}
}
</script>
