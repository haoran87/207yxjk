<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <div class="input-box">
      <div class="input-label">插件名称</div>
      <div class="input-con">
        <tis-input
          v-model="pluginName"
          placeholder="请输入插件名称"
        ></tis-input>
      </div>
      <tis-button type="primary" @click="searchKey">查询</tis-button>
      <tis-button type="info" @click="resetKey">重置</tis-button>
      <tis-button type="primary" @click="clearKey">清空</tis-button>
    </div>
    <div style="margin: 0px 8px">
      <!-- <table-component
        ref="selfTable"
        :tableData="tableData"
        :tableObj="tableObj"
        :tableHeight="$store.state.yqInfo.MAINHEIGHT - 72 - 16 - 32"
      >
        <template v-slot:create_time="props">
          {{ props.cellValue | fd }}
        </template>
        <template v-slot:handle="props">
          <span class="selected-color" @click="scanDetail(props.cellData)"
            >查看</span
          >
        </template>
      </table-component> -->
      <self-table
        ref="selfTable"
        :tableData="tableData"
        :tableObj="tableObj"
        :tableHeight="$store.state.yqInfo.MAINHEIGHT - 56 - 48"
      >
        <template v-slot:create_time="props">
          {{ props.cellValue | fd }}
        </template>
        <template v-slot:handle="props">
          <span class="selected-color" @click="scanDetail(props.cellData)"
            >查看</span
          >
        </template>
      </self-table>
    </div>
    <list-page
      :pageInfo="pageInfo"
      :curPage="curPage"
      :pageSize="pageSize"
      @cpc="curPageChange"
    ></list-page>
  </box-show>
</template>
<script>
import { formatDate } from "@/utils/util";
export default {
  data() {
    return {
      timer: null,
      isAll: false,
      pluginName: "",
      typeValue: "",
      stuValue: "",
      tableData: [],
      tableObj: {
        plugin_code: {
          slot: false,
          lable: "插件标识",
          class: "tabel-col-3",
          sortable: false,
        },
        name: {
          slot: false,
          lable: "插件名称",
          class: "tabel-col-3",
          sortable: false,
        },
        create_time: {
          slot: true,
          lable: "时间",
          class: "tabel-col-2",
          sortable: false,
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        },
      },
      pageInfo: null,
      pluginDate: "",
      curPage: 1,
      pageSize: 16,
    };
  },
  created() {
    this.getBasicDataList();
  },
  mounted() {
    //定时任务方法
    this.timer = setInterval(this.getBasicDataList, 10000);
  },
  beforeDestroy() {
    if (this.timer) {
      //如果定时器还在运行 或者直接关闭，不用判断
      clearInterval(this.timer); //关闭
    }
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    clearKey() {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/originData/clearOriginData")
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("操作成功！");
                this.getBasicDataList();
              } else {
                this.$message.warning("操作失败！");
              }
            });
        },
      });
    },
    curPageChange(e) {
      this.curPage = e;
      this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
      this.getBasicDataList();
    },
    getBasicDataList() {
      let params = {
        name: this.pluginName,
        page_no: this.curPage,
        page_size: this.pageSize,
        ip:this.$store.state.yqInfo.chooseIP
      };
      this.$api
        .getServerAction("/insight/originData/list", params)
        .then((res) => {
          // console.log("获取的原始数据", res.data);
          if (res.code == 200) {
            this.tableData = [];
            this.$nextTick(() => {
              this.tableData = res.data.items;
            });
            // console.log("哈哈哈啊哈",this.tableData[0])
            this.pageInfo = res.data.page;
          } else {
            this.tableData = [];
            this.pageInfo = null;
          }
        });
    },
    scanDetail(item) {
      this.$emit("showDetail", item);
    },
    searchKey() {
      this.curPage = 1;
      this.getBasicDataList();
    },
    resetKey() {
      this.curPage = 1;
      this.pluginName = "";
      this.getBasicDataList();
    },
  },
};
</script>
<style  scoped>

</style>
