import { formatDate } from "@/utils/util";
export const warningNoticeMixin = {
    data() {
        return {
            curPage: 1,
            pageSize: 15,
            pageInfo: null,
            showPop: false,//是否显示弹框
            disabled: false,//是否只读
            name: null,//告警名称
            form: {},//告警通知信息
            tableData: [],
            tableObj: {
                name: {
                    slot: false,
                    lable: "模板名称",
                    class: "tabel-col-2",
                    sortable: false,
                },
                alarm_type: {
                    slot: true,
                    lable: "通知分类",
                    class: "tabel-col-2",
                    sortable: false,
                },
                status: {
                    slot: true,
                    lable: "状态",
                    class: "tabel-col-1",
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
            popTitle: "",//弹框标题
            isAll: false,
            topHeight: 0,
        };
    },
    filters: {
        fd(time) {
            return formatDate(time);
        },
    },
    created() {
        this.getValueByDict("noticeType")
        //查询分页列表
        this.page();
    },
    methods: {
        //开启/禁用
        enable(form, sum) {
          this.$yqAlert({
            content: "确认此操作？",
            hideCancel: false,
            suc: () => {
              this.$yqLoading.show();
              form.status = sum;
              this.$api
                .postServerAction("/insight/noticeTemplate/updateStatusById", form)
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("操作成功");
                    this.page();
                  } else {
                    this.$message.error("操作失败");
                  }
                  this.$refs.selfTable.initChoose()
                });
            },
          });
        },
        //删除全部
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
                .getServerAction("/insight/noticeTemplate/deleteNotices", {
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
                  this.$refs.selfTable.initChoose()
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
                .getServerAction("/insight/noticeTemplate/delete", {
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
                  this.$refs.selfTable.initChoose()
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
          this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
          this.page();
        },
        //查看
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
        //确认信息
        submit() {
          this.$refs.noticeform.submit();
        },
        /**
         * 添加
         */
        addForm() {
          this.disabled = false;
          this.form = {};
          this.popTitle = "添加通知模板";
          this.showPop = true;
        },
        //修改
        editForm(item) {
          this.popTitle = "修改通知模板";
          this.form = {};
          this.disabled = false;
          this.form = JSON.parse(JSON.stringify(item));
          this.getNoticeAlarmId(item.id);
          this.showPop = true;
        },
        //获取告警通知关联信息
        getNoticeAlarmId(id) {
          this.$api
            .getServerAction("/insight/noticeTemplate/getAlarmsByNoticeId", {
              id: id,
            })
            .then((res) => {
              if (res.code == 200) {
                console.log(res.data);
                this.form.alarm_ids = res.data;
              } else {
                this.$message.warning(res.info);
              }
            });
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
          let path = "/insight/noticeTemplate/page";
          let params = {
            page_no: this.curPage,
            page_size: this.pageSize,
            name: this.name,
          };
          this.$api.getServerAction(path, params).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.tableData = res.data.items;
              this.pageInfo = res.data.page;
            }else{
              this.$message.error(res.info)
            }
          });
          if(this.$refs.selfTable){this.$refs.selfTable.initChoose()};
        },
      },
}