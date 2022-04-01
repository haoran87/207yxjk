<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div class="input-box" ref="topCon">
        <div class="input-label">标题:</div>
        <div class="input-con">
          <tis-input v-model="name" placeholder="请输入标题"></tis-input>
        </div>
        <div class="input-label">类型:</div>
        <div class="input-con">
          <select-dict
            v-model="type"
            placeholder="请选择类型"
            type="faultType"
          ></select-dict>
        </div>
        <tis-button type="primary" @click="searchKey">查 询</tis-button>
        <tis-button type="info" @click="resetKey">重 置</tis-button>
        <tis-button type="primary" @click="addForm">添 加</tis-button>
        <tis-button type="danger" @click="deleteByIds">删 除</tis-button>
        <tis-button type="primary" @click="importExcel">导 入</tis-button>
        <tis-button type="primary" @click="excelDownload">模板下载</tis-button>
        <tis-button type="primary" @click="exportExcel">导 出</tis-button>
      </div>
      <div style="margin: 0px 16px" v-if="topHeight > 0">
        <self-table
          ref="selfTable"
          :tableData="tableData"
          :tableObj="tableObj"
          checkable="true"
          :tableHeight="$store.state.yqInfo.MAINHEIGHT - topHeight - 48"
        >
          <template v-slot:type="props">
            <span v-if="props.cellValue == '0'">软件知识</span>
            <span v-else-if="props.cellValue == '1'">硬件知识</span>
            <span v-else-if="props.cellValue == '2'">业务运维</span>
            <span v-else-if="props.cellValue == '3'">常见故障</span>
          </template>
          <template v-slot:create_time="props">
            {{ props.cellValue | fd }}
          </template>
          <template v-slot:update_time="props">
            {{ props.cellValue | fd }}
          </template>
          <template v-slot:handle="props">
            <div class="selected-color">
              <span @click="showDetail(props.cellData)">查看策略</span
              >{{ "&nbsp;" }}
              <span @click="editForm(props.cellData)">编 辑</span>{{ "&nbsp;" }}
              <span @click="deleteInfo(props.cellData)">删 除</span>
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
      <!-- <div style="height: 100px"></div> -->
    </box-show>
    <tis-dialog
      append-to-body
      :title="form.isShow ? '新建知识库' : '修改知识库'"
      :visible.sync="showPop"
      width="80%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div v-if="showPop">
        <fault-form
          ref="faultform"
          :form="form"
          :fileList="fileList"
          :showPop="showPop"
          @page="page"
        ></fault-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="close">取 消</tis-button>
        <tis-button type="primary" @click="submit">确 定</tis-button>
      </span>
    </tis-dialog>

    <!-- <pop :popTitle="form.isShow ? '新建知识库' : '修改知识库'" :isShow="showPop" @close="close" @confirm="submit">
			<fault-form ref="faultform" :form="form" :fileList="fileList" :showPop="showPop" @page="page"></fault-form>
		</pop> -->
    <import-excel
      :action="action"
      :href="href"
      :showImport="showImport"
      :showModuleDown="true"
      @page="page"
      @close="closeImport"
      :tipText="'只能上传.xlsx,.xls文件'"
      :suffix="'.xlsx,.xls'"
      ref="importExcel"
    ></import-excel>
  </div>
</template>

