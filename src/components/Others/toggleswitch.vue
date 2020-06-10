<template>
  <label role="checkbox" :class="['switch', { toggled }]">
    <input type="checkbox" class="switch-input" @change="toggle" />
    <div
      class="switch-core"
      :style="{ backgroundColor: toggled ? colorChecked : colorUnchecked }"
    >
      <div
        class="switch-button"
        :style="{
          transition: `transform ${speed}ms`,
          transform: toggled ? null : `translate3d(32px, 0px, 0px)`
        }"
      ></div>
    </div>
    <span class="switch-label label-right" v-if="toggled" v-html="labelChecked">
    </span>
    <span class="switch-label label-left" v-html="labelUnchecked" v-else>
    </span>
  </label>
</template>
 
<script>
export default {
  name: "ToggleSwitch",
  data() {
    return {
      toggled: this.value
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 100
    },
    labelChecked: {
      type: String,
      default: "启用"
    },
    labelUnchecked: {
      type: String,
      default: "停用"
    },
    colorChecked: {
      type: String,
      default: "#11CED2"
    },
    colorUnchecked: {
      type: String,
      default: "#E6EAF1"
    }
  },
  watch: {
    value: function(val) {
      this.value = val;
    }
  },
  methods: {
    toggle(event) {
      this.toggled = !this.toggled;
      this.$emit("update:value", this.toggled);
      this.$emit("change", event);
    }
  }
};
</script>
 
<style lang="scss" scoped>
.switch {
  display: inline-block;
  position: relative;
  overflow: hidden;
  vertical-align: middle;
  user-select: none;
  font-size: 10px;
  cursor: pointer;
 
  .switch-input {
    display: none;
  }
 
  .switch-label {
    position: absolute;
    top: 0;
    font-weight: 600;
    color: white;
 
    z-index: 2;
 
    &.label-left {
      left: 10px;
      line-height: 20px;
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
      color: #b5bdc8;
    }
 
    &.label-right {
      right: 10px;
      line-height: 20px;
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }
  }
 
  .switch-core {
    display: block;
    position: relative;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    transition: border-color 0.3s, background-color 0.3s;
    user-select: none;
    width: 46px;
    height: 20px;
    border-radius: 4px;
    line-height: 20px;
 
    .switch-button {
      width: 8px;
      height: 16px;
      display: block;
      position: absolute;
      overflow: hidden;
      top: 2;
      left: 2;
      z-index: 3;
      transform: translate3d(0, 0, 0);
      background-color: rgba(255, 255, 255, 1);
      border-radius: 4px;
      margin-top: 2px;
      margin-left: 2px;
    }
  }
}
</style>
