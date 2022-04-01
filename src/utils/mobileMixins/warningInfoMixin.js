import { formatDate } from "@/utils/util";
export const warningInfoMixin = {
  data() {
    return {
      see: false,
      curPage: 1,
      time: [],//开始结束时间
      pageSize: 20,
      pageInfo: null,
      plugin_code: null,//插件名称
      alarm_status: null,//告警状态
      level: null,//告警类型
      tableData: [],
      isAll: false,
      topHeight: 0,
      //告警类型选项
      typeOptions: [
        {
          value: "10",
          label: "一般告警",
        },
        {
          value: "20",
          label: "严重告警",
        },
      ],
      //告警状态选项
      postOptions: [
        {
          value: "0",
          label: "正在告警",
        },
        {
          value: "1",
          label: "历史告警",
        },
      ],
      tableObj: {
        alarm_name: {
          slot: false,
          lable: "告警名称",
          class: "tabel-col-3",
          sortable: false,
          showPop: this.$store.state.yqInfo.platform === 'pad',
        },
        plugin_name: {
          slot: false,
          lable: "插件名称",
          class: "tabel-col-2",
          sortable: false,
          showPop: this.$store.state.yqInfo.platform === 'pad',
        },
        level: {
          slot: true,
          lable: "告警类型",
          class: "tabel-col-1",
          sortable: false,
        },
        alarm_status: {
          slot: true,
          lable: "告警状态",
          class: "tabel-col-1",
          sortable: false,
        },
        confirm_status: {
          slot: true,
          lable: "查看状态",
          class: "tabel-col-1",
          sortable: false,
        },
        start_time: {
          slot: true,
          lable: "开始告警时间",
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
    };
  },
  created() {
    //列表查询
    this.getInfoList();
  },
  filters: {
    //时间转换
    fd(time) {
      return formatDate(time);
    },
  },
  methods: {
    //删除全部
    delAll(type) {
      if (this.$refs.selfTable.idData.length == 0 && type == "1") {
        this.$message.error("至少选择一项内容！");
        return;
      }
      this.$yqAlert({
        content: type == 0 ? "确认清空？" : "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/alarmInfo/deleteAllOrOther", {
              type: type,
              ids: JSON.stringify(this.$refs.selfTable.idData),
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.isAll = false;
                this.$refs.selfTable.initChoose();
                this.getInfoList();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    //修改状态
    changeStatus(item) {
      this.$api
        .postServerAction("/insight/alarmInfo/updateStatusById", {
          id: item.id,
          confirm_status: "1",
        })
        .then((res) => {
          this.$emit("showDetail", item);
          if (res.code == 200) {
            item.confirm_status = "1";
          }
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
            .getServerAction("/insight/alarmInfo/delete", {
              id: item.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.getInfoList();
                this.$refs.selfTable.initChoose();

              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
    //查看
    showDetail(item) {
      this.changeStatus(item);
    },
    //查询
    searchKey() {
      this.curPage = 1;
      this.getInfoList();
    },
    //重置
    resetKey() {
      this.curPage = 1;
      this.plugin_code = null;
      this.alarm_status = null;
      this.level = null;
      this.time = [];
      this.getInfoList();
    },
    //分页
    curPageChange(e) {
      this.curPage = e;
      this.$refs.selfTable.$refs.tableScroll.scrollTop = 0;
      this.getInfoList();
    },
    //列表分页查询
    getInfoList() {
      this.$yqLoading.show();
      let path = "/insight/alarmInfo/pageList";
      var start_time = null;
      var end_time = null;
      if (this.$store.state.yqInfo.platform === "mobile") {
        start_time = this.startDate;
        end_time = this.endDate;
      }
      else {

        if (this.time && this.time.length && this.time.length > 0) {
          start_time = formatDate(this.time[0]);
          end_time = formatDate(this.time[1]);
        }
      }
      let params = {
        page_no: this.curPage,
        page_size: this.pageSize,
        ip: this.$store.state.yqInfo.chooseIP,
        plugin_name: this.plugin_code,
        alarm_status: this.alarm_status,
        level: this.level,
        start_time: start_time,
        end_time: end_time,
      };
      //测试数据据
      // this.pluginList = getTestPlugin();
      this.$api.getServerAction(path, params).then(
        (res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.tableData = res.data.items.map((el) => {
              el.showPopover = false
              return el
            });
            this.pageInfo = res.data.page;
          }
        },
        function () {
          // errorFunc(error, self.$message);
        }
      );
    },
  },
}