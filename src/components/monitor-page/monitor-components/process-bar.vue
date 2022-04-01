<template>
  <div>
    <div class="line-bar" :id="barData.id"></div>
  </div>
</template>
<script>
export default {
  props: ["barData", "perData"],
  data() {
    return {};
  },
  mounted() {},
  watch: {
    perData() {
      console.log("监听到数据变化");
      this.drawBar();
    },
  },
  methods: {
    drawBar() {
      var chartDom = document.getElementById(this.barData.id);
      var myChart = this.$echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: this.barData.title,
          left: "center",
          textStyle: {
            color: "#fff",
            fontSize:18,
          },
        },
        grid: {
          left: 16,
          right: "3%",
          bottom: "0",
          top:32,
          containLabel: true,
        },
        tooltip: {
          trigger: "axis",
          formatter: function (value) {
            return value[0].name + "\r\r\r" + value[0].value + "%";
          },
        },
        xAxis: {
          type: "value",
          axisLabel: {
            color: "rgba(255, 255, 255, 1)",
          },
        },
        yAxis: {
          type: "category",

          axisLabel: {
            color: "rgba(255, 255, 255, 1)",
            fontSize: 14,
            formatter: function (value) {
              return value.substr(0, 15);
            },
          },
          data: this.barData.yAxisData,
        },
        series: [
          {
            data: this.barData.data,
            type: "bar",
            barWidth: "50%",
            itemStyle: {
              color: this.barData.color,
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
.line-bar {
  width: 100%;
  height: 20vh;
}
</style>