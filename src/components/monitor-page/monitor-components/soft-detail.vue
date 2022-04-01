<template>
  <div v-if="info">
    <box-show style="padding: 16px; height: 100vh">
      <div class="device-basic">
        <div>
          <span style="font-size: var(--pop-title-size)">{{ info.procName }}</span>
        </div>
        <div class="d-path">
          <span>{{ info.procPath }}</span>
        </div>
        <div>
          <tis-row type="flex">
            <tis-col :span="12">
              <div style="width: 100%; height: 426px">
                <component
                  :is="softCpuModule"
                  :mData="softCpuInfo"
                  :titleSet="0"
                  :chartWidth="'100%'"
                  :chartHeight="'426px'"
                ></component>
              </div>
            </tis-col>
            <tis-col :span="12">
              <div style="width: 100%; height: 426px">
                <component
                  :is="softRamModule"
                  :mData="softRamInfo"
                  :titleSet="0"
                  :chartWidth="'100%'"
                  :chartHeight="'426px'"
                ></component>
              </div>
            </tis-col>
          </tis-row>
        </div>
        <div class="back-btn" @click="hideDetail">
          <icon :name="'back'" :size="'24'"></icon>
        </div>
      </div>
      <div style="margin: 16px">
        <self-table :tableData="tableData" :tableObj="tableObj">
          <template v-slot:procState="props">
            {{ props.cellValue == 2 ? "运行中" : "已挂起" }}
          </template>
        </self-table>
      </div>
    </box-show>
  </div>
</template>
<script>
export default {
  props: ["info"],
  data() {
    return {
      infoList: new Array(10),
      softCpuModule: null,
      softCpuInfo: null,
      softRamModule: null,
      softRamInfo: null,
      tableData: [],
      tableObj: {
        procId: {
          slot: false,
          lable: "进程ID",
          class: "tabel-col-1",
          sortable: false,
        },
        procName: {
          slot: false,
          lable: "进程名称",
          class: "tabel-col-2",
          sortable: false,
        },
        procPath: {
          slot: false,
          lable: "进程路径",
          class: "tabel-col-4",
        },
        procState: {
          slot: true,
          lable: "进程状态",
          class: "tabel-col-1",
        },
        procCpu: {
          slot: false,
          lable: "CPU使用率%",
          class: "tabel-col-1",
          sortable: false,
        },
        procMem: {
          slot: false,
          lable: "内存使用率%",
          class: "tabel-col-1",
          sortable: false,
        },
      },
    };
  },
  created() {
    this.initCpuChart();
    this.initRamChart();
    this.getPocessList();
  },
  mounted() {},
  methods: {
    initCpuChart() {
      this.softCpuInfo = this.$store.state.yqInfo.chartInfoObj();
      this.softCpuInfo.id = "softDetailCpu";
      this.softCpuInfo.showTitle = false;
      this.softCpuInfo.chartBg = "#151513";
      this.softCpuInfo.chartData = {
        title: "CPU使用率",
        value: this.info.procCpu,
        unit: "%",
        height: "426px",
        chartWidth: "100%",
        colorArr: [
          [0.3, "#FFED72"],
          [0.7, "#FED92B"],
          [1, "#FFBC14"],
        ],
      };
      this.softCpuModule = () =>
        import("@/components" + this.$store.state.yqInfo.chartPath["仪表盘"]);
    },
    initRamChart() {
      this.softRamInfo = this.$store.state.yqInfo.chartInfoObj();
      this.softRamInfo.id = "softDetailRam";
      this.softRamInfo.showTitle = false;
      this.softRamInfo.chartBg = "#151513";
      this.softRamInfo.chartData = {
        title: "内存使用率",
        value: this.info.procMem,
        unit: "%",
        height: "426px",
        chartWidth: "100%",
        colorArr: [
          [0.3, "#FA8989"],
          [0.7, "#FA6C6C"],
          [1, "#FA5050"],
        ],
      };
      // this.softRamInfo.chartData = {
      //   showChartTitle: true,
      //   showChartLegend: false,
      //   title: "内存使用率",
      //   roseData: [
      //     {
      //       name: "内存使用率",
      //       value: this.info.procMem,
      //       startColor: "#CEDD3D",
      //       endColor: "#5DC656",
      //     },
      //     {
      //       name: "",
      //       value: 100 - this.info.procMem,
      //       startColor: "#F9E10C",
      //       endColor: "#E6AB13",
      //     },
      //   ],
      //   unit: "%",
      // };
      this.softRamModule = () =>
        import("@/components" + this.$store.state.yqInfo.chartPath["仪表盘"]);
    },
    hideDetail() {
      this.$emit("hideDetail");
    },
    getPocessList() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        page_no: 1,
        page_size: 20,
        procId: this.info.procId,
        procName: "",
        procState: "",
        sortBy: "procCpu",
        sortType: "desc",
      };
      this.$api
        .getServerAction("/insight/telegraf/processList", pams)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.items;
          } else {
            this.tableData = [];
            this.pageInfo = null;
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.d-path {
  margin-top: 8px;
  font-size: var(--text-size-small);
  color: var(--text-color-weak);
}
.device-basic {
  text-align: left;
  position: relative;
}
.back-btn {
  position: absolute;
  right: 16px;
  top: 0px;
}
</style>