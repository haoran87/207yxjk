<template>
  <div>
    <!-- <tis-progress type="circle" :percentage="25" width="80"></tis-progress> -->
    <div
      :id="idName"
      :style="{ width: circleHeight, height: circleHeight }"
    ></div>
  </div>
</template>
<script>
export default {
  props: ["idName", "circleHeight"],
  data() {
    return {
      rateNum: 0,
      myChart: null,
      borderWidth:15,
      radius:'130%',
      fontSize:"120%",
    };
  },
  created(){
    let nubCH = parseInt(this.circleHeight)
    this.borderWidth = nubCH * 0.08;
    // console.log("圆圈的高度&&&",nubCH)
  },
  mounted() {},
  // watch:{
  //   rateNum(){
  //      this.drawCircle();
  //   }
  // },
  methods: {
    drawCircle() {
      var chartDom = document.getElementById(this.idName);
      this.myChart = this.$echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: this.rateNum + "%",
          textStyle: {
            color: "#fff",
            fontSize: this.borderWidth * 1.8,
          },
          left: "center",
          top: "center",
        },
        angleAxis: {
          max: 100, // 满分
          clockwise: false, // 逆时针
          startAngle: 180,
          // 隐藏刻度线
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
        radiusAxis: {
          type: "category",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
          grid: {
         top:0,
         right:0,
         left:0,
        },
        polar: {
          center: ["50%", "50%"],
          radius: "150%", //图形大小
        },
        series: [
          {
            type: "bar",
            data: [
              {
                name: "使用率",
                value: this.rateNum,
                itemStyle: {
                  normal: {
                    color: {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#FF8001",
                        },
                        {
                          offset: 1,
                          color: "#E8F794",
                        },
                      ],
                    },
                  },
                },
              },
            ],

            coordinateSystem: "polar",
            roundCap: true,
            barWidth: this.borderWidth,
            barGap: "-100%",
            radius: ["100%", "100%"],
            z: 2,
          },
          {
            // 灰色环
            type: "bar",
            data: [
              {
                value: 100,
                itemStyle: {
                  color: "#343434",
                },
              },
            ],

            animation: false,
            coordinateSystem: "polar",
            roundCap: true,
            barWidth: this.borderWidth,
            // barGap: "-110%", // 两环重叠
            radius: ["50%", "100%"],
            z: 1,
          },
        ],
      };

      option && this.myChart.setOption(option);
       this.myChart.resize()
    },
  },
};
</script>