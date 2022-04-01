<template>
  <div>
    <sub-title
      :eNum="titleSet"
      :titleMsg="mData.name"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div class="flex-column-center" :style="{ height: ch, width: chartWidth }">
      <div
        v-if="$store.state.yqInfo.connectedStu"
        :style="{ height: ch, width: chartWidth }"
        :id="chartId"
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
        barFont:14,
      },
    };
  },
  created() {
     if (this.$store.state.yqInfo.platform === "pad") {
      this.barFont = 8;
    }
  },
  mounted() {
    this.getData();
    this.initDrewTimer();
  },
  methods: {
    drawBar() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        grid: {
          left: 16,
          right: 16,
          bottom: 0,
          top: "20%",
          containLabel: true,
        },
        // tooltip: {
        //   trigger: "axis",
        //   formatter: function (value) {
        //     return value[0].name + "\r\r\r" + value[0].value + "%";
        //   },
        // },
        xAxis: {
          show: true,
          type: "category",

          axisLine: {
            show: false,
          },
          axisTick: {
            //y轴刻度线
            show: false,
          },
          axisLabel: {
            color: "#fff",
            fontSize: this.barFont,
            formatter: function (value) {
              return value.replace(" ", "\n");
            },
          },
          data: this.barData.yAxisData,
        },
        yAxis: [
          {
            type: "value",
            name: "(%)",
            nameTextStyle: {
              color: "#fff",
            },
            axisLabel: {
              color: "#fff",
              fontSize: this.barFont,
            },
          },
        ],
        series: [
          {
            data: this.barData.data,
            type: "bar",
            animation: this.isAni,
            barWidth: "50%",
            showBackground: true,
            backgroundStyle: {
              color: "#22211f",
              //   barBorderRadius: [50, 50, 50, 50],
            },
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#fffee3" },
                  { offset: 1, color: "#ffcd09" },
                ]),
                label: {
                  show: true,
                  position: "top",
                  color: "#fff",
                  fontSize: this.barFont,
                  formatter: (obj) => {
                    return obj.value + "%";
                  },
                },
                // barBorderRadius: [50, 50, 50, 50],
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