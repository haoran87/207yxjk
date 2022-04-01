export const warningTemplateMixin={
    data() {
        return {
          //导入请求地址
          action: "/insight/alarmTemplate/importExcel",
          //导出模板信息地址
          href:
            this.$store.state.yqInfo.serverIp +
            "/insight/template/download/" +
            "告警模板.xlsx",
          curPage: 1,
          pageSize: 15,
          pageInfo: null,
          name: null, //告警名称
          status: null, //告警状态
          formPop: false,
          popTitle: "", //标题
          tableData: [],
          sortKey: "", //排序值
          sortType: "", //排序类型
          tableObj: {
            name: {
              slot: false,
              lable: "告警名称",
              class: "tabel-col-3",
              sortable: false,
            },
            remark: {
              slot: false,
              lable: "告警描述",
              class: "tabel-col-4",
              sortable: false,
            },
            // equipment_id: {
            //   slot: false,
            //   lable: "设备",
            //   class: "tabel-col-2",
            //   sortable: false,
            // },
            status: {
              slot: true,
              lable: "模板状态",
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
          //告警规则信息
          dynamicValidateForm: {
            alarmRuleList: [],
            trigger_type: "",
          },
          //模板基本信息
          form: {},
          //插件信息
          pluginList: {},
          isAll: false,
          //导入显示/隐藏
          showImport: false,
          //模板状态选项
          typeOptions: [
            {
              value: "0",
              label: "未启用",
            },
            {
              value: "1",
              label: "启用",
            },
          ],
          topHeight: 0,
        };
      },
      created() {
        //列表查询
        this.getPageList();
      },
     
      methods: {
        //导出模板
        excelDownload() {
          window.location.href = this.href;
        },
        //排序
        sortClick(e) {
          this.sortType = e.sortType;
          this.sortKey = e.sortKey;
          this.getPageList();
        },
        //关闭导入弹框
        closeImport() {
          this.showImport = false;
        },
        //导出excel文件
        exportExcel() {
          console.log(this.$refs.selfTable.idData.length);
          if (this.$refs.selfTable.idData.length == 0) {
            this.$message.error("请选择需要导出的信息!");
            return;
          }
    
          let url =
            this.$store.state.yqInfo.serverIp +
            "/insight/alarmTemplate/exportExcel?ids=" +
            JSON.stringify(this.$refs.selfTable.idData);
          window.location.href = url;
        },
        //导入
        importExcel() {
          this.$refs.importExcel.init();
          this.showImport = true;
        },
        //删除指定信息
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
                .getServerAction("/insight/alarmTemplate/deleteByIds", {
                  ids: JSON.stringify(this.$refs.selfTable.idData),
                })
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("删除成功！");
                    this.$refs.selfTable.initChoose();
                    this.getPageList();
                  } else {
                    this.$message.warning("删除失败！");
                  }
                });
              this.$refs.selfTable.initChoose();
            },
          });
        },
        //修改状态
        updateStatue(item, status) {
          this.$yqAlert({
            content: "确认此操作？",
            hideCancel: false,
            suc: () => {
              this.$yqLoading.show();
              this.$api
                .postServerAction("/insight/alarmTemplate/updateStatusById", {
                  id: item.id,
                  status: status,
                })
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("操作成功！");
                    this.getPageList();
                  } else {
                    this.$message.warning("操作失败！");
                  }
                });
              this.$refs.selfTable.initChoose();
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
                .getServerAction("/insight/alarmTemplate/delete", {
                  id: item.id,
                })
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("删除成功！");
                    this.$refs.selfTable.initChoose();
                    this.getPageList();
                  } else {
                    this.$message.warning("删除失败！");
                  }
                });
              this.$refs.selfTable.initChoose();
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
          this.getPageList();
        },
        //查看
        showDetail(item) {
          if (item.alarmRuleList.length > 0) {
            for (let i = 0; i < item.alarmRuleList.length; i++) {
              if (item.alarmRuleList[i].contents != "") {
                var obj = eval("(" + item.alarmRuleList[i].contents + ")");
                if (obj.length == 1 && obj[0].level == 10) {
                  item.alarmRuleList[i].commonly = obj[0].value;
                  item.alarmRuleList[i].commonlySum = obj[0].times;
                } else if (obj.length == 1 && obj[0].level == 20) {
                  item.alarmRuleList[i].serious = obj[0].value;
                  item.alarmRuleList[i].seriousSum = obj[0].times;
                } else if (obj.length > 1) {
                  item.alarmRuleList[i].commonly = obj[0].value;
                  item.alarmRuleList[i].commonlySum = obj[0].times;
                  item.alarmRuleList[i].serious = obj[1].value;
                  item.alarmRuleList[i].seriousSum = obj[1].times;
                }
              }
            }
          }
          this.$emit("showDetail", item);
        },
        /**
         * 取消弹出框
         */
        closePop() {
          this.formPop = false;
        },
        //提交信息保存
        submit() {
          this.$refs.templateForm.submit();
        },
        /**
         * 添加
         */
        addForm() {
          this.popTitle = "添加告警模板";
          this.formPop = true;
          this.form = {};
          this.dynamicValidateForm.alarmRuleList = [];
          this.dynamicValidateForm.trigger_type = "";
          this.getPlugin();
        },
        //修改
        editForm(item) {
          // console.log("要编辑的内容 === ", item);
          this.popTitle = "修改告警模板";
          this.form = {};
          this.dynamicValidateForm.alarmRuleList = [];
          this.dynamicValidateForm.trigger_type = "";
          //利用JSON进行深拷贝  解决在表单中修改数据，table表格的数据也跟着修改的问题
          this.form = JSON.parse(JSON.stringify(item));
          if (item.alarmRuleList.length > 0) {
            for (let i = 0; i < item.alarmRuleList.length; i++) {
              var obj = eval("(" + item.alarmRuleList[i].contents + ")");
              var a = null;
              var a1 = null;
              var b = null;
              var b1 = null;
              if (obj.length == 1 && obj[0].level == 10) {
                a = obj[0].value;
                a1 = obj[0].times;
              } else if (obj.length == 1 && obj[0].level == 20) {
                b = obj[0].value;
                b1 = obj[0].times;
              } else if (obj.length > 1) {
                a = obj[0].value;
                a1 = obj[0].times;
                b = obj[1].value;
                b1 = obj[1].times;
              }
              this.dynamicValidateForm.alarmRuleList.push({
                subject_index: item.alarmRuleList[i].subject_index,
                info_index: item.alarmRuleList[i].info_index,
                conditions: item.alarmRuleList[i].conditions,
                commonly: a,
                serious: b,
                commonlySum: a1,
                seriousSum: b1,
                id: item.alarmRuleList[i].id,
                contents: item.alarmRuleList[i].contents,
              });
            }
          }
          this.dynamicValidateForm.trigger_type = item.trigger_type;
          // if (item.type == "plugin") {
          //   this.$refs.templateForm.getPluginAttributes(item.plugin_id);
          // }
          this.getPlugin();
        },
        /**
         * 获取插件信息
         */
        getPlugin() {
          this.$yqLoading.show();
          this.$api.getServerAction("/insight/plugin/getPluginList").then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.pluginList = res.data;
              this.formPop = true;
            }
          });
        },
        /**
         * 查询
         */
        search() {
          this.curPage = 1;
          this.getPageList();
        },
        /**
         * 重置
         */
        clean() {
          this.curPage = 1;
          this.status = null;
          this.name = null;
          this.getPageList();
        },
        /**
         * 分页查询
         */
        getPageList() {
          this.closePop();
          this.$yqLoading.show();
          let path = "/insight/alarmTemplate/page";
          let params = {
            page_no: this.curPage,
            page_size: this.pageSize,
            status: this.status,
            name: this.name,
            sortBy: this.sortKey,
            sortType: this.sortType,
          };
          this.$api.getServerAction(path, params).then(
            (res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.tableData = res.data.items;
                this.tableData.forEach(element => {
                    element.showPopover=false;
                });
                this.pageInfo = res.data.page;
              }
            },
            function () {
              // errorFunc(error, self.$message);
            }
          );
          if (this.$refs.selfTable) {
            this.$refs.selfTable.initChoose();
          }
        },
      },
}