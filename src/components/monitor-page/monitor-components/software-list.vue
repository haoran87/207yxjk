<template>
  <div>
    <box-show :style="{ height: '835px' }">
      <div v-if="$store.state.yqInfo.connectedStu">
        <div class="input-box">
          <div class="input-label">软件名称：</div>
          <div class="input-con">
            <tis-input
              v-model="softName"
              placeholder="请输入软件名称"
            ></tis-input>
          </div>
          <div class="input-label">软件路径：</div>
          <div class="input-con">
            <tis-input
              v-model="procPath"
              placeholder="请输入软件路径"
            ></tis-input>
          </div>
          <tis-button type="primary" @click="searchKey">查询</tis-button>
          <tis-button type="info" @click="resetKey">重置</tis-button>
        </div>
        <div style="margin: 16px 16px 32px">
          <self-table
            :tableData="tableData"
            :tableObj="tableObj"
            @sortClick="sortClick"
          >
           <template v-slot:handle="props">
              <div class="selected-color" @click="checkDetail(props.cellData)">查看</div>
            </template>
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
      <div style="height: 16px"></div>
    </box-show>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAll: false,
      softName: "",
      procPath: "",
      typeValue: "",
      stuValue: "",
      tableData: [],
      tableObj: {
        procName: {
          slot: false,
          lable: "软件名称",
          class: "tabel-col-2",
          sortable: true,
        },
        procPath: {
          slot: false,
          lable: "软件路径",
          class: "tabel-col-3",
          sortable: false,
        },
        procCpu: {
          slot: false,
          lable: "CPU使用率%",
          class: "tabel-col-1",
          sortable: true,
        },
        procMem: {
          slot: false,
          lable: "内存使用率%",
          class: "tabel-col-1",
          sortable: true,
        },
        procId: {
          slot: false,
          lable: "进程ID",
          class: "tabel-col-1",
          sortable: true,
        },
        handle:{
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        }
      },
      multipleSelection: [],
      value1: "",
      pageInfo: null,
      curPage: 1,
      pageSize: 10,
      sortKey: "",
      sortType: "",
      timer: null,
    };
  },
  created() {
    if (this.$store.state.yqInfo.connectedStu) {
      this.resetKey();
    }
  },
  mounted() {
    //定时任务方法
    this.timer = setInterval(this.searchKey, 10000);

  },
  beforeDestroy() {
    if (this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); //关闭
    }
  },
  methods: {
    checkDetail(item){
      this.$emit("showDetail", item);
      console.log("查看详情啊",item)
    },
    sortClick(e) {
      this.sortKey = e.sortKey;
      this.sortType = e.sortType;
      this.getSoftList();
    },
    resetKey() {
      this.curPage = 1;
      this.softName = "";
      this.procPath = "";
      this.getSoftList();
    },
    searchKey() {
      this.curPage = 1;
      this.getSoftList();
    },
    curPageChange(e) {
      this.curPage = e;
      this.getSoftList();
    },
    getSoftList() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        page_no: this.curPage,
        page_size: this.pageSize,
        procName: this.softName,
        procPath: this.procPath,
        sortBy: this.sortKey,
        sortType: this.sortType,
      };
      this.$api
        .getServerAction("/insight/softwareMonitor/softwareList", pams)
        .then((res) => {
          if (res.code == 200) {
            // console.log("获取到的软件列表信息", res);
            this.$emit("resetTop")
            this.tableData = res.data.items;
            this.pageInfo = res.data.page;
          } else {
            this.tableData = [];
            this.pageInfo = null;
          }
        });
    },
  },
};
</script>
<style  scoped>
.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-box {
  display: flex;
  padding: 16px;
  align-items: center;
}
.input-label {
  margin-right: 16px;
}
.input-con {
  margin-right: 32px;
}
</style>
