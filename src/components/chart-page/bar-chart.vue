<template>
  <div>
    <sub-title
      :eNum="titleSet"
      :titleMsg="moduleTitle"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="bar-box flex-column-center"
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
import { homePageMixins } from "@/utils/home-module";
export default {
  mixins: [homePageMixins],
  data() {
    return {
      barData: {
        data: [],
        color: "#FFCC09",
        yAxisData: [],
      },
      jccpusyl: {
        startColor: "#ffcd09",
        endColor: "#fffee3",
      },
      jcncsyl: {
        startColor: "#F99142",
        endColor: "#fffee3",
      },
      rjcpusyl: {
        startColor: "#6AD35A",
        endColor: "#fffee3",
      },
      rjncsyl: {
        startColor: "#FF8282",
        endColor: "#fffee3",
      },
      moduleTitle: "",
      fontSize: 14,
    };
  },
  created() {
    if (this.$store.state.yqInfo.platform === "pad") {
      this.fontSize = 8;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    drawBar() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        grid: {
          left: 16,
          right: 32,
          bottom: -12,
          top: 8,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (value) {
            return value[0].name + "\r\r\r" + value[0].value + "%";
          },
        },
        xAxis: {
          show: false,
          type: "value",
          // max: 100,
          axisLabel: {
            color: "#fff",
          },
        },
        yAxis: [
          {
            type: "category",
            axisLabel: {
              color: "#fff",
              fontSize: this.fontSize,
              formatter: function (value) {
                if (value.length > 8) {
                  return value.substring(0, 8) + "...";
                } else {
                  return value;
                }
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            data: this.barData.yAxisData,
          },
          {
            type: "category",
            position: "right",
            axisLabel: {
              color: "#fff",
              fontSize: this.fontSize,
              formatter: function (value) {
                return value + "%";
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              //y轴刻度线
              show: false,
            },
            data: this.barData.data,
          },
        ],
        series: [
          {
            data: this.barData.data,
            type: "bar",
            animation: true,
            barWidth: "70%",
            showBackground: true,
            backgroundStyle: {
              color: "#22211f",
              barBorderRadius: [50, 50, 50, 50],
            },
            itemStyle: {
              normal: {
                color: {
                  colorStops: [
                    {
                      offset: 0,
                      color: this[this.mData.id].startColor,
                    },
                    {
                      offset: 1,
                      color: this[this.mData.id].endColor,
                    },
                  ],
                },
                label: {
                  show: false,
                  position: "right",
                  color: "#fff",
                  formatter: (obj) => {
                    return obj.value + "%";
                  },
                },
                barBorderRadius: [50, 50, 50, 50],
              },
            },
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