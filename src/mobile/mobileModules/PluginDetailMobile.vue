<template>
  <page-mobile>
    <template>
      <div class="page-top flex flex-between">
        <div>
          <div>名称：{{ detailInfo.name }}</div>
          <div class="info-code">标识：{{ detailInfo.code }}</div>
        </div>
        <div>
          <span @click="hideDetail">
            <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
          </span>
        </div>
      </div>
      <div :style="{ height: 'calc(100% - 54px)' }" class="chart-box">
        <div class="m-plugin-row" style="width: 100%">
          <div
            class="m-plugin-item"
            :id="'m-' + item.code"
            v-for="(item, idx) in valueList"
            :key="idx"
          >
            <div>
              <div class="show-title flex flex-between">
                <span>{{ item.name }}</span>
                <m-popover
                  v-model="item.showPop"
                  placement="left"
                  trigger="click"
                  :actions="actions"
                  theme="dark"
                  @select="onSelect($event, item)"
                >
                  <template #reference>
                    <i
                      v-if="typeof item.value === 'number'"
                      class="el-icon-s-tools"
                    ></i>
                  </template>
                </m-popover>
              </div>
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
                  <div></div>
                </div>
                <div style="width: 60%">
                  <detail-guage
                    :ref="item.code + '_guage'"
                    :chartId="item.code"
                    :guageValue="item.value"
                    :unit="item.unit"
                  ></detail-guage>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </page-mobile>
</template>

<script>
import DetailBar from "@/components/monitor-page/monitor-chart/detail-bar.vue";
import DetailGuage from "@/components/monitor-page/monitor-chart/detail-guage.vue";
import DetailTrend from "@/components/monitor-page/monitor-chart/detail-trend.vue";
export default {
  props: ["detailInfo"],
  components: {
    DetailBar,
    DetailTrend,
    DetailGuage,
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
      actions: [
        { text: "数值", type: "label" },
        { text: "折线图", type: "trend" },
        { text: "柱形图", type: "bar" },
        { text: "仪表盘", type: "guage" },
      ],
    };
  },
  created() {
    this.getPluginValue();
    this.initTimer();
  },
  mounted() {},
  destroyed() {
    this.clearTimer();
  },
  methods: {
    onSelect(act, item) {
      if (item.chart_type != act.type) {
        item.chart_type = act.type;
      }
    },
    showSet() {
      this.showPop = true;
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
            this.addInfo();
          },
          cancel: () => {
            this.$emit("hideDetail");
          },
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
            } else {
              this.valueList.forEach((el) => {
                this.startChart.push({
                  code: el.code,
                  chart_type: el.chart_type,
                });
              });
              console.log("搞毛线", this.startChart, this.valueList);
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

<style lang='scss' scoped>
.page-top {
  background: var(--layout-bg-1);
  height: 54px;
  align-items: center;
  padding: 0 8px;
  .info-code {
    font-size: 12px;
    text-align: left;
    color: var(--text-color-weak);
  }
}
.m-plugin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.m-plugin-item {
  width: calc(100% / 3 - 18px);
  position: relative;
  min-height: 0px;
  height: 90px;
  border: var(--status-bar-tools-border);
  margin: 8px;
  padding: 8px 0;
}
.chart-box {
  overflow-y: scroll;
}

.show-title {
  //   line-height: 2.6vw;
  text-align: left;
  padding: 0 8px;
}

.show-value {
  text-align: left;
  padding: 0 8px;
  //   line-height: 3vw;
  font-weight: bold;
}

.item-chart {
  height: 80px;
}

.show-guage {
  height: 60px;
}

.show-guage-value {
  text-align: left;
  padding: 0 16px;
  font-weight: bold;
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