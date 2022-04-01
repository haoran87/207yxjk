<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <div>
      <div class="input-box">
        <div class="input-label">展示名称</div>
        <div class="input-con">
          <tis-input
            v-model="showName"
            placeholder="请输入展示名称"
          ></tis-input>
        </div>
        <div class="input-label">设备状态：</div>
        <div class="input-con">
          <tis-select
            popper-class="pickerClass"
            v-model="subjectStatus"
            placeholder="请选择设备状态"
          >
            <tis-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </tis-option>
          </tis-select>
        </div>
        <tis-button type="primary" @click="searchKey">查询</tis-button>
        <tis-button type="info" @click="resetKey">重置</tis-button>
        <tis-button type="info" @click="clearAllOffline">清理</tis-button>
      </div>
      <!-- 返回上级路由- 隐藏路由菜单时使用-->
      <!-- <div @click="goback">
        <icon :name="'back'" :size="'32'" :color="'#E4E4E4'"></icon>
      </div> -->
    </div>
    <div style="margin: 0 16px">
      <self-table
      :tableData="tableData"
      :tableObj="tableObj"
      :tableHeight='$store.state.yqInfo.MAINHEIGHT - 56 '
      >
        <template v-slot:status="props">
          {{ props.cellValue == -1 ? "离线" : "在线" }}
        </template>
        <template v-slot:handle="props">
          <span
            v-show="props.cellData.status == -1"
            class="selected-color"
            @click="deleteInfo(props.cellData)"
            >删 除</span
          >
        </template>
      </self-table>
    </div>
    <!-- <list-page
      :pageInfo="pageInfo"
      :curPage="curPage"
      @cpc="curPageChange"
      :pageSize="pageSize"
    ></list-page> -->
  </box-show>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      tableObj: {
        name: {
          slot: false,
          lable: "展示名称",
          class: "tabel-col-2",
        },
        code: {
          slot: false,
          lable: "设备标识",
          class: "tabel-col-2",
        },
        type: {
          slot: false,
          lable: "设备类型",
          class: "tabel-col-2",
        },
        ip: {
          slot: false,
          lable: "IP地址",
          class: "tabel-col-2",
        },
        status: {
          slot: true,
          lable: "状态",
          class: "tabel-col-1",
        },
        description: {
          slot: false,
          lable: "描述",
          class: "tabel-col-3",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "tabel-col-1 handle-cell",
          sortable: false,
        },
      },
      //选择的设备状态（'online':在线、'offline':离线、'':全部）
      subjectStatus: "",
      statusOptions: [
        {
          value: "online",
          label: "在线",
        },
        {
          value: "offline",
          label: "离线",
        },
      ],
      showName: "",
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    goback() {
      if (this.$parent.pageData) {
        this.$navigateTo(this.$parent.pageData.backNav);
      }
    },
    searchKey() {
      this.curPage = 1;
      this.getList();
    },
    resetKey() {
      this.curPage = 1;
      this.showName = "";
      this.subjectStatus = "";
      this.getList();
    },
    //清理所有离线设备
    clearAllOffline() {
      this.$yqAlert({
        content: "确认清理所有离线设备的注册信息？不可恢复，谨慎操作",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction(
              "/insight/connectionNode/clearOfflineRegisterNodes"
            )
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("清理成功！");
                this.getList();
              } else {
                this.$message.error("清理失败！"+res.info);
              }
            });
        },
      });
    },
    addChart() {
      this.$emit("addChart");
    },
    curPageChange(e) {
      this.curPage = e;
      this.getList();
    },
    getList() {
      let params = {
        subjectStatus: this.subjectStatus,
        showName: this.showName,
      };
      this.tableData = []
      this.$api
        .getServerAction("/insight/statusInfo/getAllDeviceList", params)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.data;
          }else{
            this.$message.error("获取失败！"+res.info);
          }
        });
    },
    /**
     * 删 除
     * @param item
     */
    deleteInfo(item) {
      this.$yqAlert({
        content: "确认删除该离线设备的注册信息？不可恢复，谨慎操作",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction(
              "/insight/connectionNode/deleteOfflineRegisterNode",
              { id: item.id }
            )
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.getList();
              } else {
                this.$message.error("删除失败！"+res.info);
              }
            });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
