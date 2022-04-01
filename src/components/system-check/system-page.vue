<template>
  <div>
    <div v-show="showData == '1'">
      <tis-row class="tac">
        <tis-col :span="5">
          <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
            <div style="padding: 0 10px">
              <div class="flex-between" style="font-size: 14px">
                <div>分 类</div>
                <tis-button type="text" @click="editTab()">编辑</tis-button>
              </div>
              <div>
                <div>
                  <tis-tree
                      ref="classTree"
                      :data="classData"
                      :props="defaultProps"
                      node-key="id"
                      :current-node-key="classId"
                      :highlight-current="true"
                      @node-click="handleNodeClick"
                  >
                  </tis-tree>
                </div>
              </div>
            </div>
          </box-show>
        </tis-col>
        <tis-col :span="19">
          <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
            <div style="margin: 0 8px">
              <tis-tabs v-model="activeName" @tab-click='tabClick'>
                <tis-tab-pane label="定时任务" name="first">
                  <cron-list
                      @showDetail="showDetail"
                      @showHistoryDetail="showHistoryDetail"
                      @showLook="showLook"
                      ref="child"
                  ></cron-list>
                </tis-tab-pane>
                <tis-tab-pane
                    label="立即执行"
                    name="second"
                >
                  <immediately-list
                      ref="immediately"
                      :classId="classId"
                  ></immediately-list>
                </tis-tab-pane>
                <tis-tab-pane
                    label="批量执行"
                    name="third"
                    style="height: 100%"
                >
                  <batch-list
                      @showImports="showImports"
                      ref="batchPage"
                      @showDetail="showDetail"
                      @showBatchLook="showBatchLook"
                  ></batch-list>
                </tis-tab-pane>
              </tis-tabs>
            </div>
          </box-show>
        </tis-col>
      </tis-row>
    </div>
    <div v-show="showData == '2'">
      <cron-look :data="lookData" @showFalse="showFalse"></cron-look>
    </div>
    <div v-show="showData == '3'">
      <batch-look :data="batchData" @showFalse="showBatchFalse"></batch-look>
    </div>
    <!-- 分类编辑 -->
    <edit-class ref="editClass" :classData="classData"></edit-class>
    <!-- 历史信息 -->
    <history-dialog ref="historyDialog"></history-dialog>
    <!-- 历史记录 -->
    <history-detail ref="historyDetail" @jsonClick="jsonClick"></history-detail>
    <!-- 接口信息 编辑 -->
    <cron-edit ref="cronEdit"></cron-edit>

    <!--    导入信息-->
    <import-excel
        :action="action"
        :data="dataImport"
        :showImport="showImport"
        :showModuleDown="true"
        @page="pageImport"
        :suffix="'.xlsx,.xls'"
        @close="closeImport"
        ref="importExcel"
    ></import-excel>

    <!--查看json格式数据-->
    <tis-dialog
        append-to-body
        title="json数据展示"
        :visible.sync="jsonShow"
        :modal-append-to-body="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :style="$store.state.yqInfo.dialogBg"
    >
      <div style="text-align: left">
        <json-viewer
            :value="jsonMessage"
            v-if="isJson"
            sort
            theme="my-awesome-json-theme"
        ></json-viewer>
        <div v-else>
          {{ this.jsonMessage }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="jsonClose">关 闭</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
import CronList from "./cron/cron-list.vue";
import CronLook from "./cron/cron-look";
import {formatDate} from "@/utils/util";
import ImmediatelyList from "./immediately-list";
import BatchList from "./batch/batch-list";
import ImportExcel from "../page/importExcel";
import BatchLook from "./batch/batch-look";
import JsonViewer from "vue-json-viewer";
import EditClass from "./system-dialog/edit-class.vue";
import HistoryDialog from "./system-dialog/history-dialog.vue";
import HistoryDetail from "./system-dialog/history-detail.vue";
import CronEdit from './system-dialog/cron-edit.vue';

export default {

  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  components: {
    BatchLook,
    BatchList,
    ImmediatelyList,
    CronLook,
    CronList,
    ImportExcel,
    JsonViewer,//json展示组件
    EditClass,
    HistoryDialog,
    HistoryDetail,
    CronEdit,//cron表达式组件
  },
  data() {
    return {
      jsonMessage: "", //json数据
      jsonShow: false, //json数据弹出框展示
      checkDefault: [], //默认选中
      action: "/insight/systemCheckBatch/importExcel",//导入地址
      showImport: false,//导入信息弹窗口
      //导入参数
      dataImport: {
        key: "classId",
        value: "",
      },
      classData: [],//分类信息
      isJson: false,//展示json数据
      showData: "1",//tab展示
      activeName: "first",//标签页点击事件
      lookData: {},//接口信息
      batchData: {},//批量执行信息
      defaultProps: {
        label: "name",
      },
      classId: "",//分类id
    };
  },
  created() {
    //列表查询
    this.page();
  },

  methods: {
    //定时任务查看
    showDetail(form) {
      this.$refs.cronEdit.showDetail(form)
    },
    //历史记录查询
    showHistoryDetail(id) {
      this.$refs.historyDialog.showHistoryDetail(id);
    },
    //查看历史信息
    checkHistoryInfo(e, rd) {
      this.$refs.historyDetail.resultData = rd;
      this.$refs.historyDetail.cronJob = e;
      this.$refs.historyDetail.showResult = true;
    },
    //关闭json展示弹框
    jsonClose() {
      this.jsonShow = false;
      this.jsonMessage = "";
    },
    //打开json展示弹框
    jsonClick(message) {
      this.jsonShow = true;
      try {
        var obj = JSON.parse(message);
        this.jsonMessage = obj;
        this.isJson = true;
      } catch (e) {
        console.log(e, "捕获错误345");
        this.jsonMessage = message;
        this.isJson = false;
      }
    },
    //关闭导入功能
    closeImport() {
      this.showImport = false;
    },

    //分类点击
    handleNodeClick(hd) {
      if (this.classId != hd.id) {
        this.$refs.immediately.clearForm();
        this.$refs.immediately.clearResult();
      }
      this.classId = hd.id;
      this.dataImport.value = hd.id;
      this.tabClick()

    },
    //导入信息查询
    pageImport() {
      this.$refs.batchPage.getBatch(this.classId);
    },
    //接口信息查看
    showLook(sld) {
      this.lookData = sld;
      this.showData = "2";
    },
     //批量信息查看
    showBatchLook(sbd) {
      this.batchData = sbd;
      this.showData = "3";
    },
    //接口信息查看关闭
    showFalse() {
      this.lookData = {};
      this.showData = "1";
      this.$refs.child.page(this.classId);
    },
    //批量信息查询
    showBatchFalse() {
      this.batchData = {};
      this.showData = "1";
      this.$refs.batchPage.page();
    },

    //批量执行导入
    showImports() {
      if (this.dataImport.value == "") {
        this.$message.error("请选择所属分类!");
        return;
      }
      this.showImport = true;
    },
     //编辑分类
    editTab() {
      this.$refs.editClass.editClass = true;
    },
    //标签点击事件
    tabClick() {

      if (this.activeName === 'third') {
        this.pageImport()
      } else if (this.activeName === "first") {
        this.$refs.child.page(this.classId);
      } else if (this.activeName === 'second') {
        console.log("标签页点击啊啊", this.activeName)
      }

    },
    //分类展示
    page() {
      this.$yqLoading.show();
      let path = "/insight/systemCheckClass/list";
      this.$api.getServerAction(path).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.classData = res.data;
          this.checkDefault = res.data[0].id;
          if (this.classId === "") {
            this.handleNodeClick(res.data[0]);
          }
          this.$nextTick(() => {
            this.$refs.classTree.setCurrentKey(this.classId);
          });
        }
      });
    },
  },
};
</script>

<style>
.el-tree-node.is-current > .el-tree-node__content {
  background-color: gray !important;
}

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
  width: 23%;
}

table {
  width: 100%;
  /* height: 200px; */
  /* border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是像在标准的HTML中那样分开显示 */
  /* separate：默认值，边框会分开 */
  /* collapse: 如果可能，边框会合并为单一的边框 */
  border-collapse: collapse;
}

.config-btn {
  cursor: pointer;
}

.config-btn:hover {
  color: var(--hover-color);
}
</style>
