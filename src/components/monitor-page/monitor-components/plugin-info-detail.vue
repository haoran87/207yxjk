<template>
  <div>
    <div style="margin-bottom: 16px" ref="topCon">
      <box-show>
        <div class="device-basic">
          <div style="margin-bottom: 16px; font-size: var(--pop-title-size)">
            <span style="margin-right: 16px"> 名称：{{ detailInfo.name }}</span>
          </div>
          <div style="margin-bottom: 16px; font-size: var(--text-size-big)">
            <span style="margin-right: 16px; color: var(--text-color-weak)">
              标识：{{ detailInfo.code }}</span
            >
          </div>
          <div>
            <span style="margin-right: 48px">
              插件类型：{{ typeList[detailInfo.type] }}</span
            >
            <span>插件状态：{{ stuList[detailInfo.show_status] }}</span>
          </div>
          <div class="back-btn">
            <span @click="hideDetail">
              <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
            </span>
          </div>
          <div class="save-btn">
            <!-- <tis-button
              @click="addInfo"
              type="primary"
              size="small"
              style="margin-right: 5px"
              >保 存</tis-button
            > -->
          </div>
        </div>
      </box-show>
    </div>
    <div>
      <box-show style="padding: 8px">
        <div :style="deStyle">
          <div class="plugin-row">
            <div
              class="plugin-item"
              v-for="(item, idx) in valueList"
              :key="idx"
            >
              <div>
                <div class="show-title">{{ item.name }}</div>
                <div v-if="item.chart_type != 'guage'">
                  <div class="show-value">{{ item.value + item.unit }}</div>
                  <div class="item-chart">
                    <detail-trend
                      :chartId="item.code"
                      v-if="item.chart_type == 'trend'"
                      :ref="item.code + '_trend'"
                      :trendData="item.barData"
                      :unit="item.unit"
                    ></detail-trend>
                    <detail-bar
                      :ref="item.code + '_bar'"
                      :chartId="item.code"
                      v-if="item.chart_type == 'bar'"
                      :barData="item.barData"
                      :unit="item.unit"
                    ></detail-bar>
                  </div>
                </div>
                <div v-else class="show-guage flex">
                  <div style="width: 40%">
                    <div class="show-guage-value">
                      {{ item.value + item.unit }}
                    </div>
                    <div style="height: 5vw"></div>
                  </div>
                  <div style="width: 60%; height: 8vw">
                    <detail-guage
                      :ref="item.code + '_guage'"
                      :chartId="item.code"
                      :guageValue="item.value"
                      :unit="item.unit"
                    ></detail-guage>
                  </div>
                </div>
              </div>
              <tis-popover
                placement="left"
                width="200"
                trigger="click"
                v-model="item.showPop"
              >
                <div>
                  <tis-button type="text" @click="setClick('label', idx)"
                    >数值
                  </tis-button>
                </div>
                <div calss="set-item">
                  <tis-button type="text" @click="setClick('trend', idx)"
                    >折线图
                  </tis-button>
                </div>
                <div calss="set-item">
                  <tis-button type="text" @click="setClick('bar', idx)"
                    >柱形图
                  </tis-button>
                </div>
                <div calss="set-item">
                  <tis-button type="text" @click="setClick('guage', idx)"
                    >仪表盘
                  </tis-button>
                </div>
                <div
                  class="chart-set"
                  slot="reference"
                  v-if="typeof item.value === 'number'"
                >
                  <i class="el-icon-s-tools"></i>
                </div>
              </tis-popover>
            </div>
          </div>
        </div>
      </box-show>
    </div>
  </div>
