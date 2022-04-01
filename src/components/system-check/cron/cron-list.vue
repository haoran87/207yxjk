<template>
  <div>
    <div>
      <div ref="topCon" class="input-box">
        <div class="input-label">接口名称</div>
        <div class="input-con">
          <tis-input v-model="name" placeholder="请输入接口名称"></tis-input>
        </div>
        <div class="input-label">请求方式</div>
        <div class="input-con">
          <select-dict
            v-model="mode"
            placeholder="请选择请求方式"
            type="requestType"
          ></select-dict>
        </div>
        <tis-button type="primary" @click="search">查 询</tis-button>
        <tis-button type="info" @click="clean">重 置</tis-button>
        <tis-button type="primary" @click="addForm">添 加</tis-button>
      </div>
      <div v-if="tableHeight">
        <self-table
          ref="selfTable"
          :tableData="tableData"
          :tableObj="tableObj"
          :checkable="false"
          :tableHeight="tableHeight"
        >
          <template v-slot:status="props">
            <span v-if="props.cellValue == '1'" class="open-color">启用</span>
            <span v-else class="close-color">未启用</span>
          </template>
          <template v-slot:handle="props">
            <div class="selected-color">
              <span @click="lookData(props.cellData)">查 看</span
              >{{ "&nbsp;" }}
              <span @click="editForm(props.cellData)"   >编 辑</span>{{ "&nbsp;" }}

              <tis-popover
                placement="left"
                :value="moreshow"
                @show="moreshow = true"
              >
                <div style="color: var(--color-6); text-align: center">
                  <div style="margin-bottom: 8px">
                    <span
                      @click="
                        moreshow = false;
                        enable(props.cellData, '1');
                      "
                      v-if="props.cellData.status == '0'"
                      >启 用</span
                    >
                    <span
                      @click="
                        moreshow = false;
                        enable(props.cellData, '0');
                      "
                      v-else
                      >禁 用
                    </span>
                  </div>
                  <div style="margin-bottom: 8px">
                    <span
                      @click="
                        moreshow = false;
                        deleteData(props.cellData);
                      "
                      >删 除</span
                    >
                  </div>
                  <div>
                    <span
                      @click="
                        moreshow = false;
                        historyLook(props.cellData);
                      "
                      >历史记录</span
                    >
                  </div>
                </div>
                <span slot="reference">更多</span>
              </tis-popover>
            </div>
          </template>
        </self-table>
      </div>
    </div>
    <list-page
      :pageInfo="pageInfo"
      :curPage="curPage"
      :pageSize="pageSize"
      @cpc="curPageChange"
    ></list-page>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curPage: 1,
      pageSize: 15,
      pageInfo: null,
      name: null,//接口名称
      mode: null,//请求方式
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
        cron: {
          slot: false,
          lable: "执行频率",
          class: "tabel-col-2",
          sortable: false,
        },
        description: {
          slot: false,
          lable: "接口说明",
          class: "tabel-col-3",
          sortable: false,
        },
        status: {
          slot: true,
          lable: "状态",
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
      tableData: [],//列表信息
      //接口信息
      form: {
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
      params: { value: "" },
      tableHeight: 0,
      moreshow: false,
    };
  },
  created() {},
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.tableHeight =
      this.$store.state.yqInfo.MAINHEIGHT - 55 - rect.height - 48;
  },
  methods: {
    //历史记录
    historyLook(data) {
      this.$emit("showHistoryDetail", data.id);
    },
    //查看
    lookData(data) {
      this.$emit("showLook", data);
    },
    //根据ID删除信息
    deleteData(item) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheck/deleteCronJob", {
              id: item.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.page(this.classId);
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    //添加
    addForm() {
      if (this.classId == "" || this.classId == undefined) {
        this.$message.error("请选择所属分类");
        return;
      }
      this.form = {
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
        cron: "00 * * ? * *",
      };
      this.$emit("showDetail", this.form);
    },
    //启用or禁用
    enable(form, sum) {
      this.$yqAlert({
        content: "确认此操作？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          form.status = sum;
          this.$api
            .postServerAction("/insight/systemCheck/updateStatusById", form)
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("操作成功");
                this.page(this.classId);
              } else {
                this.$message.error("操作失败");
              }
            });
        },
      });
    },
    //编辑
    editForm(form) {
      this.form = {};
      this.form = JSON.parse(JSON.stringify(form));
      if (form.params != "") {
        let dataObj = JSON.parse(form.params);
        let params = [];
        for (let d in dataObj) {
          let a = {};
          a["key"] = d;
          a["value"] = dataObj[d];
          params.push(a);
        }
        this.form.paramList = params;
      } else {
        this.form.paramList = [{ key: "", value: "" }];
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
        this.form.headerList = headers;
      } else {
        this.form.headerList = [{ key: "", value: "" }];
      }

      this.$emit("showDetail", this.form);
    },
    /**
     * 查询
     */
    search() {
      this.curPage = 1;
      if (this.classId == "") {
        this.$message.error("请选择所属分类");
        return;
      }
      this.page(this.classId);
    },
    /**
     * 重置
     */
    clean() {
      if (this.classId == "") {
        this.$message.error("请选择所属分类");
        return;
      }
      this.curPage = 1;
      this.name = null;
      this.mode = null;
      this.page(this.classId);
    },
    //分页
    curPageChange(e) {
      if (this.classId == "") {
        this.$message.error("请选择所属分类");
        return;
      }
      this.curPage = e;

      this.page(this.classId);
    },
    /**
     * 分页查询
     */
    page(classId) {
      if (classId == undefined || classId == "") {
        this.$message.error("请选择所属分类");
        return;
      }

      this.classId = classId;
      this.showPop = false;
      this.$yqLoading.show();
      let path = "/insight/systemCheck/page";
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        name: this.name,
        mode: this.mode,
        classId: this.classId,
      };
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.tableData = res.data.items;
          this.pageInfo = res.data.page;
        } else {
          this.$message.error(res.info);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.yqxxkjPad {
  .input-label {
    width: 110px;
  }
}
</style>
