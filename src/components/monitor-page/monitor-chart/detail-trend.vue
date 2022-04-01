<template>
  <div>
    <div :id="chartId" :style="styleObj"></div>
  </div>
</template>
<script>
export default {
  props: ["chartId", "trendData",'unit'],
  data() {
    return {
      styleObj:{
        width: '100%',
         height: '5vw'
      }
    };
  },
  created() {
    if(this.$store.state.yqInfo.platform === "mobile"){
      this.styleObj.height = '60px'
    }
  },
  watch:{
    trendData(){
      this.drawBar()
    }
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
           bottom:8,
          top:0,
        },
        tooltip: {
          trigger: "axis",
          formatter:  (value) => {
            return value[0].data + this.unit;
          },
        },
        xAxis: {
          show: false,
          type: "category",
          boundaryGap: false,
          data: [1,1,1,1,1,1,1,1,1,1],
        },
        yAxis: {
          show: false,
          type: "value",
        },
        series: [
          {
            lineStyle: {
              normal: {
                width: 2,
                color: "rgba(25,163,223,1)", // 线条颜色
              },
              borderColor: "rgba(0,0,0,.4)",
            },
            itemStyle: {
              color: "#BAA278",
            },
            data:this.trendData,
            type: "line",
            smooth: true,
            showSymbol: false,
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new this.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: "rgba(25,163,223,.3)",
                    },
                    {
                      offset: 1,
                      color: "rgba(25,163,223, 0)",
                    },
                  ],
                  false
                ),
                shadowColor: "rgba(25,163,223, 0.5)", //阴影颜色
                shadowBlur: 20, //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
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