<template>
  <div :style="styleObj">
    <div :id="chartId" style="width: 100%; height: 100%"></div>
  </div>
</template>
<script>
export default {
  props: ["chartId", "guageValue", "unit"],
  data() {
    return {
      chartFont:14,
      styleObj:{
        width: '100%', 
        height: '8vw'
      }
    };
  },
  created() {
    if(this.$platform.type === 'pad'){
      this.chartFont = 8
    }
    if(this.$store.state.yqInfo.platform === "mobile"){
      this.styleObj.height = "100px"
      this.chartFont = 10
    }
    this.barData = [0.2, 0.3, 0.4, 0.1, 0.5];
  },
  mounted() {
    this.drawBar();
  },
  watch:{
      guageValue(){
         this.drawBar()
      }
  },
  methods: {
    drawBar() {
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        grid: {
          left: 8,
          right: 8,
          bottom: 8,
          top: 0,
        },
        tooltip: {
          formatter: "{c}%",
        },
        series: [
          {
            name: "detailbar",
            type: "gauge",
            radius: "100%",
            axisLine: {
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, "#95B575"]],
                width: 3,
                opacity: 1,
              },
            },
            splitLine: {
              distance: -10,
              length: 5,
              lineStyle: {
                color: "#4F3F0F",
                // width: 4,
              },
            },
             axisLabel: {
              fontSize: this.chartFont,
            },
            pointer: {
              length: "60%",
              width: 4,
              itemStyle: {
                color: "auto",
                
              },
            },
            data: [
              {
                show: false,
                value: this.guageValue,
                
              },
            ],
            detail: {
              valueAnimation: true,
              formatter: () => {
                return this.guageValue + this.unit;
              },
              fontSize: this.chartFont,
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