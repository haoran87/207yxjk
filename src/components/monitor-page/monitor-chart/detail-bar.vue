<template>
  <div>
    <div :id="chartId" :style="styleObj"></div>
  </div>
</template>
<script>
export default {
  props: ["chartId", "barData", "unit"],
  data() {
    return {
      list: [],
      styleObj:{
        width: '100%',
         height: '5vw'
      }
    };
  },
  created() {
    if(this.$store.state.yqInfo.platform === "mobile"){
      this.styleObj.height = "60px"
    }
    this.list = this.barData;
  },
  watch: {
    barData(newb) {
      this.list = newb;
      this.drawBar();
    },
  },
  mounted() {
    this.drawBar();
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
          trigger: "item",
          formatter: (value) => {
            return value.data + this.unit;
          },
        },
        xAxis: {
          show: false,
          type: "category",
          // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          show: false,
          type: "value",
        },
        series: [
          {
            itemStyle: {
              color: "#B7A077",
            },
            animation: false,
            data: this.list,
            type: "bar",
          },
        ],
      };
      option && myChart.setOption(option, true);
      myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>