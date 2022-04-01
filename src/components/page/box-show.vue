<template>
  <div class="box" :style="boxStyle">
    <slot></slot>
    <border-angle></border-angle>
  </div>
</template>
<script>
import borderAngle from "../page/border-angle.vue";
export default {
  props:["boxStyle"],
  components: {
    borderAngle,
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  background-color: var(--footer-background-color);
  border: var(--status-bar-tools-border);

}
</style>