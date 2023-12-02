<template>
  <div class="___slider-input">
    <template v-if="isRange">
      <el-slider
          v-if="elementSlider"
          v-model="sliderValue"
          @input="onSliderInput"
          :min="min"
          :max="max"
          :data="sliderData"
          :step="step || 1"
          range
          :marks="marksAsFunc || marksInner" :silent="silent"
      />
      <vue-slider
          v-else
          v-model="sliderValue"
          @input="onSliderInput"
          :min="min"
          :max="max"
          :min-range="minRange"
          :max-range="maxRange"
          :contained="true"
          :data="sliderData"
          :interval="step"
          :tooltip-placement="rangeTooltip?'bottom':'top'"
          :marks="marksAsFunc || marksInner" :silent="silent">
        <template v-slot:step="{ active }">
          <div :class="['custom-step', { active }]"></div>
        </template>
        <template v-if="labelSlot" v-slot:label="{ label, active }">
          <template v-if="getMarkSlopNameByLabel(label)">
            <div :class="['vue-slider-mark-label', { active }]">
              <slot :name="getMarkSlopNameByLabel(label)"></slot>
            </div>
          </template>
          <div v-else :class="['vue-slider-mark-label', { active }]">{{ label }}</div>
        </template>
        <template v-if="rangeTooltip" v-slot:process="{ style, index }">
          <div class="vue-slider-process" :style="style">
            <div :class="[
              'merge-tooltip',
              'vue-slider-dot-tooltip-inner',
              'vue-slider-dot-tooltip-inner-top',
            ]">
              {{ value[index] }} - {{ value[index + 1] }}
            </div>
          </div>
        </template>
      </vue-slider>
      <el-input v-if="showInput" v-model="rangeInputValue" disabled></el-input>
    </template>
    <template v-else>
      <el-slider
          v-if="elementSlider"
          v-model="sliderValue"
          @input="onSliderInput"
          :min="min"
          :max="max"
          :data="sliderData"
          :step="step || 1"
          :marks="marksAsFunc || marksInner" :silent="silent"
      />
      <vue-slider v-else
                  :interval="step"
                  v-model="sliderValue" @input="onSliderInput" :min="min" :max="max" :data="sliderData"
                  :marks="marksAsFunc || marksInner" :silent="silent" :contained="true">
        <template v-slot:step="{ active }">
          <div :class="['custom-step', { active }]"></div>
        </template>
        <template v-if="labelSlot"  v-slot:label="{ label, active }">
          <template v-if="getMarkSlopNameByLabel(label)">
            <div :class="['vue-slider-mark-label', { active }]">
              <slot :name="getMarkSlopNameByLabel(label)"></slot>
            </div>
          </template>
          <div v-else :class="['vue-slider-mark-label', { active }]"><span v-html="label"></span></div>
        </template>
      </vue-slider>
      <el-input-number v-if="showInput" v-model="sliderValue" :min="min" :max="max" :step="step||1"
                       controls-position="right"/>
    </template>
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css';
import jsb from "@sandwich-go/jsb";

