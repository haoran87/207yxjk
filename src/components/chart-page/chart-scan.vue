<template>
  <div style="dispaly: relative">
    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
		<div style="height: 16px;"></div>
      <tis-row type="flex">
        <tis-col :span="6" style="margin-right: 16px"> </tis-col>
        <tis-col :span="12" style="margin-right: 16px">
          <div class="home-left-item module-bg">
            <component :is="sanModule" :mData="chartInfo"  :chartWidth="'100%'"
                  :chartHeight="'328px'"></component>
          </div>
        </tis-col>
        <tis-col :span="6" style="margin-right: 16px"> </tis-col>
      </tis-row>
    </box-show>
    <div class="back-btn" @click="goList">
      <icon :name="'back'" :size="24"></icon>
    </div>
  </div>
</template>
<script>
export default {
  props: ["chartInfo"],
  data() {
    return {
      sanModule: null,
    };
  },
  created() {
    // console.log("预览的图表信息", this.chartInfo);
    this.initModule();
  },
  mounted() {},
  methods: {
    goList() {
      this.$emit("hideScan");
    },
    initModule() {
      let type = this.chartInfo.type
      this.sanModule = () =>
        import(
          "@/components" +
            this.$store.state.yqInfo.chartPath[type]
        );
    },
  },
};
</script>
<style lang="scss" scoped>
.home-left-item {
  width: 100%;
  height: 284px;
  margin-bottom: 16px;
}
.back-btn {
  position: absolute;
  right: 32px;
  top: 16px;
}
</style>