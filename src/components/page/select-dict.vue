<template>
  <tis-select
    :value="value"
    style="width: 100%"
    :placeholder="placeholder"
    @change="change"
    :clearable='false'
    filterable
    :disabled="disabled"
  >
    <tis-option
      v-for="item in dicts"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    >
    </tis-option>
  </tis-select>
</template>
<script>
export default {
  props: {
    type: { type: String, required: true },
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, default: false },
  },
  model: { event: "selected", prop: "value" },
  data() {
    return { dicts: [] };
  },
  methods: {
    change(v) {
      this.$emit("selected", v);
    },
  },
  mounted() {
    if (this.type) {
      this.$api
        .getServerAction("/insight/dictItem/getDictItemList", {
          value: this.type,
        })
        .then((dict) => {
          this.dicts = dict.data;
        });
    }
  },
};
</script>
