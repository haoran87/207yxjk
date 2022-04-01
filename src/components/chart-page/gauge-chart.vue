<template>
  <div style="width: 100%">
    <!-- <div :style="{height:titleH}"></div> -->
    <sub-title
      v-if="showTitle"
      :eNum="titleSet"
      :titleMsg="mData.name"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="flex-column-center"
      :style="{ height: ch, width: chartWidth }"
      x
    >
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
      healthDegree: "",
      gaugeTitle: "",
      showTitle: true,
      scoreSize: 24,
      textSize: 24,
      colorArr: [
        [0.3, "#FFED72"],
        [0.7, "#FED92B"],
        [1, "#FFBC14"],
      ],
    };
  },
  created() {
    if (this.mData.showTitle !== undefined) {
      this.showTitle = this.mData.showTitle;
    }
  },
  mounted() {
    if (this.mData.plugin) {
      this.getData();
      this.initDrewTimer();
    } else if (this.mData.chartData) {
      console.log("chardata啊啊啊", this.mData.chartData);

      this.healthDegree = this.mData.chartData.value;
      this.gaugeTitle = this.mData.chartData.title;
      this.colorArr = this.mData.chartData.colorArr;
      this.drawStatus();
    } else {
      this.getData();
      this.initDrewTimer();
      this.gaugeTitle = "健康度";
    }
  },
  methods: {
    drawStatus() {
      let option = {
        backgroundColor: this.mData.chartBg || "",
        grid: {
          // top: "24%",
        },
        textStyle: {},
        series: [
          {
            name: "外层盘",
            type: "gauge",
            center: ["50%", "72%"], // 默认全局居中
            radius: 115, //no
            splitNumber: 4, //刻度数量
            min: 100,
            max: 100,
            startAngle: 177,
            endAngle: 3,
            axisLine: {
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [
                  [0.8, "rgba(208, 219, 237,0.8)"],
                  [1, "rgba(208, 219, 237,0.8)"],
                ],
                width: 1,
                opacity: 0,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            data: [
              {
                show: false,
                value: this.healthDegree,
              },
            ],
            detail: {
              show: this.healthDegree || this.healthDegree === 0,
              valueAnimation: true,
              formatter: () => {
                if (this.mData.plugin) {
                  return (
                    this.gaugeTitle +
                    "：" +
                    this.healthDegree +
                    " % \n\n" +
                    this.chartTitle
                  );
                } else if (this.mData.chartData) {
                  return (
                    this.gaugeTitle +
                    "：" +
                    this.healthDegree +
                    this.mData.chartData.unit
                  );
                } else {
                  return this.gaugeTitle + "：" + this.healthDegree + "分";
                }
              },
              color: "#FFFFFF",
              fontSize: this.textSize,
            },
          },
          {
            name: this.gaugeTitle,
            type: "gauge",
            center: ["50%", "50%"], // 默认全局居中
            // radius:"100%",
            axisLine: {
              lineStyle: {
                width: 20,
                color: this.colorArr,
              },
            },
            pointer: {
              length: "60%",
              width: 4,
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              distance: -10,
              length: 8,
              lineStyle: {
                color: "#4F3F0F",
                // width: 2,
              },
            },
            splitLine: {
              distance: -10,
              length: 20,
              lineStyle: {
                color: "#4F3F0F",
                // width: 4,
              },
            },
            axisLabel: {
              color: "#fff",
              distance: 5,
              fontSize: 12,
            },
            title: {
              show: true,
            },
            detail: {
              show: this.healthDegree || this.healthDegree === 0,
              valueAnimation: true,
              formatter: () => {
                if (this.mData.plugin) {
                  return this.healthDegree + "%";
                } else if (this.mData.chartData) {
                  return this.healthDegree + this.mData.chartData.unit;
                } else {
                  return this.healthDegree + "分";
                }
              },
              color: "auto",
              fontSize: this.scoreSize,
            },
            data: [
              {
                value: this.healthDegree,
              },
            ],
          },
        ],
      };
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom, "dark");
      option && myChart.setOption(option);
      myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>