<template>
  <div>
    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
      <div >
        <div class="input-box">
          <div class="input-label">模板名称:</div>
          <div class="input-con">
            <tis-input v-model="name" placeholder="请输入模板名称"></tis-input>
          </div>
          <tis-button type="primary"  @click="search">查 询</tis-button>
          <tis-button type="info"  @click="clean">重 置</tis-button>
          <tis-button type="primary"  @click="addForm">添 加</tis-button>
          <tis-button type="danger"  @click="deleteByIds">删 除</tis-button>
        </div>
        <div style="margin:  0 16px">
          <self-table
              ref="selfTable"
              :tableData="tableData"
              :tableObj="tableObj"
              checkable="true"
              :tableHeight='$store.state.yqInfo.MAINHEIGHT - 56 - 48 '
          >
            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
                <span class="selected-color"  @click="exportFile($store.state.yqInfo.serverIp +'/insight/attachment/download/'+props.cellData.file_name)">下 载</span>{{ "&nbsp;" }}
                <span @click="sendForm(props.cellData)">下 发</span>{{ "&nbsp;" }}
                <span @click="editForm(props.cellData)">编 辑</span>{{ "&nbsp;" }}
                <span @click="deleteTemplate(props.cellData)">删 除</span>
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

    </box-show>
    <tis-dialog
        append-to-body
        :title="popTitle"
        :visible.sync="showPop"
        :modal-append-to-body='false'
        :close-on-click-modal='false'
        :close-on-press-escape=' false'
        width="60%"
    >
      <notice-form
          append-to-body
          ref="noticeform"
          :form="form"
          :showPop="showPop"
          :pluginObj="pluginObj"
          @page="page"
      ></notice-form>
      <span slot="footer" class="dialog-footer">
		     <tis-button @click="closePop">取 消</tis-button>
		     <tis-button type="primary" @click="submit">确 定</tis-button>
		   </span>
    </tis-dialog>
    <tis-dialog
        title="配置下发"
        :visible.sync="showIssue"
        :modal-append-to-body='false'
        :close-on-click-modal='false'
        :close-on-press-escape=' false'
        width="70%"
    >
      <send_form
          ref="issueForm"
          :form="message"
          :active="1"
          :showIssue="showIssue"
          @close="closeIssue"
      ></send_form>
    </tis-dialog>
  </div>
</template>

<script>
import {formatDate} from "@/utils/util";
import NoticeForm from "./template-form";
import send_form from "../configureSend/send-form";


export default {
  components: {
    send_form,
    NoticeForm,
  },
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      showPop: false,//基本信息弹框
      showIssue: false,//配置下发弹框
      disabled: false,
      name: null,
      form: {},//基本信息
      message: {},//基本信息
      tableObj: {
        name: {
          slot: false,
          lable: "模板名称",
          class: "tabel-col-2",
          sortable: false,
        },   type: {
          slot: false,
          lable: "文件类型",
          class: "tabel-col-1",
          sortable: false,
        },
        file_name: {
          slot: false,
          lable: "模板文件",
          class: "tabel-col-2",
          sortable: false,
        },
        describe: {
          slot: false,
          lable: "模板描述",
          class: "tabel-col-2",
          sortable: false,
        },
        create_time: {
          slot: true,
          lable: "创建时间",
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
      tableData: [],//列表信息
      popTitle: "",//标题
      url: {value: ''},
      pluginObj: {
        plugin: ""
      }
    };
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  created() {
    //列表查询
    this.page();
  },
  methods: {
    //导出文件信息
    exportFile(url){
      var a = document.createElement("a");
      let path=url.lastIndexOf('/')
      a.download=url.substr(path+1)
      a.href=url
      a.click();
    },
    /**
     * 配置下发
     * */
    sendForm(item){
      this.$yqLoading.show();
      this.$api
          .getServerAction("/insight/configureTemplate/existFile", {fileName: item.file_name})
          .then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
                if (res.data){
                  this.message={}
                  this.message.file_name=item.file_name
                  this.message.type=item.type
                  this.message.name=item.name
                  this.message.describe=item.describe
                  this.message.template=true
                  this.message=Object.assign({}, this.message)
                  this.showIssue=true
                }else{
                  this.$message.warning("模板文件不存在,请重新上传！");
                }
            } else {
              this.$message.error(res.info);
            }
          });
    },
    //配置下发关闭框
    closeIssue() {
      this.showIssue = false;
    },
    //保存
    submitIssue(sum) {
      this.$refs.issueForm.submit(sum);
    },
    //删除选择信息
    deleteByIds() {
      if (this.$refs.selfTable.idData.length == 0) {
        this.$message.error("请至少选择一项内容！");
        return
      }
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/configureTemplate/deleteBatch", {ids: JSON.stringify(this.$refs.selfTable.idData)})
              .then((res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success("删除成功！");
                  this.$refs.selfTable.initChoose()
                  this.page();
                } else {
                  this.$message.warning("删除失败！");
                }
              });
        },
      });
    },
    /**
     * 删除
     */
    deleteTemplate(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
              .getServerAction("/insight/configureTemplate/delete", {id: item.id})
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
    /**
     * 分页
     * @param e
     */
    curPageChange(e) {
      this.curPage = e;
      this.page();
    },
    showDetail(item) {
      this.form = {};
      this.showPop = true;
      this.form = item;
      this.disabled = true;
    },
    /**
     * 取消弹出框
     */
    closePop() {
      this.showPop = false;
    },
    submit() {
      this.$refs.noticeform.submit();
    },
    /**
     * 添加
     */
    addForm() {
      this.disabled = false;
      this.form = {};
      this.pluginObj= {
        plugin: ""
      }
      this.popTitle = "添加模板信息";
      this.showPop = true;
    },
    //修改
    editForm(item) {
      this.popTitle = "修改模板信息";
      this.form = {};
      this.disabled = false;
      this.form = JSON.parse(JSON.stringify(item));
      this.pluginObj= {
        plugin: this.form.file_name
      }
      this.showPop = true;
    },
    /**
     * 查询
     */
    search() {
      this.curPage = 1;
      this.page();
    },
    /**
     * 重置
     */
    clean() {
      this.curPage = 1;
      this.name = null;
      this.page();
    },
    /**
     * 分页查询
     */
    page() {
      this.showPop = false;
      this.$yqLoading.show();
      let path = "/insight/configureTemplate/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        name: this.name
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.tableData = res.data.items;
          this.pageInfo = res.data.page;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>



a:hover {cursor: default;}

</style>
