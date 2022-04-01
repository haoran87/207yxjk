import { formatDate } from "@/utils/util";
export const warningInfoDetailMixin = {
      props: ["data"],
      data() {
        return {
          faultData: [],//故障知识信息
          see: false,
          fault: {},
          faultObj: {
            name: {
              slot: false,
              lable: "标题",
              class: "tabel-col-3",
              sortable: false,
            },
          /*  create_person: {
              slot: false,
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
              class: "tabel-col-1",
              sortable: false,
            },
          },
          infoObj: {
            ip: {
              slot: false,
              lable: "设备",
              class: "tabel-col-3",
              sortable: false,
            },
            source_type: {
              slot: true,
              lable: "类型",
              class: "tabel-col-2",
              sortable: false,
            },
            plugin_name: {
              slot: false,
              lable: "插件名称",
              class: "tabel-col-2",
              sortable: false,
            },
            plugin_code: {
              slot: false,
              lable: "插件编码",
              class: "tabel-col-2",
              sortable: false,
            },
            // description: {
            //   slot: false,
            //   lable: "描述",
            //   class: "tabel-col-5",
            //   sortable: false,
            // },
          },
          infoArr: [],
          mainHeight: "200vh",
          conHeight: "500px",
          stepOneArea: 0,
          stepTwoArea: 0,
          stepThreeArea: 0,
          activeNum: 1,
          scrollTopNum: 0,
          stepInfo: [
            {
              title: "告警信息",
              icon: "el-icon-info",
            },
            {
              title: "告警资源",
              icon: "el-icon-connection",
            },
            {
              title: "故障知识",
              icon: "el-icon-folder",
            },
          ],
        };
      },
      created() {
        this.mainHeight = this.$store.state.yqInfo.MAINHEIGHT  + "px";
        this.conHeight = this.$store.state.yqInfo.MAINHEIGHT - 80 - 32 + "px";
        this.infoArr.push(this.data);
        this.getKnowledge();
      },
      mounted() {
        if(this.$store.state.yqInfo.platform !== "mobile"){
          this.initScrollPams();
        }
        
      },
      filters: {
        fd(time) {
          return formatDate(time);
        },
      },
      watch: {
        scrollTopNum(v) {
          if (v < this.stepOneArea) {
            this.activeNum = 1;
          } else if (v >= this.stepTwoArea && v < this.stepThreeArea) {
            this.activeNum = 2;
          } else if (v >= this.stepThreeArea) {
            this.activeNum = 3;
          }
        },
      },
      methods: {
        //标题切换
        stepClick(areaNUm) {
          switch (areaNUm) {
            case 1:
              this.$refs["info_content"].scrollTop = 0;
              break;
            case 2:
              this.$refs["info_content"].scrollTop = this.stepTwoArea + 2;
              break;
            case 3:
              this.$refs["info_content"].scrollTop = this.stepThreeArea + 2;
              break;
          }
        },
        //初始化页面样式
        initScrollPams() {
          let space = 32;
          let wih = this.$refs["warn_info"].getBoundingClientRect().height;
          let wsh = this.$refs["warn_source"].getBoundingClientRect().height;
          this.stepOneArea = space;
          this.stepTwoArea = wih;
          this.stepThreeArea = wih + wsh;
        },
        scrollEvent() {
          this.scrollTopNum = this.$refs["info_content"].scrollTop;
        },
        /**
         * 修改确认状态
         * @param item
         */
        changeStatus(item) {
          this.$yqAlert({
            content: "确认修改状态？",
            hideCancel: false,
            suc: () => {
              this.$yqLoading.show();
              this.$api
                .postServerAction("/insight/alarmInfo/updateStatusById", {
                  id: item.id,
                  confirm_status: "1",
                })
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("修改成功！");
                    this.data.confirm_status = "1";
                  } else {
                    this.$message.warning("修改失败！");
                  }
                });
            },
          });
        },
        /**
         * 删 除
         * @param item
         */
        deleteInfo(item) {
          this.$yqAlert({
            content: "确认删除？",
            hideCancel: false,
            suc: () => {
              this.$yqLoading.show();
              this.$api
                .getServerAction("/insight/alarmInfo/delete", { id: item.id })
                .then((res) => {
                  this.$yqLoading.hide();
                  if (res.code == 200) {
                    this.$message.success("删除成功！");
                    this.hideDetail();
                  } else {
                    this.$message.warning("删除失败！");
                  }
                });
            },
          });
        },
        showFault(item) {
          this.see = true;
          this.fault = item;
        },
        hideDetails() {
          this.see = false;
        },
        hideDetail() {
          this.$emit("hideDetail");
        },
        getKnowledge() {
          this.$api
            .getServerAction("/insight/alarmInfo/getKnowledgeByAlarm", {
              id: this.data.id,
            })
            .then(
              (res) => {
                if (res.code == 200) {
                  this.faultData = res.data;
                }
              },
              function () {
                // errorFunc(error, self.$message);
              }
            );
        },
      },
}