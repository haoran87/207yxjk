<template>
  <div>
    <box-show :style="{'height':$store.state.yqInfo.MAINHEIGHT+'px'}">
      <div class="table-style">
        <div class="input-box">
          <div class="input-label">IP名称:</div>
          <div class="input-con">
            <tis-input v-model="name" placeholder="请输入IP名称"></tis-input>
          </div>
          <tis-button type="primary" @click="search">查 询</tis-button>
          <tis-button type="info" @click="clean">重 置</tis-button>
          <tis-button type="primary" @click="addForm">添 加</tis-button>
          <tis-button type="danger" @click="deleteByIds">删 除</tis-button>
        </div>
        <div style="margin:0 16px">
          <self-table
              ref="selfTable"
              :tableData="tableData"
              :tableObj="tableObj"
              checkable="true"
              :tableHeight='$store.state.yqInfo.MAINHEIGHT - 56 - 48 '
          >
            <template v-slot:url="props">
              <span v-if="props.cellValue.length>30" @click="showUrl( props.cellValue )">
                {{ props.cellValue }}
              </span>
              <span v-else>
                {{ props.cellValue }}
              </span>
            </template>
            <template v-slot:handle="props">
              <div class="selected-color">
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
        title="IP信息"
        :visible.sync="showIP"
        :modal-append-to-body='false'
        :close-on-click-modal='false'
        :close-on-press-escape='false'
        width="40%"
    >
        <div  style="width: 85%;margin: 0px auto;">
          <span v-for="ip in ipdata" v-bind:key="ip">
               <tis-tag style="margin-top: 10px;margin-left:10px;font-size: 20px">{{ ip }}</tis-tag>
          </span>
        </div>
      <span slot="footer" class="dialog-footer">
		     <tis-button @click="closeIP">关 闭</tis-button>
		   </span>


    </tis-dialog>
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
          ref="noticeform"
          :form="form"
          :showPop="showPop"
          :disabled="disabled"
          @page="page"
      ></notice-form>
      <span slot="footer" class="dialog-footer">
		     <tis-button @click="closePop">取 消</tis-button>
		     <tis-button type="primary" @click="submit">确 定</tis-button>
		   </span>

    </tis-dialog>
  </div>
</template>

<script>
import {formatDate} from "@/utils/util";
import NoticeForm from "./ip-form";

export default {
  components: {
    NoticeForm,
  },
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      showPop: false,//表单弹出框
      disabled: false,
      showIP: false,//ip展示框
      name: null,//名称
      tableObj: {
        name: {
          slot: false,
          lable: "IP名称",
          class: "tabel-col-2",
          sortable: false,
        },
        url: {
          slot: true,
          lable: "IP地址",
          class: "tabel-col-4",
          sortable: false,
        },
        describe: {
          slot: false,
          lable: "IP描述",
          class: "tabel-col-2",
          sortable: false,
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-1 handle-cell",
          sortable: false,
        },
      },
      form: {url: [{value: ''}]},//表单基本信息
      tableData: [],//列表信息
      ipdata: [],//ip信息列表
      popTitle: "",//标题
      url: {value: ''}//ip信息
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
    //关闭IP弹框
    closeIP() {
      this.showIP = false
    },
    //展示IP信息
    showUrl(item) {
      this.showIP = true
      this.ipdata = item.split(",")
    },
    //删除选择的信息
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
              .getServerAction("/insight/ipManage/deleteBatch", {ids: JSON.stringify(this.$refs.selfTable.idData)})
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
              .getServerAction("/insight/ipManage/delete", {id: item.id})
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
      this.form = {urlList: [{value: ''}]};
      this.popTitle = "添加IP信息";
      this.showPop = true;

    },
    //编辑
    editForm(item) {
      this.popTitle = "修改IP信息";
      this.form = {};
      this.disabled = false;
      this.form = Object.assign({}, item)
      this.form.urlList = [];
      let a = item.url.split(",")
      for (let i = 0; i < a.length; i++) {
        this.url.value = a[i]
        this.form.urlList.push(this.url)
        this.url = {value: ''}
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
      let path = "/insight/ipManage/page";
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



</style>
