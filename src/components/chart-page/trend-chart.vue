<template>
  <div >
    <sub-title
      :titleMsg="mData.name"
      :eNum="titleSet"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="flex-column-center"
      :style="{ height: ch, width: chartWidth }"
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
import { getFomateDate } from "@/utils/util";
import { homePageMixins } from "@/utils/home-module";
export default {
  mixins: [homePageMixins],
  data() {
    return {
      trendWidth: 0,
      xData: [],
      values: [],
      dataTimer: null,
      isAni: true,
      trendFont:12,
    };
  },
  created() {
    if (this.$store.state.yqInfo.platform === "pad") {
      this.trendFont = 8;
    }
  },
  mounted() {
    this.getData();
    this.initDrewTimer();
  },
  watch: {
    boxWidth() {
      setTimeout(() => {
        this.drawTrend();
      }, 1);
    },
  },
  methods: {
    initXData() {
      for (let i = 1; i < 8; i++) {
        this.xData.push(getFomateDate(i, "before"));
      }
    },
    getMarkData() {
      this.markData = [];
      if (this.xData.length >= 3) {
        for (let i = 0; i < this.xData.length; i += 2) {
          if (this.xData[i + 1] && this.xData[i + 2]) {
            let tem = [
              { name: "", xAxis: this.xData[i + 1].replace(" ", "\n") },
              { xAxis: this.xData[i + 2].replace(" ", "\n") },
            ];
            this.markData.push(tem);
          } else {
            break;
          }
        }
      }
      return this.markData;
    },
    drawTrend() {
      var mjBoxOption = {
        backgroundColor: "",
        // legend: {
        //   data: ["CPU"],
        //   icon: "circle",
        //   selectedMode: false,
        //   top: 22,
        //   right: 24,
        //   itemGap: 15,
        //   itemWidth: 10,
        //   itemHeight: 10,
        //   textStyle: {
        //     color: "rgba(240 ,240,240,0.87)",
        //   },
        // },
        color: ["#B5B5B4"],
        grid: {
          left: 8,
          right: 32,
          bottom: 8,
          top: "18%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          axisLine: {
            show: true,
            lineStyle: {
              color: "#D6D6D6",
              width: 3,
            },
          },
          axisTick: {
            length: 0,
          },
          axisLabel: {
            interval: 0,
            textStyle: {
              color: "#D5D5D4",
              fontSize: this.trendFont,
            },
          },
          name: "",
          nameTextStyle: {
            padding: [24, 0, 0, 0],
            color: "#00c5d7",
          },
          nameGap: 0,
          boundaryGap: false,
          data: this.xData.map(function (str) {
            return str.replace(" ", "\n");
          }),
        },
        yAxis: {
          type: "value",
          name: "(%)",
          nameTextStyle: {
            color: "#fff",
            fontSize:this.trendFont,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            length: 0, // 刻度线的长度
          },
          splitLine: {
            lineStyle: {
              color: ["#322F2E"],
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#a3a4b2",
              fontSize:this.trendFont,
            },
          },
        },
        series: [
          {
            name: this.mData.name,
            type: "line",
            smooth: false,
            animation: this.isAni,
            symbol: "circle", // 拐点类型
            symbolSize: 5, // 拐点圆的大小
            itemStyle: {
              normal: {
                color: "#B5B5B4", // 折线条的颜色
                borderColor: "#C4C1B9", // 拐点边框颜色
                areaStyle: {
                  type: "default",
                  opacity: 0.5,
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#fff", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "#181612", // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
              },
            },
            data: this.values,
            markArea: {
              itemStyle: {
                color: "rgba(33, 32, 31, 0.5)",
              },
              data: this.getMarkData(),
            },
          },
        ],
      };
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom, "dark");
      myChart.setOption(mjBoxOption);
      myChart.resize()
    },
  },
};
</script>
<style lang="scss" scoped>
</style>