</template>
<script>
import DetailBar from "../monitor-chart/detail-bar.vue";
import DetailGuage from "../monitor-chart/detail-guage.vue";
import DetailTrend from "../monitor-chart/detail-trend.vue";
// import DetailPie from "./detail-pie.vue";
export default {
  props: ["detailInfo"],
  components: {
    DetailBar,
    DetailTrend,
    DetailGuage,
    //    DetailPie
  },
  data() {
    return {
      typeList: {
        server: "服务",
        script: "脚本",
      },
      stuList: {
        1: "未加载",
        2: "未启用",
        3: "已启用",
      },
      showPop: false,
      valueList: [],
      timer: null,
      deStyle: {},
      pluginChartTimer: null,
      startChart: [],
      endChart: [],
    };
  },
  created() {
    this.getPluginValue();
    this.initTimer();
  },
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect();
    // let deHeight = this.$store.state.yqInfo.MAINHEIGHT - rect.height - 16 - 32 + 'px'
    this.deStyle = {
      height:
        this.$store.state.yqInfo.MAINHEIGHT - rect.height - 16 - 16 + "px",
      "overflow-y": "scroll",
    };
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    showSet() {
      this.showPop = true;
    },
    setClick(v, idx) {
      if (this.valueList[idx].chart_type != v) {
        this.valueList[idx].chart_type = v;
      }
      this.valueList[idx].showPop = false;
      console.log(this.valueList);
    },
    initTimer() {
      if (this.timer === null) {
        this.timer = setInterval(() => {
          this.getPluginValue();
        }, 10 * 1000);
      }
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    getPluginValue() {
      let params = {
        ip: this.$store.state.yqInfo.chooseIP,
        code: this.detailInfo.code,
      };
      this.$api
        .getServerAction(
          "/insight/pluginInfo/getPluginStatusInfoByRedis",
          params
        )
        .then((res) => {
          if (res.code === 200) {
            let temData = res.data.value;
            if (this.valueList.length === 0) {
              temData.forEach((el) => {
                el.chart_type = "label";
                el.barData = [0, 0, 0, 0, 0, 0, 0, 0, 0, el.value];
              });
              temData.showPop = false;
              this.valueList = temData;
              this.getPluginInfo();
            } else {
              temData.forEach((el) => {
                let isHave = false;
                for (let i = 0; i < this.valueList.length; i++) {
                  let v = this.valueList[i];
                  if (el.code === v.code) {
                    isHave = true;
                    v.value = el.value;
                    v.barData.splice(0, 1);
                    v.barData.push(el.value);
                    break;
                  }
                }
                if (!isHave) {
                  this.valueList.push(el);
                }
              });
            }
          }
        });
    },
    hideDetail() {
      //检测是否修改过图表种类
      let sv = this.valueList.find((el) => {
        return this.startChart.find((sel) => {
          return sel.code === el.code && el.chart_type !== sel.chart_type;
        });
      });
      if (sv !== undefined) {
        this.$yqAlert({
          content: "需要保存当前选择的图表吗？",
          hideCancel: false,
          suc: () => {
            this.addInfo()
          },
          cancel:()=>{
               this.$emit("hideDetail");
          }
        });
      } else {
        this.$emit("hideDetail");
      }
    },
    getPluginInfo() {
      this.$yqLoading.show();
      let params = {
        id: this.detailInfo.id,
      };
      this.$api
        .getServerAction("/insight/pluginInfo/list", params)
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code === 200) {
            if (res.data.length > 0) {
              this.startChart = res.data;
              this.valueList.forEach((el) => {
                el.chart_type = res.data.find((rel) => {
                  return rel.code == el.code;
                }).chart_type;
              });
            }
          } else {
            this.$message.error(res.info);
          }
        });
    },
    addInfo() {
      this.$yqLoading.show();
      for (let a = 0; a < this.valueList.length; a++) {
        this.valueList[a].plugin_id = this.detailInfo.id;
      }
      this.$api
        .postServerAction(
          "/insight/pluginInfo/changePluginInfo",
          this.valueList
        )
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code === 200) {
            this.$message.success("保存成功");
            this.$emit("hideDetail");
          } else {
            this.$message.error(res.info);
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.plugin-item {
  min-height: 0px;
  height: auto;
  position: relative;
}

.chart-set {
  position: absolute;
  top: 8px;
  right: 8px;
}

.show-title {
  line-height: 2.6vw;
  text-align: left;
  padding: 0 16px;
  font-size: var(--tab-title-size);
}

.show-value {
  text-align: left;
  padding: 0 16px;
  line-height: 3vw;
  font-weight: bold;
  font-size: var(--app-title-size);
}

.item-chart {
  height: 5vw;
}

.show-guage {
  height: 8vw;
}

.show-guage-value {
  text-align: left;
  padding: 0 16px;
  font-weight: bold;
  font-size: var(--app-title-size);
}

.set-item {
  padding: 8px;
}

.device-basic {
  padding: 16px;
  text-align: left;
  position: relative;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 3px;
}

.back-btn {
  position: absolute;
  right: 32px;
  top: 8px;
}
.save-btn {
  position: absolute;
  right: 32px;
  top: 58px;
}
</style>
