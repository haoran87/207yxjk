<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <div v-if="$store.state.yqInfo.connectedStu">
      <div class="input-box">
        <div class="input-label">协 议</div>
        <div class="input-con">
          <tis-select
            popper-class="pickerClass"
            v-model="proto"
            placeholder="请选择协议类型"
          >
            <tis-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </tis-option>
          </tis-select>
        </div>
        <div class="input-label">端口状态</div>
        <div class="input-con">
          <tis-select
            popper-class="pickerClass"
            v-model="state"
            placeholder="请选择端口状态"
          >
            <tis-option
              v-for="item in postOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </tis-option>
          </tis-select>
        </div>
        <div class="input-label">端口号</div>
        <div class="input-con">
          <tis-input
            v-model="portAddress"
            placeholder="请输入端口号"
          ></tis-input>
        </div>
        <div class="input-label">进程名称</div>
        <div class="input-con">
          <tis-input
            v-model="programName"
            placeholder="请输入进程名称"
          ></tis-input>
        </div>
        <tis-button type="primary" @click="searchKey">查 询</tis-button>
        <tis-button type="info" @click="resetKey">重 置</tis-button>
      </div>
      <!-- <div class="btn-box">
          <tis-row>
            <tis-button class="btn">导出</tis-button>
          </tis-row>
        </div> -->
      <div style="margin: 0px 16px">
        <self-table
          ref="selfTable"
          :tableData="tableData"
          :tableObj="tableObj"
          @sortClick="sortClick"
          :tableHeight="$store.state.yqInfo.MAINHEIGHT - 56 - 48"
        >
        </self-table>
      </div>
      <list-page
        :pageInfo="pageInfo"
        :curPage="curPage"
        :pageSize="pageSize"
        @cpc="curPageChange"
      ></list-page>
    </div>
    <div v-else>
      <weijietong></weijietong>
    </div>
  </box-show>
</template>
<script>
export default {
  data() {
    return {
      pageInfo: null,
      timer: null,
      proto: "", //查询条件，协议类型
      state: "", //查询条件，端口状态
      programName: "", //查询条件，进程名称
      portAddress: "", //查询条件，端口号
      curPage: 1,
      pageSize: 20,
      isAll: false,
      pluginName: "",
      typeOptions: [
        {
          value: "udp",
          label: "UDP",
        },
        {
          value: "udp6",
          label: "UDP6",
        },
        {
          value: "tcp",
          label: "TCP",
        },
        {
          value: "tcp6",
          label: "TCP6",
        },
        {
          value: "unix",
          label: "UNIX",
        },
      ],
      postOptions: [
        {
          value: "LISTENING",
          label: "LISTENING",
        },
        {
          value: "LISTEN",
          label: "LISTEN",
        },
        {
          value: "ESTABLISHED",
          label: "ESTABLISHED",
        },
        {
          value: "TIME_WAIT",
          label: "TIME_WAIT",
        },
      ],

      stuValue: "",
      tableData: [],
      sortKey: "",
      sortType: "",
      tableObj: {
        proto: {
          slot: false,
          lable: "协议",
          class: "tabel-col-2",
          sortable: true,
        },
        localAddress: {
          slot: false,
          lable: "端口",
          class: "tabel-col-2",
          sortable: true,
        },
        state: {
          slot: false,
          lable: "状态",
          class: "tabel-col-2",
          sortable: true,
        },
        pid: {
          slot: false,
          lable: "进程ID",
          class: "tabel-col-2",
          sortable: true,
        },
        programName: {
          slot: false,
          lable: "进程名称",
          class: "tabel-col-2",
          sortable: true,
        },
      },
    };
  },
  created() {
    if (this.$store.state.yqInfo.chooseIP) {
      this.page();
    }
  },
  mounted() {
    //定时任务方法
    this.timer = setInterval(this.page, 10000);
  },
  beforeDestroy() {
    if (this.timer) {
      //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); //关闭
    }
  },
  watch: {
    "$store.state.yqInfo.chooseIP"() {
      this.page();
    },
  },
  methods: {
    sortClick(e) {
      this.sortKey = e.sortKey;
      this.sortType = e.sortType;
      this.page();
    },
    curPageChange(e) {
      this.curPage = e;
      this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
      this.page();
    },
    searchKey() {
      this.curPage = 1;
      this.page();
    },
    resetKey() {
      this.curPage = 1;
      this.state = "";
      this.proto = "";
      this.programName = "";
      this.portAddress = "";
      this.page();
    },
    page() {
      let path = "/insight/netMonitor/netInfoList";
      let params = {
        ip: this.$store.state.yqInfo.chooseIP,
        page_no: this.curPage,
        page_size: this.pageSize,
        state: this.state,
        programName: this.programName,
        portAddress: this.portAddress,
        proto: this.proto,
        sortBy: this.sortKey,
        sortType: this.sortType,
      };
      //测试数据据
      // this.pluginList = getTestPlugin();
      this.$api.getServerAction(path, params).then(
        (res) => {
          if (res.code == 200) {
            this.tableData = res.data.items;
            this.pageInfo = res.data.page;
          }
        },
        function () {
          // errorFunc(error, self.$message);
        }
      );
    },
    scanDetail() {
      this.$emit("showDetail");
    },
  },
};
</script>
<style lang="scss" scoped>
.yqxxkjPad{
  .input-label{
    width:110px
  }
}
</style>
