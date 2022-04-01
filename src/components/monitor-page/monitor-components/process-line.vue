<template>
  <div>
    <box-show :boxStyle="{ padding: '16px' }">
      <div class="line-box">
        <div
          v-if="$store.state.yqInfo.connectedStu"
          class="line-item"
          style="position: relative"
        >
          <process-bar :barData="cpuBarData" :perData="cpuData"></process-bar>
          <tis-popover
            placement="left"
            trigger="click"
            popper-class="pickerClass"
            v-model="showCpuPop"
          >
            <div>
              <div style="margin-bottom: 16px">{{ cpuLabel }}</div>
              <tis-input-number
                v-model="cpuBarData.topNum"
                :min="1"
                :max="100"
              ></tis-input-number>
            </div>
            <tis-button
              style="width: 100%; margin-top: 16px"
              type="primary"
              @click="hideCpu"
              >确定</tis-button
            >
          
            <div class="bar-setting" slot="reference">
              <i class="el-icon-setting"></i>
            </div>
          </tis-popover>
        </div>
        <div class="line-item" v-else>
          <weijietong></weijietong>
        </div>
        <div v-if="$store.state.yqInfo.connectedStu" class="line-item">
          <process-bar :barData="ramBarData" :perData="ramData"></process-bar>
          <tis-popover
            placement="left"
            trigger="click"
            popper-class="pickerClass"
            v-model="showRamPop"
          >
            <div>
              <div style="margin-bottom: 16px">{{ ramLabel }}</div>
              <tis-input-number
                v-model="ramBarData.topNum"
                @keyup.enter.native="hideRam"
                :min="1"
                :max="100"
              ></tis-input-number>
            </div>
            <tis-button
              style="width: 100%; margin-top: 16px"
              type="primary"
              @click="hideRam"
              >确定</tis-button
            >
            <!-- <div  @change="chooseTop('ram')"
                v-for="(item, idx) in topList"
                :key="idx"
                style="text-align: center; padding: 8px"
                onMouseOver="this.style.color='#fecc09'"
                onMouseOut="this.style.color='#fff'"
                @click="chooseTop(item, 'ram')"
              >
                {{ item.name }}
              </div> -->
            <div class="bar-setting" slot="reference">
              <i class="el-icon-setting"></i>
            </div>
          </tis-popover>
        </div>
        <div class="line-item" v-else>
          <weijietong></weijietong>
        </div>
      </div>
    </box-show>
  </div>
