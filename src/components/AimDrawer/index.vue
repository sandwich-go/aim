<template>
  <aim-popup
      :drawer="true"
      :config="config"
      :is-show.sync="isShowDraw"
  >
    <slot name="aim-popup-body">
      <slot name="aim-drawer-body"></slot>
    </slot>
    <slot name="aim-popup-body">
      <slot name="aim-drawer-footer"></slot>
    </slot>
  </aim-popup>
</template>
<script>
import AimPopup from "@/components/AimPopup/index.vue";

export default {
  name: 'AimDrawer',
  components: {AimPopup},
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    config: Object,
  },
  data() {
    return {
      isShowDraw: this.isShow,
    }
  },
  watch: {
    isShow(value) {
      this.isShowDraw = value
    }
  },
}
</script>
