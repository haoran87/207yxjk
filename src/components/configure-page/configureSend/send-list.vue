<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div class="input-box">
        <div class="input-label">配置名称</div>
        <div class="input-con">
          <tis-input v-model="name" placeholder="请输入标题"></tis-input>
        </div>
        <div class="input-label">配置类型</div>
        <div class="input-con">
          <select-dict
            v-model="type"
            placeholder="请选择类型"
            type="configureType"
          ></select-dict>
        </div>
        <tis-button type="primary" @click="searchKey">查询</tis-button>
        <tis-button type="info" @click="resetKey">重置</tis-button>
        <!-- <tis-button type="primary" @click="addForm">新建</tis-button> -->
        <tis-badge :value="dataNumber" class="item" style="margin-left: 10px">
          <tis-button type="primary" @click="issue">待审核</tis-button>
        </tis-badge>
      </div>
      <div
        :style="{
          height: $store.state.yqInfo.MAINHEIGHT - 56 - 48 + 'px',
          'overflow-y': 'scroll',
        }"
      >
        <div class="plugin-row">
          <div class="plugin-item plugin-add" @click="addForm">
            <plugin-add-icon></plugin-add-icon>
            <div style="margin-top: 16px">新建配置</div>
          </div>
          <div class="plugin-item" v-for="(p, idx) in pluginList" :key="idx">
            <send-item
              @page="page"
              @showList="showList"
              :pluginItem="p"
              @edit="edit"
            ></send-item>
          </div>
        </div>
      </div>
      <list-page
        :pageInfo="pageInfo"
        :curPage="curPage"
        @cpc="curPageChange"
        :pageSize="pageSize"
      ></list-page>
    </box-show>
    <!-- 添加页面   -->
    <tis-dialog
      :title="popTitle"
      :visible.sync="showPop"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      width="70%"
    >
      <send-form
        ref="noticeform"
        :form="form"
        :showPop="showPop"
        @page="page"
        @close="closePop"
      ></send-form>
    </tis-dialog>
    <!-- 下发审核页面 -->
    <tis-dialog
      title="下发审核"
      width="70%"
      :visible.sync="showIssue"
      append-to-body
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <issue-list
        ref="issueList"
        :active="3"
        status="1"
        :show="false"
        @examine="examine"
        @closeIssue="closeIssue"
      ></issue-list>
      <div style="height: 16px"></div>
    </tis-dialog>
    <!--    审核页面-->
    <tis-dialog
      title="审核"
      append-to-body
      :visible.sync="showExamine"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      style="background-color: rgba(150, 149, 149, 0.8)"
    >
      <tis-form style="margin-top: 10px">
        <tis-form-item style="width: 100%" prop="url" label="审核原因">
          <tis-input
            placeholder="请输入审核原因，审核失败时必填！"
            type="textarea"
            :rows="8"
            v-model="message"
          ></tis-input>
        </tis-form-item>
      </tis-form>
      <span slot="footer" class="dialog-footer">
        <tis-button type="primary" @click="closeExamine">关闭</tis-button>
        <tis-button type="primary" @click="submitExamine('0')"
          >审核成功</tis-button
        >
        <tis-button type="danger" @click="submitExamine('1')">驳回</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
import sendItem from "./send_item";
import pluginAddIcon from "../../monitor-page/monitor-components/plugin-add-icon.vue";
import sendForm from "./send-form";
import IssueList from "./issue-list";

export default {
  components: {
    sendItem,
    sendForm,
    IssueList,
    pluginAddIcon,
  },
  data() {
    return {
      curPage: 1,
      dataNumber: 0,//审核数量
      pageSize: 12,
      pageInfo: null,
      showPop: false,//基本信息页面
      showExamine: false,//审核页面
      showIssue: false,//下发审核页面
      form: {},//下发基本信息
      popTitle: "",//标题
      message: "",//审核内容
      name: "",//配置名称
      type: "",//配置类型
      id: "",
      sendId: "",//下发ID
      pluginList: [],//列表信息
    };
  },
  created() {
    //列表查询
    this.page();
    //获取待审核的数量
    this.getDataNumber();
  },
  methods: {
    //关闭弹框
    closeDialog() {
      this.$refs.noticeform.up("1");
    },
    //审核信息
    examine(id) {
      this.showExamine = true;
      this.sendId = id;
    },
    //审核功能
    submitExamine(sum) {
      if (sum == "1" && this.message == "") {
        this.$message.error("审核不成功原因不能为空!");
        return;
      }
      this.$yqLoading.show();
      let path = "/insight/configureSend/examineSendById";
      let params = {
        id: this.sendId,
        status: sum,
        message: this.message,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.$message.success("操作成功！");
          this.closeExamine();
          this.$refs.issueList.submit();
        } else {
          this.$message.error("操作失败！");
        }
      });
    },
    //关闭审核功能
    closeExamine() {
      this.showExamine = false;
    },
    //获取待审核的数量
    getDataNumber() {
      this.$yqLoading.show();
      let path = "/insight/sendRecord/pageByStatus";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.dataNumber = res.data.page.total_count;
        }else{
          this.$message.error(res.info)
        }
      });
    },
    /**
     * 添加
     */
    addForm() {
      this.disabled = false;
      this.form = {};
      this.form = JSON.parse(JSON.stringify(this.form));
      this.popTitle = "添加配置下发信息";
      this.showPop = true;
    },
    showList(id) {
      this.$emit("showDetail", id);
    },
    /**
     *编辑
     */
    edit(item) {
      this.popTitle = "修改配置下发信息";
      this.form = {};
      this.disabled = false;
      this.form = JSON.parse(JSON.stringify(item));
      this.showPop = true;
    },
    issue() {
      this.showIssue = true;
    },
    submit(sum) {
      this.$refs.noticeform.submit(sum);
    },
    /**
     * 分页
     * @param e
     */
    curPageChange(e) {
      this.curPage = e;
      this.page();
    },
    /**
     * 取消弹出框
     */
    closePop() {
      this.showPop = false;
      this.getDataNumber();
    },
    closeIssue() {
      this.showIssue = false;
      this.getDataNumber();
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
     * 分页查询
     */
    page() {
      this.$yqLoading.show();
      let path = "/insight/configureSend/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        name: this.name,
        type: this.type,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          let tem = [];
          this.pluginList = tem.concat(res.data.items);
          this.pageInfo = res.data.page;
          this.getDataNumber();
        } else {
          this.$message.error(res.info);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.plugin-item{
  min-height: 218px;
}
.yqxxkjPad {
  .plugin-item {
    min-height: 168px;
  }
}
</style>
