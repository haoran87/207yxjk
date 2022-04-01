<template>
  <div>
    <box-show v-if="conHeight > 0" :style="{ height: conHeight + 'px' }">
      <div v-if="$store.state.yqInfo.connectedStu">
        <div class="input-box" ref="inputBox">
          <div class="input-label">进程ID</div>
          <div class="input-con">
            <tis-input
              v-model="processID"
              placeholder="请输入进程ID"
            ></tis-input>
          </div>
          <div class="input-label">进程名称</div>
          <div class="input-con">
            <tis-input
              v-model="processName"
              placeholder="请输入进程名称"
            ></tis-input>
          </div>
          <div class="input-label">进程路径</div>
          <div class="input-con">
            <tis-input
              v-model="procPath"
              placeholder="请输入进程路径"
            ></tis-input>
          </div>
          <div class="input-label">进程状态</div>
          <div class="input-con">
            <tis-select
              v-model="processStu"
              placeholder="请选择进程状态"
              @change="processStuChange"
              popper-class="pickerClass"
            >
              <tis-option
                v-for="item in stuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </tis-option>
            </tis-select>
          </div>
          <tis-button type="primary" @click="searchKey">查询</tis-button>
          <tis-button type="info" @click="resetKey">重置</tis-button>
        </div>
        <div style="margin: 0px 8px" v-if="tableHeight">
          <self-table
            ref="selfTable"
            :tableData="tableData"
            :tableObj="tableObj"
            @sortClick="sortClick"
            :tableHeight="tableHeight"
          >
            <template v-slot:procState="props">
              <div v-for="item in stuOptions" :key="item.value">
                <span v-if="props.cellValue == item.value">{{
                  item.label
                }}</span>
              </div>
            </template>
          </self-table>
        </div>
        <list-page
          ref='listPage'
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
  </div>
</template>
<script>
export default {
  props: ["conHeight"],
  data() {
    return {
      tableData: [],
      tableObj: {
        procId: {
          slot: false,
          lable: "进程ID",
          class: "tabel-col-1",
          sortable: true,
        },
        procName: {
          slot: false,
          lable: "进程名称",
          class: "tabel-col-1",
          sortable: true,
        },
        procPath: {
          slot: false,
          lable: "进程路径",
          class: "tabel-col-2",
          sortable: true,
        },
        procState: {
          slot: true,
          lable: "进程状态",
          class: "tabel-col-1",
          sortable: true,
        },
        procCpu: {
          slot: false,
          lable: "CPU使用率%",
          class: "tabel-col-2",
          sortable: true,
        },
        procMem: {
          slot: false,
          lable: "内存使用率%",
          class: "tabel-col-2",
          sortable: true,
        },
        procMemUsed: {
          slot: false,
          lable: "内存使用M",
          class: "tabel-col-1",
          sortable: true,
        },
      },
      isAll: false,
      processID: "",
      processName: "",
      processStu: "",
      procPath: "",
      // case "R", "r": //运行 running
      // 	statusT = 0
      // case "T", "t": //停止 traced or stopped
      // 	statusT = 1
      // case "S", "s": //睡眠，中断 sleeping
      // 	statusT = 2
      // case "Z", "z": //僵死 a defunct (”zombie”) process
      // 	statusT = 3
      // default:
      // 	statusT = 2
      stuOptions: [
        {
          value: "0",
          label: "运行中",
        },
        {
          value: "1",
          label: "停止",
        },
        {
          value: "2",
          label: "睡眠中",
        },
        {
          value: "3",
          label: "僵死",
        },
      ],
      stuValue: "",
      // tableData: [],
      multipleSelection: [],
      pageInfo: null,
      curPage: 1,
      pageSize: 20,
      proSort: "",
      sortKey: "",
      sortType: "",
      timer: null,
      tableHeight:0,
    };
  },
  created() {
    if (this.$store.state.yqInfo.connectedStu) {
      this.resetKey();
    }
  },
  mounted() {
    //定时任务方法
    setTimeout(()=>{
       if(this.$refs.inputBox){
      let h = this.$refs.inputBox.getBoundingClientRect().height;
      console.log("input的顶顶顶",h)
      this.tableHeight = this.conHeight - h - 32 - 16
      
    }
    },100)
   
    this.timer = setInterval(this.getPocessList, 10000);
  },
  beforeDestroy() {
    if (this.timer) {
      //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); //关闭
    }
  },
  methods: {
    sortClick(e) {
      this.sortType = e.sortType;
      this.sortKey = e.sortKey;
      this.getPocessList();
    },
    processStuChange() {},
    searchKey() {
      this.curPage = 1;
      this.getPocessList();
    },
    resetKey() {
      this.curPage = 1;
      this.processID = "";
      this.processName = "";
      this.processStu = "";
      (this.procPath = ""), this.getPocessList();
    },
    curPageChange(e) {
      this.curPage = e;
      this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
      this.getPocessList();
    },
    getPocessList() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        page_no: this.curPage,
        page_size: this.pageSize,
        procId: this.processID,
        procName: this.processName,
        procState: this.processStu,
        procPath: this.procPath,
        sortBy: this.sortKey,
        sortType: this.sortType,
      };
      this.$api
        .getServerAction("/insight/telegraf/processList", pams)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data.items;
            this.pageInfo = res.data.page;
          } else {
            this.tableData = [];
            this.pageInfo = null;
          }
          this.$emit("resetProTop");
        });
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
    width:105px
  }
}
</style>
