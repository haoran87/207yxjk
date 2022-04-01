<template>
  <div>
    <div class="border-angle border-top-left"></div>
    <div class="border-angle border-bottom-left"></div>
    <div class="border-angle border-bottom-right"></div>
    <div class="border-angle border-top-right"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    
  },
  mounted() {
    
  },
};
</script>
<style lang="scss" scoped>
.border-angle {
  position: absolute;
  width: 1vw;
  height: 1vw;
}
.border-top-left {
  border-top: var(--color-5) solid 3px;
  border-left: var(--color-5) solid 3px;
  top: 0;
  left: 0;
}
.border-bottom-left {
  border-bottom: var(--color-5) solid 3px;
  border-left: var(--color-5) solid 3px;
  bottom: 0;
  left: 0;
}
.border-bottom-right {
  border-bottom: var(--color-5) solid 3px;
  border-right: var(--color-5) solid 3px;
  bottom: 0;
  right: 0;
}
.border-top-right {
  border-top: var(--color-5) solid 3px;
  border-right: var(--color-5) solid 3px;
  top: 0;
  right: 0;
}
</style>
