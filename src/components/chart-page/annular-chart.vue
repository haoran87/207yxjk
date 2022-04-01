<template>
  <div style="width: 100%">
     <sub-title
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
      rateNum: 50,
      annularTitle: "",
    };
  },
  mounted() {
    if (this.mData.plugin) {
      this.getData();
      this.initDrewTimer();
    } else {
      this.drawStatus();
    }
  },
  methods: {
    drawStatus() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        title: [
          {
            text: this.annularTitle + "\n\n" + this.rateNum + "%",
            subtext: this.chartTitle,
            textStyle: {
              color: "#FEFEFE",
              fontSize: 16,
            },
            left: "center",
            top: "center",
          },
          //,{
          //   subtext: this.chartTitle,
          //   text:this.annularTitle,
          //   textStyle: {
          //     fontSize: 12,
          //   },
          //   left: "center",
          //   bottom: 8,
          // }
        ],
        angleAxis: {
          max: 100, // 满分
          clockwise: false, // 逆时针
          startAngle: 180,
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: "category",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        polar: {
          center: ["50%", "50%"],
          radius: "140%", //图形大小
        },
        series: [
          {
            type: "bar",
            data: [
              {
                name: "使用率",
                value: this.rateNum,
                itemStyle: {
                  normal: {
                    color: {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#FFCD09",
                        },
                        {
                          offset: 1,
                          color: "#E8F794",
                        },
                      ],
                    },
                  },
                },
              },
            ],

            coordinateSystem: "polar",
            roundCap: true,
            barWidth: 20,
            barGap: "-100%",
            radius: ["100%", "100%"],
            z: 2,
          },
          {
            // 灰色环
            type: "bar",
            data: [
              {
                value: 100,
                itemStyle: {
                  color: "#343434",
                },
              },
            ],

            animation: false,
            coordinateSystem: "polar",
            roundCap: true,
            barWidth: 20,
            // barGap: "-110%", // 两环重叠
            radius: ["50%", "100%"],
            z: 1,
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.resize()
    },
  },
};
</script>
<style lang="scss" scoped>
</style>