export default {
  name: 'AimSliderInput',
  components: {VueSlider},
  props: {
    value: {
      type: [Number, Array],
    },
    elementSlider: {
      type: Boolean,
      default: false
    },
    minRange: {
      type: Number,
      default: undefined,
    },
    maxRange: {
      type: Number,
      default: undefined,
    },
    rangeTooltip: {
      type: Boolean,
      default: false,
    },
    labelSlot: {
      type: Boolean,
      default: false,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 0,
    },
    silent: {
      type: Boolean,
      default: true
    },
    showInput: {
      type: Boolean,
      default: false
    },
    rangeFormat: {
      type: Function,
    },
    marks: {
      type: Object,
    },
  },
  data() {
    return {
      rangeInputValue: '',
      // eslint-disable-next-line vue/no-computed-properties-in-data
      rangeStart: this.isRange ? this.value[0] : this.value,
      // eslint-disable-next-line vue/no-computed-properties-in-data
      rangeEnd: this.isRange ? this.value[1] : this.value,
      sliderValue: this.value,
      marksAsFunc: null,
      marksInner:{},
    }
  },
  created() {
    if (this.isRange) {
      if (this.value[0] < this.min) {
        // eslint-disable-next-line vue/no-mutating-props
        this.value[0] = this.min
      }
      if (this.value[1] > this.max) {
        // eslint-disable-next-line vue/no-mutating-props
        this.value[1] = this.max
      }
    }
    // 拷贝数据
    for (const item in this.marks) {
      if(this.marks[item].slotName && !this.labelSlot){
        jsb.cc.toastWarning("SliderInput: 检测到marks含 slotName 字段,但为开启label-slot支持.")
      }
      this.marksInner[item] =this.marks[item]
    }
    if(!this.elementSlider) {
      if (this.step && this.step > 1) {
        const _this = this
        this.marksAsFunc = function (val) {
          for (const item in _this.marksInner) {
            if (String(val) === String(item)) {
              return {label: _this.marksInner[item]}
            }
          }
          return false
        }
      }else{
        // 剔除多余的marks
        let marksNew = {}
        for (const item in this.marksInner) {
          let valid = true
          if(this.max!==undefined && Number(item) > Number(this.max)){
            valid = false
          }
          if(this.min!==undefined && Number(item) < Number(this.min)){
            valid = false
          }
          if(valid){
            marksNew[item] = this.marksInner[item]
          }
        }
        this.marksInner = marksNew
      }
    }
  },
  computed: {
    isRange: function () {
      return Array.isArray(this.value)
    },
    sliderData: function () {
      if(this.elementSlider){
        return undefined
      }
      if (!(this.step && this.step > 1)) {
        return undefined
      }
      let result = [];
      result.push(this.min);
      for (let now = this.min; now < this.max; now += this.step) {
        result.push(now);
      }
      result.push(this.max);
      const uniqueValues = new Set(result);
      return [...uniqueValues];
    }
  },
  watch: {
    value: {
      handler: function (val) {
        this.rangeStart = this.isRange ? val[0] : val
        this.rangeEnd = this.isRange ? val[1] : val
        if (this.rangeFormat) {
          this.rangeInputValue = this.rangeFormat(this.rangeStart, this.rangeEnd)
        } else {
          this.rangeInputValue = this.isRange ? `${this.rangeStart} ~ ${this.rangeEnd}` : val
        }
        this.sliderValue = val
      },
      immediate: true
    },
    sliderValue(val) {
      this.$emit('input', val)
    },
  },
  methods: {
    getMarkSlopNameByLabel(label){
      for (const item in this.marks) {
        if(this.marks[item] === label){
          return null
        }
        if(this.marks[item].label === label){
          return this.marks[item].slotName
        }
      }
      return null
    },
    onSliderInput(val) {
      if(this.isRange && this.elementSlider){
        let changeIndex = Number(val[0])===Number(this.value[0])?1:0
        if(this.minRange && val[1]-val[0]<this.minRange){
          if(changeIndex ===0){
            val[1] = val[0]+this.minRange
          }else{
            val[0] = val[1]-this.minRange
          }
        }
        if(this.maxRange && val[1]-val[0]>this.maxRange){
          if(changeIndex ===0){
            val[1] = val[0]+this.maxRange
          }else{
            val[0] = val[1]-this.maxRange
          }
        }
      }
      this.sliderValue = val
    },
  },
}
</script>

<!--https://github.com/NightCatSama/vue-slider-component/issues/11-->
<style lang="scss">
.___slider-input {
  display: flex;
  align-items: center;
  width: 100%;
}

.___slider-input .el-slider{
  flex: 1;
  margin-right: 20px;
}

.___slider-input .vue-slider {
  flex: 1;
  margin-right: 20px;
}

.___slider-input .el-input-number {
  width: 120px;
}

.___slider-input .el-input {
  width: 120px;
}

.___slider-input .el-input{
  ::v-deep .input {
    text-align: center
  }
}

.___slider-input .merge-tooltip {
  position: absolute;
  left: 50%;
  bottom: 100%;
  transform: translate(-50%, -15px);
}

.___slider-input .vue-slider-process {
  background-color: #3498db !important;
}

.___slider-input .custom-step {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #ccc;
  background-color: #fff;
}

.___slider-input .custom-step.active {
  box-shadow: 0 0 0 1px #3498db;
  background-color: #3498db;
}
</style>
