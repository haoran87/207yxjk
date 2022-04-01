<template>
  <m-dropdown-menu>
    <m-dropdown-item v-model="value" :options="option" @change="dropdownChange">
      <template v-slot:title>
        <div class="flex flex-between m-menu-title">
          <span>{{ dropdownStr }}</span>
          <m-icon name="arrow-down" />
        </div>
      </template>
    </m-dropdown-item>
  </m-dropdown-menu>
</template>

<script>
export default {
  props: {
    option: {
      default: () => [{ text: "请选择", value: "" }],
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      value: "",
    };
  },
  computed: {
    dropdownStr() {
      return this.option.find((el) => el.value === this.value).text;
    },
  },
  created() {},
  mounted() {},
  methods: {
    dropdownChange(e) {
      this.$emit("change", e);
    },
  },
};
</script>

<style lang="scss" scoped>
 
</style>