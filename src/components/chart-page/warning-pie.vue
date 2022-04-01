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
      colors: [
        "#D93637",
        "#EB7A2E",
        "#FEB546",
        "#FFE143",
        "#BFFD44",
        "#44FF78",
        "#44FDF8",
        "#44BEFF",
        "#5988FD",
        "#8270D2",
      ],
    };
  },
  created() {
    if (this.$store.state.yqInfo.platform === "pad") {
      this.bieFontSize = 8;
    }
    if (this.mData.showTitle !== undefined) {
      this.showTitle = this.mData.showTitle;
    }
  },
  mounted() {
    if (this.mData.id == "zhuangtaizonglan") {
      this.getData();
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
      this.roseData.forEach((el, idx) => {
        let cidx = idx % this.colors.length;
        let item = {
          value: el.value,
          name: el.name + "\r\r" + el.value + "%",
          itemStyle:{
            color: this.colors[cidx],
          }
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
          show: false,
          text: this.chartTitle,
          textStyle: {
            color: "#fff",
            fontSize: this.bieFontSize,
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
          show: false,
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
            center: ["50%", "60%"],
            selectedMode: "single",
            data: this.getRoseData(),
            label: {
              color: "#fff",
              fontSize: this.$platform.type==='pad'? 10:12,
            },
            labelLine: {
              length: 5,
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