</template>
<script>
import ProcessBar from "./process-bar.vue";
export default {
  components: { ProcessBar },
  props: ["dataType"],
  data() {
    return {
      cpuBarData: {
        id: "cpuBar",
        title: "",
        data: [],
        color: "#FFCC09",
        yAxisData: [],
        topNum: 5,
      },
      cpuData: [],
      ramBarData: {
        id: "ramBar",
        title: "",
        data: [],
        color: "#FF7777",
        yAxisData: [],
        topNum: 0,
      },
      ramData: [],
      showCpuPop: false,
      showRamPop: false,
      topList: [
        {
          name: "TOP5",
          value: 5,
        },
        {
          name: "TOP8",
          value: 8,
        },
        {
          name: "TOP10",
          value: 10,
        },
        {
          name: "TOP15",
          value: 15,
        },
      ],
      cpuTopNum: 0,
      ramTopNum: 0,
      ramLabel: "",
      cpuLabel: "",
      serviceList: [],
    };
  },
  created() {
    if (this.dataType === "process") {
      this.ramLabel = "进程内存使用率TOP";
      this.ramBarData.topNum = this.$store.state.yqInfo.topObj.threadRamNum;
      this.cpuLabel = "进程CPU使用率TOP";
      this.cpuBarData.topNum = this.$store.state.yqInfo.topObj.threadCpuNum;
      this.resetProTop();
    } else if (this.dataType === "soft") {
      this.ramLabel = "软件内存使用率TOP";
      this.ramBarData.topNum = this.$store.state.yqInfo.topObj.softRamNum;
      this.cpuBarData.topNum = this.$store.state.yqInfo.topObj.softCpuNum;
      this.cpuLabel = "软件CPU使用率TOP";
      this.resetSoftTop();
    } else if (this.dataType === "service") {
      this.ramLabel = "服务内存占用TOP";
      this.ramBarData.topNum = this.$store.state.yqInfo.topObj.serviceRamNum;
      this.cpuBarData.topNum = this.$store.state.yqInfo.topObj.serviceCpuNum;
      this.cpuLabel = "服务CPU使用率TOP";
      // this.resetSoftTop()
    }
    this.ramBarData.title = this.ramLabel + this.ramBarData.topNum;
    this.cpuBarData.title = this.cpuLabel + this.cpuBarData.topNum;
  },
  mounted() {},
  watch: {
    showCpuPop() {
      // console.log("监听到popshow",this.showCpuPop)
      if (!this.showCpuPop) {
        this.chooseTop("cpu");
      } else {
        window.addEventListener("keydown", this.keyEnter);
      }
    },
    showRamPop() {
      if (!this.showRamPop) {
        this.chooseTop("ram");
      } else {
        window.addEventListener("keydown", this.keyEnter);
      }
    },
  },
  methods: {
    keyEnter(e) {
      if (e.code === "Enter") {
        if (this.showRamPop) {
          this.hideRam();
        }
        if (this.showCpuPop) {
          this.hideCpu();
        }
      }
    },
    hideCpu() {
      window.removeEventListener("keydown", this.keyEnter);
      this.showCpuPop = false;
    },
    hideRam() {
      window.removeEventListener("keydown", this.keyEnter);
      this.showRamPop = false;
    },
    resetSoftTop() {
      this.getSoftData("procCpu");
      this.getSoftData("procMem");
    },
    resetProTop() {
      this.getCpuTop();
      this.getRamTop();
    },
    resetServiceTop() {
      // console.log("列表的数据",this.serviceList)
      this.getServiceCpuTop();
      this.getServiceMemTop();
    },
    chooseTop(type) {
      console.log("djdjdjdjdjd",)
      if (type === "cpu") {
        this.$nextTick(() => {
          this.cpuBarData.topNum = parseInt(this.cpuBarData.topNum);

          this.cpuBarData.title = this.cpuLabel + this.cpuBarData.topNum;
          if (this.dataType === "soft") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              softCpuNum: this.cpuBarData.topNum,
            });
            this.getSoftData("procCpu");
            this.$emit("getListAgain");
          } else if (this.dataType === "process") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              threadCpuNum: this.cpuBarData.topNum,
            });
            this.getCpuTop();
            this.$emit("getListAgain");
          }
          if (this.dataType === "service") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              serviceCpuNum: this.cpuBarData.topNum,
            });
            this.getServiceCpuTop();
            // this.$emit("getListAgain");
          }
        });
      } else if (type === "ram") {
        this.$nextTick(() => {
          this.ramBarData.topNum = parseInt(this.ramBarData.topNum);
          this.showRamPop = false;
          this.ramBarData.title = this.ramLabel + this.ramBarData.topNum;
          if (this.dataType === "soft") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              softRamNum: this.ramBarData.topNum,
            });
            this.getSoftData("procMem");
            this.$emit("getListAgain");
          } else if (this.dataType === "process") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              threadRamNum: this.ramBarData.topNum,
            });
            this.getRamTop();
            this.$emit("getListAgain");
          } else if (this.dataType === "service") {
            this.$store.commit("yqInfo/TOP_OBJ", {
              serviceRamNum: this.ramBarData.topNum,
            });
            this.getServiceMemTop();
          }
        });
      }
    },
    getSoftData(type) {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        num:
          type === "procCpu" ? this.cpuBarData.topNum : this.ramBarData.topNum,
        sortBy: type,
      };
      this.$api
        .getServerAction("/insight/softwareMonitor/softwareFrontByNum", pams)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (type === "procCpu") {
              this.cpuBarData.data = [];
              this.cpuData = [];
              this.cpuBarData.yAxisData = [];
            } else if (type === "procMem") {
              this.ramBarData.data = [];
              this.ramData = [];
              this.ramBarData.yAxisData = [];
            }
            res.data.forEach((element) => {
              if (type === "procCpu") {
                this.cpuBarData.data.unshift(element.procCpu);
                this.cpuData.unshift(element.procCpu);
                this.cpuBarData.yAxisData.unshift(element.procName);
              } else if (type === "procMem") {
                this.ramBarData.data.unshift(element.procMem);
                this.ramData.unshift(element.procMem);
                this.ramBarData.yAxisData.unshift(element.procName);
              }
            });
          } else {
            if (type === "procCpu") {
              this.cpuBarData.data = [];
              this.cpuData = [];
              this.cpuBarData.yAxisData = [];
            } else if (type === "procMem") {
              this.ramBarData.data = [];
              this.ramData = [];
              this.ramBarData.yAxisData = [];
            }
          }
        });
    },
    getServiceMemTop() {
      this.ramBarData.data = [];
      this.ramData = [];
      this.ramBarData.yAxisData = [];
      this.serviceList.sort(function (a, b) {
        return b.mem - a.mem;
      });
      let topList = this.serviceList.slice(0, this.ramBarData.topNum);
      topList.forEach((element) => {
        this.ramBarData.data.unshift(element.mem);
        this.ramData.unshift(element.mem);
        this.ramBarData.yAxisData.unshift(element.name);
      });
    },
    getServiceCpuTop() {
      this.cpuBarData.data = [];
      this.cpuData = [];
      this.cpuBarData.yAxisData = [];
      this.serviceList.sort(function (a, b) {
        return b.pcpu - a.pcpu;
      });
      let topList = this.serviceList.slice(0, this.cpuBarData.topNum);
      topList.forEach((element) => {
        this.cpuBarData.data.unshift(element.pcpu);
        this.cpuData.unshift(element.pcpu);
        this.cpuBarData.yAxisData.unshift(element.name);
      });
    },
    getCpuTop() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        num: this.cpuBarData.topNum,
      };
      this.$api
        .getServerAction("/insight/telegraf/processCpuRateFrontByNum", pams)
        .then((res) => {
          this.cpuBarData.data = [];
          this.cpuData = [];
          this.cpuBarData.yAxisData = [];
          if (res.code == 200 && res.data) {
            res.data.forEach((element) => {
              this.cpuBarData.data.unshift(element.procCpu);
              this.cpuData.unshift(element.procCpu);
              this.cpuBarData.yAxisData.unshift(element.procName);
            });
          }
        });
    },
    getRamTop() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        num: this.ramBarData.topNum,
      };
      this.$api
        .getServerAction("/insight/telegraf/processMemRateFrontByNum", pams)
        .then((res) => {
          this.ramBarData.data = [];
          this.ramData = [];
          this.ramBarData.yAxisData = [];
          if (res.code == 200 && res.data) {
            res.data.forEach((element) => {
              this.ramBarData.data.unshift(element.procMem);
              this.ramData.unshift(element.procMem);
              this.ramBarData.yAxisData.unshift(element.procName);
            });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.line-box {
  display: flex;
  justify-content: space-between;
}
.line-item {
  width: 49%;
  position: relative;
}
.bar-setting {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>