<template>
  <div @click="radioClick">
    <div class="self-check-box" :class="className" v-if="!ischecked"></div>
    <div class="self-check-box self-checked-box" :class="className" v-else>
      <i class="el-icon-check"></i>
    </div>
  </div>
</template>
<script>
export default {
  props: ["ischecked"],
  data() {
    return {
      className: "",
    };
  },
  created() {
    if (this.$store.state.yqInfo.platform === "mobile") {
      this.className = "mobile-check-box";
    }
  },
  methods: {
    radioClick() {
      this.$emit("radioClick");
    },
  },
};
</script>
<style lang="scss" scoped>
.self-check-box {
  width: 1vw;
  height: 1vw;
  border: var(--text-color) solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.self-checked-box {
  color: var(--choose-color);
  background-color: var(--color-5);
  border: var(--border-color) solid 1px;
}
.mobile-check-box {
  width: 14px;
  height: 14px;
}
</style>