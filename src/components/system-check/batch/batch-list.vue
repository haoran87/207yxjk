<template >
  <div>
    <div>
      <div  ref="topCon" style="height:100%">
        <div  class="flex" style="margin-bottom: 8px">
          <el-tag> 总数：{{ batchCount.total }} </el-tag>
          <el-tag type="success"> 已完成：{{ batchCount.complete }} </el-tag>
          <el-tag type="danger"> 未完成：{{ batchCount.notComplete }} </el-tag>
          <el-tag type="warning" class="open-color">
            请求成功：{{ batchCount.success }}
          </el-tag>
          <el-tag type="danger"> 请求失败：{{ batchCount.fail }} </el-tag>
        </div>
        <div class="flex">
          <tis-select
            v-model="batchId"
            placeholder="请选择"
            style="margin-right: 15px"
            @change="changeBathId()"
          >
            <tis-option
              v-for="item in options"
              :key="item.id"
              :label="item.code"
              :value="item.id"
            >
            </tis-option>
          </tis-select>
          <tis-button type="primary" @click="going">一键执行</tis-button>
          <tis-button type="primary" @click="refresh">刷 新</tis-button>
          <tis-button type="primary" @click="show">导 入</tis-button>
          <tis-button type="primary" @click="excelDownload"
            >模板下载</tis-button
          >
          <tis-button type="primary" @click="exportExcel">导 出</tis-button>
        </div>
      </div>
      <div v-if="tableHeight > 0" style="margin-top: 16px">
        <self-table
          ref="selfTable"
          :tableData="tableData"
          :tableObj="tableObj"
          :checkable="false"
          :tableHeight="tableHeight"
        >
          <template v-slot:success="props">
            <span v-if="props.cellValue == 'true'" class="open-color"
              >成功</span
            >
            <span v-else-if="props.cellValue == 'false'" class="close-color"
              >失败</span
            >
            <span v-else></span>
          </template>

          <template v-slot:handle="props">
            <div class="selected-color">
              <span @click="editBatch(props.cellData)">编 辑</span
              >{{ "&nbsp;" }} <span @click="see(props.cellData)">查 看</span
              >{{ "&nbsp;" }}
              <span @click="deleteBatch(props.cellData.id)">删 除</span>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableHeight: 0,
      //接口信息
      formCron: {
        id: "",
        paramList: [
          {
            key: "",
            value: "",
          },
        ],
        headerList: [
          {
            key: "",
            value: "",
          },
        ],
      },
      batchCount: {},//统计各种数量
      options: [],//批次信息
      batchId: "",//批次ID
      classId: "",//分类ID
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      tableData: [],//列表信息
      tableObj: {
        name: {
          slot: false,
          lable: "接口名称",
          class: "tabel-col-2",
          sortable: false,
        },
        method_type: {
          slot: false,
          lable: "请求方式",
          class: "tabel-col-1",
          sortable: false,
        },
        params: {
          slot: false,
          lable: "参数",
          class: "tabel-col-2",
          sortable: false,
        },
        description: {
          slot: false,
          lable: "接口说明",
          class: "tabel-col-2",
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
      //模板地址
      href:
        this.$store.state.yqInfo.serverIp +
        "/insight/template/download/接口信息导入.xlsx",
    };
  },
  created() {},
  mounted() {
     this.tableHeight =
       this.$store.state.yqInfo.MAINHEIGHT - 55 - 90 - 8 - 48;
  },
  methods: {
    //模板导出
    excelDownload() {
      window.location.href = this.href;
    },
    //编辑接口信息
    editBatch(form) {
      this.formCron = {};
      this.formCron = JSON.parse(JSON.stringify(form));
      if (form.params != "") {
        let dataObj = JSON.parse(form.params);
        let params = [];
        for (let d in dataObj) {
          let a = {};
          a["key"] = d;
          a["value"] = dataObj[d];
          params.push(a);
        }
        this.formCron.paramList = params;
      } else {
        this.formCron.paramList = [{ key: "", value: "" }];
      }

      if (form.headers != "") {
        let headerObj = JSON.parse(form.headers);
        let headers = [];
        for (let key in headerObj) {
          let a = {};
          a["key"] = key;
          a["value"] = headerObj[key];
          headers.push(a);
        }
        this.formCron.headerList = headers;
      } else {
        this.formCron.headerList = [{ key: "", value: "" }];
      }
      this.formCron.checkType = "1";
      this.$emit("showDetail", this.formCron);
    },
    //删除
    deleteBatch(id) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheckBatch/deleteBatch", {
              id: id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！")
                this.page();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    //刷新
    refresh() {
      this.page();
    },
    //导出
    exportExcel() {
      if (this.classId == "") {
        this.$message.error("请选择所属分类!");
        return;
      }
      let message = "确认导出全部的信息？";
      let url =
        this.$store.state.yqInfo.serverIp +
        "/insight/systemCheckBatch/exportExcel?batchId=" +
        this.batchId +
        "&classId=" +
        this.classId +
        "&exportAll=" +
        true;

      this.$yqAlert({
        content: message,
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          window.location.href = url;
          this.$yqLoading.hide();
        },
      });
    },
    //查看
    see(data) {
      this.$emit("showBatchLook", data);
    },
    //一件执行
    going() {
      if (this.classId == "") {
        this.$message.error("请选择所属分类!");
        return;
      }
      this.$yqAlert({
        content: "确认执行？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheckBatch/batchImplement", {
              batchId: this.batchId,
              classId: this.classId,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("执行操作中,稍后刷新页面！");
                this.page(this.classId);
              }
            });
        },
      });
    },
    //改变时进行查询操作
    changeBathId() {
      this.page();
    },
    //获取批次信息
    getBatch(classId) {
      this.$yqLoading.show();
      this.classId = classId;
      this.$api
        .getServerAction("/insight/systemCheckBatch/findBatchInfo", {
          classId: this.classId,
        })
        .then((res) => {
          // console.log("执行一下啊啊啊啊", res);
          this.$yqLoading.hide();
          if (res.code == 200 && res.data.length > 0) {
            this.options = res.data;
            this.batchId = res.data[0].id;
            this.page();
          } else {
            this.batchId = "";
            this.options = [];
            this.tableData = [];
            this.pageInfo = null;
            this.batchCount = {};
          }
        });
    },
    //查询数据
    page() {
      if (this.classId == "") {
        this.$message.error("请选择所属分类!");
        return;
      }
      if (this.batchId != "") {
        this.$yqLoading.show();
        let path = "/insight/systemCheckBatch/page";
        let params = {
          page_no: this.curPage,
          page_size: this.pageSize,
          batchId: this.batchId,
          classId: this.classId,
        };
        this.$api.getServerAction(path, params).then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.tableData = res.data.items;
            this.pageInfo = res.data.page;
            this.batchTotal();
          } else {
            this.$message.error(res.info);
            this.batchCount = {};
          }
        });
      } else {
        this.batchCount = {};
      }
    },
    //统计
    batchTotal() {
      if (this.batchId != "") {
        this.$yqLoading.show();
        let path = "/insight/systemCheckBatch/statistics";
        let params = {
          batchId: this.batchId,
          classId: this.classId,
        };
        this.$api.getServerAction(path, params).then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.batchCount = res.data;
          } else {
            this.$message.error(res.info);
          }
        });
      }
    },
    //导入弹出框
    show() {
      if (this.classId == "") {
        this.$message.error("请选择所属分类!");
        return;
      }
      this.$emit("showImports");
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.page();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
