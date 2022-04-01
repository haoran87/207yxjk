<template>
  <div>
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
      roseColors: [
        {
          startColor: "#F9E10C",
          endColor: "#E6AB13",
        },
        {
          startColor: "#CEDD3D",
          endColor: "#5DC656",
        },
        {
          startColor: "#F18943",
          endColor: "#DDA428",
        },
      ],
      roseData: [
        {
          name: "正常",
          value: 45,
        },
        {
          name: "一般警告",
          value: 35,
        },
        {
          name: "严重警告",
          value: 20,
        },
      ],
      chartTitle: "",
      fontSize:14,
      legendFont:10,
    };
  },
  created() {
      if (this.$store.state.yqInfo.platform === "pad") {
      this.fontSize = 8;
    }
  },
  mounted() {
    if (this.mData.plugin) {
      this.getData();
    } else if (this.mData.id == "zhuangtaizonglan") {
      this.getData();
    } else {
      this.drawRose();
    }
  },
  methods: {
    setRoseColor() {
      this.roseData.forEach((el, idx) => {
        let colorObj = this.roseColors[idx % this.roseColors.length];
        Object.assign(el, colorObj);
      });
    },
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
    drawRose() {
      this.setRoseColor();
      var chartDom = document.getElementById(this.chartId);
      if (chartDom) {
        var option;
        option = {
          backgroundColor: "",
          // tooltip: {
          //   trigger: "item",
          // },
          title: {
            show: this.mData.plugin,
            text: this.chartTitle,
            textStyle: {
              color: "#fff",
              fontSize: 18,
            },
            left: "center",
            bottom: "3%",
          },
          legend: {
            //&& this.$store.state.yqInfo.platform==='pc'
            show: !this.mData.plugin && this.$store.state.yqInfo.platform==='pc',
            orient: "vertical",
            left: 20,
            bottom: 20,
            textStyle: {
              color: "#fff",
              fontSize:  this.legendFont,
            },
            selectedMode: false,
            itemGap: 3,
            itemWidth: 12,
            itemHeight:6,
            formatter: function (name) {
              return name.split("\n")[0];
            },
          },
          calculable: true,
          series: [
            {
              name: "访问来源",
              type: "pie",
              radius: "60%",
              center: ["50%", "50%"],
              hoverAnimation: false,
              data: this.getRoseData().sort(function (a, b) {
                return a.value - b.value;
              }),
              // color: ["blue", "red", "yellow"],
              roseType: "area",
              label: {
                color: "#fff",
                fontSize:  this.fontSize,
              },

              animationType: "expansion",
              animationDelay: function () {
                return Math.random() * 200;
              },
            },
          ],
        };
        var myChart = this.$echarts.init(chartDom);
        option && myChart.setOption(option);
        myChart.resize();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>