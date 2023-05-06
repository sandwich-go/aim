// 通过传递函数的方式共享table基础状态
import MixinState from "@/components/AimTable/mixins/MixinState.vue";
import jsb from "@sandwich-go/jsb";

export const CreateMixinState = () => {
    return jsb.clone(MixinState)
}