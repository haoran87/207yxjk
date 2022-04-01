<template>
  <div>
    <device-list
      ref="deviceList"
    ></device-list>
  </div>
</template>
<script>
import deviceList from "./monitor-components/device-list.vue";
export default {
  components: { deviceList},
  data() {
    return {
      pluginList: [],
      pageData:null,
    };
  },
  created() {
    this.pageData = this.$pageData();
  },
  mounted() {},
  methods: {

  },
};
</script>
<style lang="scss" scoped>

</style>