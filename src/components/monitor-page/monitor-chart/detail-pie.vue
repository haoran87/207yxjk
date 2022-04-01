<template>
  <div>
    <div :id="pieId" style="width: 180px; height: 80px"></div>
  </div>
</template>
<script>
export default {
  props: ["pieId",'pieData'],
  data() {
    return {};
  },
  mounted() {
      this.drawPie()
  },
  methods: {
    drawPie() {
      var chartDom = document.getElementById(this.pieId);
      var myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          right: "0",
          bottom: "0",
          itemWidth: 6,
          itemHeight: 6,
          textStyle: {
            color: "#fff",
            fontSize:10,
          },
          // width:5,
          // height:5
        },
        series: [
          {
            name: "内存使用率",
            type: "pie",
            radius: "90%",
            hoverAnimation: false,
            left: 0,
            data:this.pieData,
            label: {
              show: true,
              position: "inside",
              formatter: "{c}",
            },
            labelLine: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      option && myChart.setOption(option);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>