<script>
import { formatDate } from "@/utils/util";
import FaultForm from "./fault-form";
import ImportExcel from "../../page/importExcel";
export default {
  components: {
    ImportExcel, //导入功能页面
    FaultForm, //表单页面
  },
  data() {
    return {
      //导入功能地址
      action: "/insight/faultKnowledge/importExcel",
      //导出模板地址
      href:
        this.$store.state.yqInfo.serverIp +
        "/insight/template/download/" +
        "故障知识库模板.xlsx",
      //导入页面显示/隐藏
      showImport: false,
      //添加修改页面的显示/隐藏
      showPop: false,
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      name: "", //标题
      type: "", //类型
      tableData: [],
      tableObj: {
        name: {
          slot: false,
          lable: "标题",
          class: "tabel-col-3",
          sortable: false,
        },
        /* create_person: {
          slot: true,
          lable: "创建人",
          class: "tabel-col-1",
          sortable: false,
        },*/
        type: {
          slot: true,
          lable: "类型",
          class: "tabel-col-1",
          sortable: false,
        },
        create_time: {
          slot: true,
          lable: "创建时间",
          class: "tabel-col-2",
          sortable: false,
        },
        update_time: {
          slot: true,
          lable: "更新时间",
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
      fileList: [], //附件信息
      form: {}, //故障知识库基本信息
      topHeight: 0,
    };
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
  mounted() {
    //获取top高度值
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.topHeight = rect.height;
  },
  methods: {
    excelDownload() {
      if (this.$platform.type === "pad") {
        this.$syberh.download.start({
          url: this.href,
          name: "故障知识库模板.xlsx",
          success: function (result) {
            if (result.status === "3") {
              this.$message.success("下载成功，文件路径：" + result.path);
            }
            // console.log("success", result.path);
          },
          fail: function (error) {
            this.$message.error("下载失败：" + error.msg);
            // console.log("fail: ", error.code, error.msg);
          },
        });
      } else {
        window.location.href = this.href;
      }
    },
    closeImport() {
      this.showImport = false;
    },
    //导入
    importExcel() {
      this.$refs.importExcel.init();
      this.showImport = true;
    },
    //导出
    exportExcel() {
      if (this.tableData.length == 0) {
        this.$message.error("导出内容不能为空!");
        return;
      }
      let url =
        this.$store.state.yqInfo.serverIp +
        "/insight/faultKnowledge/exportExcel?" +
        "name=" +
        this.name +
        "&type=" +
        this.type;
      if (this.$refs.selfTable.idData.length > 0) {
        url =
          this.$store.state.yqInfo.serverIp +
          "/insight/faultKnowledge/exportExcel?ids=" +
          JSON.stringify(this.$refs.selfTable.idData);
      }
      window.location.href = url;
    },
    //通过ID删除指定信息
    deleteByIds() {
      if (this.$refs.selfTable.idData.length == 0) {
        this.$message.error("请至少选择一项内容！");
        return;
      }
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/faultKnowledge/deleteByIds", {
              ids: JSON.stringify(this.$refs.selfTable.idData),
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.$refs.selfTable.initChoose();
                this.page();
              } else {
                this.$message.warning("删除失败！");
              }
            });
          this.$refs.selfTable.initChoose();
        },
      });
    },
    /**
     * 取消弹出框
     */
    close() {
      this.showPop = false;
    },
    //提交
    submit() {
      this.$refs.faultform.submit();
    },
    /**
     * 添加
     */
    addForm() {
      this.form = {};
      this.showPop = true;
      this.form = {
        id: this.uuid(),
        isShow: true,
      };
      this.fileList = [];
    },
    /**
     * 修改
     * @param item
     */
    editForm(item) {
      this.fileList = [];
      this.form = {};
      this.$api
        .getServerAction("/insight/attachment/getFileList", {
          relation_id: item.id,
        })
        .then(
          (res) => {
            if (res.code == 200) {
              this.showPop = true;
              item.isShow = false;
              //利用JSON进行深拷贝  解决在表单中修改数据，table表格的数据也跟着修改的问题
              this.form = JSON.parse(JSON.stringify(item));
              for (let i = 0; i < res.data.length; i++) {
                this.fileList.push({
                  name: res.data[i].filename,
                  id: res.data[i].id,
                  url:
                    this.$store.state.yqInfo.serverIp +
                    "/insight/attachment/download" +
                    "/" +
                    res.data[i].filename,
                });
              }
            }
          },
          function () {
            // errorFunc(error, self.$message);
          }
        );
    },
    //获取uuid
    uuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      s[8] = s[13] = s[18] = s[23];

      this.uuidA = s.join("");
      console.log(s.join(""), 's.join("")');
      return this.uuidA;
    },
    /**
     * 删除
     *
     * @param item
     */
    deleteInfo(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/faultKnowledge/delete", {
              id: item.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.page();
              } else {
                this.$message.warning("删除失败！");
              }
            });
          this.$refs.selfTable.initChoose();
        },
      });
    },
    /**
     * 查看
     *
     * @param item
     */
    showDetail(item) {
      this.$emit("showDetail", item);
    },
    /**
     * 搜索
     */
    searchKey() {
      this.curPage = 1;
      this.page();
    },
    /**
     * 重置
     */
    resetKey() {
      this.curPage = 1;
      this.name = "";
      this.type = "";
      this.page();
    },
    /**
     * 页面切换
     * @param e
     */
    curPageChange(e) {
      this.curPage = e;
      this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
      this.page();
    },
    /**
     * 分页查询
     */
    page() {
      this.close();
      this.$yqLoading.show();
      let path = "/insight/faultKnowledge/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        name: this.name,
        type: this.type,
      };
      this.$api.getServerAction(path, params).then(
        (res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            let tem = [];
            this.tableData = tem.concat(res.data.items);
            this.pageInfo = res.data.page;
          }
        },
        function () {
          // errorFunc(error, self.$message);
        }
      );
      if(this.$refs.selfTable){
        this.$refs.selfTable.initChoose();
      }
      
    },
  },
};
</script>

<style lang="scss" scoped>
.input-item {
  display: flex;
  align-items: center;
}
</style>
