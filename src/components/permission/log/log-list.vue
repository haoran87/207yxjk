<template>
  <div>
    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
      <div v-if="showLook" class="table-style">
        <div class="input-box">

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

          <div class="input-label">操作内容</div>
          <div class="input-con">
            <tis-input v-model="content" placeholder="请输入操作内容"></tis-input>
          </div>
          <tis-button type="primary" @click="searchKey">查 询</tis-button>
          <tis-button type="info" @click="resetKey">重 置</tis-button>
          <tis-button type="primary" @click="exportExcel">导 出</tis-button>
          <tis-button type="primary" @click="deleteAll">清 空</tis-button>
        </div>
        <div style="margin: 0 16px 0">
          <self-table
              ref="selfTable"
              :tableData="tableData"
              :tableObj="tableObj"
              @sortClick="sortClick"
              :tableHeight='$store.state.yqInfo.MAINHEIGHT - 56 - 48 '
          >
            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span @click="seeForm(props.cellData)">查 看</span>{{ "&nbsp;" }}
                <span @click="deleteLog(props.cellData)">删 除</span>
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
      <div v-else style="margin:0 16px" >
        <div style="height:10px"></div>
        <div class="info-title">
          <span>日志信息</span>
          <span @click="hideDetail">
          <icon :name="'back'" :size="'20'"></icon>
        </span>
        </div>

        <div style=" text-align: left;margin-top: 16px">
          <table class="altrowstable">
            <tr>
              <td class="altrowstable-left">所属功能</td>
              <td class="altrowstable-right">
                {{ data.related_function }}
              </td>
              <td class="altrowstable-left">操作人</td>
              <td class="altrowstable-right">
                {{ data.create_person }}
              </td>
            </tr>
            <tr>
              <td class="altrowstable-left">IP地址</td>
              <td class="altrowstable-right">{{ data.ip_path }}</td>
              <td class="altrowstable-left">创建时间</td>
              <td class="altrowstable-right">{{ data.create_time | fd }}</td>
            </tr>
            <tr>
              <td class="altrowstable-left">请求方法</td>
              <td colspan="5" style="text-align: left; padding: 0 8px">
                {{ data.method }}
              </td>
            </tr>
            <tr>
              <td class="altrowstable-left">操作内容</td>
              <td colspan="5" style="text-align: left; padding: 0 8px">
                {{ data.content }}
              </td>
            </tr>
          </table>
        </div>
      </div>
    </box-show>
  </div>
</template>

<script>

import {formatDate} from "@/utils/util";

export default {

  data() {
    return {
      time: null,//时间
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      content: "",//操作内容
      tableObj: {
        related_function: {
          slot: false,
          lable: "所属功能",
          class: "tabel-col-2",
          sortable: true,
        },
    /*    create_person: {
          slot: false,
          lable: "操作人",
          class: "tabel-col-2",
          sortable: false,
        },*/

        content: {
          slot: false,
          lable: "操作内容",
          class: "tabel-col-3",
          sortable: false,
        },
        ip_path: {
          slot: false,
          lable: "IP地址",
          class: "tabel-col-2",
          sortable: true,
        }, create_time: {
          slot: true,
          lable: "创建时间",
          class: "tabel-col-2",
          sortable: true,
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-1 handle-cell",
          sortable: false,
        },
      },
      tableData: [],//列表信息
      sortKey: "",//排序字段
      sortType: "",//排序方式
      data: {},//日志信息
      showLook: true//查看列表页面切换条件
    }
  },
  created() {
    //列表查询
    this.page();
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    //排序
    sortClick(e) {
      this.sortType = e.sortType;
      this.sortKey = e.sortKey;
      this.page();
    },
    //查看
    seeForm(data) {
      this.showLook = false
      this.data = data
    },
    //返回
    hideDetail() {
      this.data = {}
      this.showLook = true
    },
    //导出
    exportExcel() {

      this.$yqAlert({
        content: "确认导出？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          var start_time = "";
          var end_time = "";
          if (this.time != null && this.time.length && this.time.length > 0) {
            start_time = formatDate(this.time[0]);
            end_time = formatDate(this.time[1]);
          }
          let url = this.$store.state.yqInfo.serverIp +
              "/insight/log/exportExcel?content=" + this.content + "&start_time=" + start_time + "&end_time=" + end_time
          ;
          window.location.href=url;
          this.$yqLoading.hide();
        },
      });
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.page();
    },
    //查询
    searchKey() {
      this.curPage = 1;
      this.page();
    },
    //重置
    resetKey() {
      this.curPage = 1;
      this.content = "";
      this.time = null;
      this.page();
    },
    //删除指定信息
    deleteLog(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/log/deleteLog", {id: item.id})
              .then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success("删除成功！");
                  this.page();
                } else {
                  this.$message.warning("删除失败！");
                }
              });
        },
      });
    },
    //清空
    deleteAll() {
      this.$yqAlert({
        content: "确认清空？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/log/deleteAll")
              .then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success("操作成功！");
                  this.page();
                } else {
                  this.$message.warning(res.info);
                }
              });
        },
      });
    },
    //列表分页查询
    page() {
      this.$yqLoading.show();
      let path = "/insight/log/page";
      var start_time = null;
      var end_time = null;
      if (this.time != null && this.time.length && this.time.length > 0) {
        start_time = formatDate(this.time[0]);
        end_time = formatDate(this.time[1]);
      }
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        content: this.content,
        start_time: start_time,
        end_time: end_time,
        sortBy: this.sortKey,
        sortType: this.sortType,
      };
      //测试数据据
      // this.pluginList = getTestPlugin();
      this.$api.getServerAction(path, params).then(
          (res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.tableData = res.data.items;
              this.pageInfo = res.data.page;
            } else {
              this.$message.error(res.info)
            }
          },
          function () {
            // errorFunc(error, self.$message);
          }
      );
    },
  }
}
</script>

<style lang="scss" scoped>

table.altrowstable {
  font-size: var(--text-size-small);
  border: var(--status-bar-tools-border);
  border-collapse: collapse;
}

table.altrowstable th {
  padding: 8px;
  width: 25vh;
  border: var(--status-bar-tools-border);
  text-align: center;
}

table.altrowstable td {
  padding: 8px 0;
  height: 60px;
  border: var(--status-bar-tools-border);
  text-align: center;
}

.altrowstable-left {
  background: var(--layout-bg-3);
  width: 10%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  font-size: var(--text-size-small);
}

.back-btn {
  display: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
}

table {
  width: 100%;
  border-collapse: collapse;
}

.info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--pop-title-size);
}
.el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
  width:250px
}
</style>
