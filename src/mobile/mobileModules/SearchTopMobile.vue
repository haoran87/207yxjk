<template>
  <div class="page-top flex align-center">
    <div class="search-left">
      <slot name="left"></slot>
    </div>
    <div class="search-box">
      <m-search
        v-model="serviceName"
        background="var(--footer-background-color)"
        :placeholder="placeholder"
        @blur="search"
        @clear="clear"
        @input="input"
      />
    </div>
    <div class="search-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入",
      required: false,
    },
  },
  data() {
    return {
      serviceName: "",
    };
  },
  created() {},
  mounted() {},
  methods: {
    search() {
      this.$emit("search");
    },
    clear() {
      this.$emit("clear");
    },
    input() {
      this.$emit("input", this.serviceName);
    },
  },
};
</script>

<style lang="scss" scoped>
.page-top {
  margin:0 8px;
  .search-box {
    width: 30%;
  }
}
</style>