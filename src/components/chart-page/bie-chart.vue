<template>
  <div>
    <sub-title
      v-if="showTitle"
      :titleMsg="mData.name"
      :eNum="titleSet"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div class="flex-column-center" :style="{ height: ch, width: chartWidth }">
      <div
        v-if="$store.state.yqInfo.connectedStu"
        :id="chartId"
        :style="{ height: ch, width: chartWidth }"
      ></div>
      <weijietong v-else></weijietong>
    </div>
  </div>
</template>
<script>
import { homePageMixins } from "@/utils/home-module";
export default {
  mixins: [homePageMixins],
  data() {
    return {
      roseData: [],
      chartTitle: "",
      showTitle: true,
      showChartTitle: false,
      showLegend: true,
      bieFontSize: 14,
    };
  },
  created() {
     if(this.$store.state.yqInfo.platform === 'pad'){
      this.bieFontSize = 8
    }
    if (this.mData.showTitle !== undefined) {
      this.showTitle = this.mData.showTitle;
    }
  },
  mounted() {
    if (this.mData.plugin) {
      this.showChartTitle = true;
      this.showLegend = false;
      this.getData();
      this.initDrewTimer();
    } else if (this.mData.chartData) {
      this.showChartTitle = this.mData.chartData.showChartTitle;
      this.showLegend = this.mData.chartData.showChartLegend;
      this.roseData = this.mData.chartData.roseData;
      this.chartTitle =
        this.mData.chartData.title + ":" + this.roseData[0].value + "%";
      this.bieFontSize = 24;
      this.drawStatus();
    } else {
      this.drawStatus();
    }
  },
  watch: {
    boxWidth() {
      setTimeout(() => {
        this.drawStatus();
      }, 1);
    },
  },
  methods: {
    changeModule() {
      this.$emit("changModule");
    },
    getRoseData() {
      let tem = [];
      this.roseData.forEach((el) => {
        let item = {
          value: el.value,
          name: el.name + "\n" + el.value + "%",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: el.startColor,
                },
                {
                  offset: 1,
                  color: el.endColor,
                },
              ],
              global: false,
            },
          },
        };
        tem.push(item);
      });
      return tem;
    },
    drawStatus() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        title: {
          show: this.showChartTitle,
          text: this.chartTitle,
          textStyle: {
            color: "#fff",
            fontSize:this.bieFontSize,
          },
          left: "center",
          bottom: -5,
        },
        // tooltip: {
        //     trigger: 'item',
        //     formatter: '{a} <br/>{b} : {c} ({d}%)'
        // },
        grid: {
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          containLabel: true,
        },
        legend: {
          show: this.showLegend,
          orient: "vertical",
          left: 20,
          bottom: 20,
          textStyle: {
            color: "#fff",
          },
          selectedMode: false,
          formatter: function (name) {
            return name.split("\n")[0];
          },
        },
        series: [
          {
            type: "pie",
            radius: "60%",
            hoverAnimation: false,
            animation: this.isAni,
            center: ["50%", "50%"],
            selectedMode: "single",
            data: this.getRoseData(),
            label: {
              color: "#fff",
              fontSize: this.bieFontSize,
            },
            labelLine:{
              length:5,
            }
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>