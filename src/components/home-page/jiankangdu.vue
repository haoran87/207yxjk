<template>
  <div style="width: 100%">
    <!-- <div :style="{height:titleH}"></div> -->
    <sub-title
      v-if="showTitle"
      :eNum="titleSet"
      :titleMsg="mData.name"
      :moduleKey="moduleKey"
      @changeModule="changeModule"
    ></sub-title>
    <div
      class="flex-column-center"
      :style="{ height: ch, width: chartWidth }"
      x
    >
      <div
        v-if="$store.state.yqInfo.connectedStu"
        class="flex-between"
        :style="{ height: ch, width: chartWidth }"
      >
        <div :id="chartId" :style="{ height: '85%', width: dominWith + '%' }"></div>
        <div :style="{ height: '100%', width: (100 - dominWith) + '%','font-size':mhNum * 0.055 +'px' }" class="flex-column-center jkd-info">
          <div v-if="detailInfo" style="text-align: left">
            <div style="margin-bottom:8px">
              CPU使用率：{{ detailInfo.CPUSum }}%
            </div>
            <div style="margin-bottom:8px">
              内存使用率：{{ detailInfo.memorySum }}%
            </div>
            <div style="margin-bottom:8px">
              磁盘使用率：{{ detailInfo.diskSum.toFixed(2) }}%
            </div>
            <div style="margin-bottom:8px">
              告警数量：{{ detailInfo.alarmInfoSum }}
            </div>
          </div>
        </div>
      </div>
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
      healthDegree: "",
      gaugeTitle: "",
      showTitle: true,
      scoreSize: 24,
      textSize: 24,
      detailInfo: null,
      mhNum :0,
      dominWith:55
    };
  },
  created() {
    if(this.$store.state.yqInfo.platform === 'pad'){
      this.dominWith = 50
    }
    this.mhNum = parseInt(this.chartHeight)
    // console.log("当前模块位置。。。",this.moduleKey,this.chartHeight,this.mhNum)
    if (this.mData.showTitle !== undefined) {
      this.showTitle = this.mData.showTitle;
    }
  },
  mounted() {
    if (this.mData.plugin) {
      this.getData();
      this.initDrewTimer();
    } else if (this.mData.chartData) {
      // console.log("chardata啊啊啊", this.mData.chartData);

      this.healthDegree = this.mData.chartData.value;
      this.gaugeTitle = this.mData.chartData.title;
      this.drawStatus();
    } else {
      this.getData();
      this.initDrewTimer();
      this.gaugeTitle = "健康度";
    }
  },
  methods: {
    drawStatus() {
      let option = {
        backgroundColor: this.mData.chartBg || "",
        grid: {
         top:0,
         right:0,
         left:0,
        },
        title:{
          text:"健康度 "+ this.healthDegree + " 分",
          bottom:0,
          left:'center',
          textStyle:{
             fontSize: this.mhNum * 0.07,
          },
         
        },
        series: [
          {
            name: this.gaugeTitle,
            type: "gauge",
            center: ["50%", "50%"], // 默认全局居中
            radius:"100%",
            axisLine: {
              lineStyle: {
                width: this.mhNum * 0.06,
                color: [
                  [0.3, "#FFED72"],
                  [0.7, "#FED92B"],
                  [1, "#FFBC14"],
                ],
              },
            },
            pointer: {
              length: "60%",
              width: this.mhNum * 0.06 / 5,
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              distance: -10,
              length: this.mhNum * 0.06 / 5 * 2,
              lineStyle: {
                color: "#4F3F0F",
                // width: 2,
              },
            },
            splitLine: {
              distance: -10,
              length: this.mhNum * 0.06,
              lineStyle: {
                color: "#4F3F0F",
                // width: 4,
              },
            },
            axisLabel: {
              color: "#fff",
              distance: 5,
              fontSize: this.mhNum * 0.06 * 0.8,
            },
            title: {
              show: true,
            },
            detail: {
              show: this.healthDegree || this.healthDegree === 0,
              valueAnimation: true,
              formatter: () => {
                if (this.mData.plugin) {
                  return this.healthDegree + "%";
                } else if (this.mData.chartData) {
                  return this.healthDegree + this.mData.chartData.unit;
                } else {
                  return this.healthDegree + "分";
                }
              },
              color: "auto",
              fontSize: this.mhNum * 0.1,
            },
            data: [
              {
                value: this.healthDegree,
              },
            ],
          },
        ],
      };
      var chartDom = document.getElementById(this.chartId);
      var myChart = this.$echarts.init(chartDom, "dark");
      option && myChart.setOption(option);
      myChart.resize();
    },
  },
};
</script>
<style lang="scss" scoped>
 /* .jkd-info{
    font-size: 0.833vw;
  } */
</style>
