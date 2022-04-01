<template>
  <div>
    <!--   历史信息-->
    <tis-dialog
        title="历史记录"
        append-to-body
        :visible.sync="showHistory"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        fullscreen
    >
      <div
          ref="bodyCon"
          style="height: calc(100vh - 55px - 70px - 60px); overflow-y: scroll"
      >
        <div ref="topcon" class="input-box">
          <div class="input-label">选择时间</div>
          <div class="input-con">
            <tis-date-picker
                v-model="time"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
            >
              >
            </tis-date-picker>
          </div>
          <div class="input-label">返回</div>
          <div class="input-con">
            <tis-select style="width: 100%" v-model="success" clearable>
              <tis-option label="成功" value="true"></tis-option>
              <tis-option label="失败" value="false"></tis-option>
            </tis-select>
          </div>
          <tis-button type="primary" @click="searchH()">查 询</tis-button>
          <tis-button type="primary" @click="exportExcel()">导 出</tis-button>
          <tis-button type="primary" @click="deleteAll()">清 空</tis-button>
        </div>
        <div v-if="tableHeight">
          <self-table
              :tableHeight="tableHeight"
              ref="selfTable"
              :tableData="tableData"
              :tableObj="tableObj"
          >
            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:success="props">
              <span v-if="props.cellValue == 'true'" class="open-color"
              >成功</span
              >
              <span v-else class="close-color">失败</span>
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="seeData(props.cellData)">查 看</span
                >{{ "&nbsp;" }}
                <span @click="deleteData(props.cellData)">删 除</span
                >{{ "&nbsp;" }}
              </div>
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
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeHistory">关 闭</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
import {formatDate} from "@/utils/util";

export default {
  data() {
    return {
      showHistory: false,//历史记录开关
      requestId: "",//请求ID
      time: null,//时间
      success: "",//返回结果
      tableData: [],//历史记录列表信息
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      tableObj: {
        create_time: {
          slot: true,
          lable: "时间",
          class: "tabel-col-3",
          sortable: false,
        },
        code: {
          slot: false,
          lable: "状态",
          class: "tabel-col-1",
          sortable: false,
        },
        success: {
          slot: true,
          lable: "返回",
          class: "tabel-col-1",
          sortable: false,
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-2 handle-cell",
          sortable: false,
        },
      },
      tableHeight: 0,
    };
  },
  created() {
  },
  mounted() {
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    cleanSu() {
      this.success = "";
      this.getHistory();
    },
    //历史记录分页
    curPageChange(e) {
      this.curPage = e;
      this.getHistory();
    },
    //历史记录查看功能
    showHistoryDetail(id) {
      this.time = null;
      this.success = "";
      this.tableData = [];
      this.pageInfo = null;
      this.curPage = 1;
      this.requestId = id;
      this.getHistory();
      this.showHistory = true;
      this.$nextTick(() => {
        let rect = this.$refs.bodyCon.getBoundingClientRect();
        let toprect = this.$refs.topcon.getBoundingClientRect();
        this.tableHeight = rect.height - toprect.height - 48;
      });
    },
    searchH() {
      this.curPage = 1;
      this.getHistory();
    },
    //历史记录信息
    getHistory() {
      this.$yqLoading.show();
      var start_time = null;
      var end_time = null;
      if (this.time != null && this.time.length && this.time.length > 0) {
        start_time = formatDate(this.time[0]);
        end_time = formatDate(this.time[1]);
      }
      let path = "/insight/systemCheck/resultPage";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        requestId: this.requestId,
        start_time: start_time,
        end_time: end_time,
        success: this.success,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          let tem = [];
          this.tableData = tem.concat(res.data.items);
          this.pageInfo = res.data.page;
        } else {
          this.$message.error(res.info);
        }
      });
    },
    //历史记录关闭
    closeHistory() {
      this.showHistory = false;
    },
    exportExcel() {
      this.$yqLoading.show();
      var start_time = null;
      var end_time = null;

      if (this.time != null) {
        start_time = this.time[0].toLocaleDateString().replace(/\//g, "-");
        end_time = this.time[1].toLocaleDateString().replace(/\//g, "-");
      }
      let url =
          this.$store.state.yqInfo.serverIp +
          "/insight/systemCheck/exportCronExcel?cronId=" +
          this.requestId +
          "&success=" +
          this.success +
          "&start_time=" +
          start_time +
          "&end_time=" +
          end_time;
      window.location.href = url;
      this.$yqLoading.hide();
    },
    /**
     * 清空定时记录
     */
    deleteAll() {
      this.$yqAlert({
        content: "确认此操作？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/systemCheck/deleteAllCronJob", {
                requestId: this.requestId,
              })
              .then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success("操作成功！");
                  this.getHistory();
                } else {
                  this.$message.warning("操作失败！");
                }
              });
        },
      });
    },
    //删除历史记录
    deleteData(dd) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/systemCheck/deleteResult", {
                id: dd.id,
              })
              .then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success("删除成功！");
                  this.getHistory();
                } else {
                  this.$message.warning("删除失败！");
                }
              });
        },
      });
    },
    //指定ID的历史记录基本信息
    seeData(sd) {
      this.$api
          .getServerAction("/insight/systemCheckBatch/getCronJobById", {
            id: sd.request_id,
          })
          .then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$parent.checkHistoryInfo(res.data, sd);

            } else {
              this.$message.error(res.info);
            }
          });


    },
  },
};
</script>

<style>
</style>
