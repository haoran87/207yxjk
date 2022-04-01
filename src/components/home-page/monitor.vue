<template>
  <div>
      <sub-title
      :titleMsg="titleMsg"
      :eNum="1"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="flex-column-center"
      v-if="$store.state.yqInfo.connectedStu"
      :style="{ height: ch, width: chartWidth }"
    >
      <div class="monitor-item">
        <div style="16px"></div>
        <div class="monitor-item-label">CPU使用率：<span class="rateNum">{{ cpuNum.toFixed(2) }}%</span></div>
        <div class="monitor-item-right">
          <circle-charts
            :idName="moduleKey+'_'+cpuCircle"
            ref="cpuCircle"
            :circleHeight="circleHeight"
          ></circle-charts>
        </div>
         <div style="16px"></div>
      </div>
      <div class="monitor-item">
        <div style="16px"></div>
        <div class="monitor-item-label">内存使用率：<span class="rateNum">{{ ramNum.toFixed(2) }}%</span></div>
        <div class="monitor-item-right">
          <circle-charts
            :idName="moduleKey+'_'+ramCircle"
            ref="ramCircle"
            :circleHeight="circleHeight"
          ></circle-charts>
        </div>
         <div style="16px"></div>
      </div>
    </div>
    <div
      class="flex-column-center"
      v-else
      :style="{ height: ch, width: chartWidth }"
    >
      <weijietong></weijietong>
    </div>
  
  </div>
</template>
<script>
import CircleCharts from "./circle-charts.vue";
import { homePageMixins } from "@/utils/home-module";
export default {
  components: {
    CircleCharts,
  },
  mixins: [homePageMixins],
  data() {
    return {
      titleMsg: "监控总览",
      cpuNum: 0,
      ramNum: 0,
      cpuCircle: "cpuCircle",
      ramCircle: "ramCircle",
      circleHeight: "120px",
    };
  },
  created() {
    this.getMoniterHeight();
    this.getCPURate();
    this.getRAMRate();
    this.initDrewTimer();
  },
  mounted() {},
  methods: {
  getMoniterHeight(){
       this.circleHeight =  (parseFloat(this.chartHeight) - 38) / 2 - 8 + 'px';
    },
    getCPURate() {
      let path = "/insight/telegraf/getAverageCpuRate";
      this.$api
        .getServerAction(path, { ip: this.$store.state.yqInfo.chooseIP })
        .then((res) => {
          if (res.code == 200) {
            this.cpuNum = res.data;
          } else {
            this.cpuNum = 0;
          }
          this.$refs.cpuCircle.rateNum = this.cpuNum;
          this.$refs.cpuCircle.drawCircle();
        });
    },
    getRAMRate() {
      let path = "/insight/telegraf/getMemUsedRate";
      this.$api
        .getServerAction(path, { ip: this.$store.state.yqInfo.chooseIP })
        .then((res) => {
          if (res.code == 200) {
            this.ramNum = res.data;
          } else {
            this.ramNum = 0;
          }
          this.$refs.ramCircle.rateNum = this.ramNum;
          this.$refs.ramCircle.drawCircle();
        });
    },
    getAll() {
      let path = "/insight/telegraf/getAllCpuRate";
      this.$api
        .getServerAction(path, { ip: this.$store.state.yqInfo.chooseIP })
        .then((res) => {
          if (res.code == 200) {
            console.log("thisaaaaaa", res.data);
          } else {
            this.cpuNum = 0;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.monitor-item {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  /* margin:16px 0; */
}
.monitor-item-label {
  font-size: var(--tab-title-size);
  text-align: left;
}
.rateNum{
   font-size: var(--app-title-size);
}
</style>