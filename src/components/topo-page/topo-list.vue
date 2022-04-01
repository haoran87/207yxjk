<template>
  <div>
    <box-show
      style="padding: 0 8px"
      :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
      v-if="showType === 'tpl'"
    >
      <div>
        <div class="input-box">
          <div class="input-label">TOPO名称</div>
          <div class="input-con">
            <tis-input
              v-model="topoName"
              placeholder="请输入TOPO名称"
            ></tis-input>
          </div>
          <tis-button type="primary" @click="searchKey">查询</tis-button>
          <tis-button type="info" @click="resetKey">重置</tis-button>
          <tis-button type="danger" @click="importTopo">导入</tis-button>
          <tis-button type="primary" @click="showCarManager"
            >车辆管理</tis-button
          >
          <tis-button type="primary" @click="showBgManager"
            >背景图管理</tis-button
          >
          <tis-button type="primary" @click="showDeviceManager"
            >设备分类管理</tis-button
          >
        </div>
         
      </div>
      <div
        :style="{
          height: $store.state.yqInfo.MAINHEIGHT - 64 - 48 + 'px',
          'overflow-y': 'scroll',
        }"
      >
        <tis-row style="flex">
          <tis-col :span="6">
            <div class="topo-item topo-add" @click="addTopo">
              <div style="height: 3vw"></div>
              <div
                v-if="conShow"
                :style="topoConStyle"
                class="topo-con topo-add"
              >
                <plugin-add-icon></plugin-add-icon>
                <div style="margin-top: 16px">点击新增拓扑图</div>
              </div>
              <div style="height: 3.2vw"></div>
            </div>
          </tis-col>
          <tis-col
            :span="6"
            v-for="(topo, idx) in topoList"
            :key="idx"
            ref="tiscol"
          >
            <div class="topo-item flex-column-center">
              <div class="topo-title">&nbsp;&nbsp; {{ topo.TOPO_NAME }}</div>
              <div v-if="conShow" class="topo-con" :style="topoConStyle">
                <list-graph
                  :topoObj="topo"
                  :svgStyle="topoConStyle"
                ></list-graph>
                <!-- <div :id="topo.ID" style="width:calc(824px * 0.27);height:calc(580px * 0.27)"></div> -->
                <!-- <img
                  :src="
                   topopng
                  "
                  style="height: 160px"
                  alt=""
                /> -->
                <!-- <div
                  style="max-width: 100px; max-height: 100px"
                  v-html="topopng"
                ></div> -->
              </div>
              <div class="topo-bottom" :style="{ 'font-size': bfont }">
                <div
                  class="topo-bottom-btn btn-border-r"
                  @click="editTopo(topo)"
                >
                  编辑
                </div>
                <div
                  class="topo-bottom-btn btn-border-r"
                  @click="exportTopo(topo)"
                >
                  导出
                </div>
                <div
                  v-if="topo.TOPO_TYPE == 'inside'"
                  class="topo-bottom-btn btn-border-r"
                >
                  <div v-if="topo.DEFAULT_SHOW == '1'">默认</div>
                  <div v-else @click="setTopo(topo)">设为默认</div>
                </div>
                <div class="topo-bottom-btn" @click="delTopo(topo)">删除</div>
              </div>
            </div>
          </tis-col>
        </tis-row>
      </div>
      <div style="height: 8px"></div>
      <list-page
        :pageInfo="pageInfo"
        :curPage="curPage"
        @cpc="curPageChange"
        :pageSize="pageSize"
      ></list-page>
    </box-show>
    <car-manage v-else-if="showType === 'cma'" @hideDetail="hideCarManage"></car-manage>
    <import-excel
      :action="action"
      :showImport="showImport"
      @page="getTopoList"
      @close="closeImport"
      :tipText="'只能上传.xlsx,.xls文件'"
      :suffix="'.xlsx,.xls'"
      ref="importExcel"
    >
    </import-excel>
    <tis-dialog
      title="背景图片管理"
      :modal="true"
      width="60%"
      :close-on-click-modal="false"
      :visible.sync="bgVisible"
      :modal-append-to-body="false"
      append-to-body
    >
      <bg-manager></bg-manager>
    </tis-dialog>

    <tis-dialog
      title="设备管理"
      width="60%"
      :close-on-click-modal="false"
      :visible.sync="deviceVisible"
      :modal-append-to-body="false"
      append-to-body
    >
      <device-manager></device-manager>
    </tis-dialog>
    <bottom-confirm
      v-if="showConfirmBar"
      @hideCarManage="hideCarManage"
      :isCarManage="showType === 'cma'"
    >
    </bottom-confirm>
  </div>
</template>
<script>
import PluginAddIcon from "../monitor-page/monitor-components/plugin-add-icon.vue";
import ImportExcel from "../page/importExcel";
import ListGraph from "./topo-module/list-graph.vue";
import BgManager from "./topo-module/bg-manager.vue";
import DeviceManager from "./topo-module/device-manager.vue";
import CarManage from "./car-manage.vue";
import bottomConfirm from "../footer-page/bottom-confirm.vue";
export default {
  components: {
    PluginAddIcon,
    ImportExcel,
    ListGraph,
    CarManage,
    bottomConfirm,
    BgManager,
    DeviceManager,
  },
  data() {
    return {
      innerVisible: false,
      showType: "tpl",
      showConfirmBar: false,
      bgVisible: false,
      deviceVisible: false,
      ss: true,
      topoList: [],
      topoName: "",
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      showImport: false,
      topopng: "",
      topoConStyle: {},
      conShow: false,
      action: "/insight/topology/importExcel",
      bfont: `var(--tab-title-size)`,
    };
  },
  created() {
    if (this.$platform.type === "pad") {
      this.bfont = `var(--text-size-light)`;
    }
    // this.topopng = localStorage.getItem("topoPng");
    // console.log("生成的拓扑图片",this.topopng)
  },
  mounted() {
    this.getTopologySubjectObject();
  },
  methods: {
    showDeviceManager() {
      this.deviceVisible = true;
    },
    showBgManager() {
      this.bgVisible = true;
    },
    showCarManager() {
      // this.$store.commit("yqInfo/CHANGE_BSTU", 3);
      this.showType = "cma";
      // this.showConfirmBar = true;
    },
    hideCarManage() {
      this.showType = "tpl";
      // this.showConfirmBar = false;
      // this.$store.commit("yqInfo/CHANGE_BSTU", 2);
    },
    searchKey() {
      this.curPage = 1;
      this.getTopoList();
    },
    resetKey() {
      this.curPage = 1;
      this.topoName = "";
      this.getTopoList();
    },
    addTopo() {
      this.$emit("addTopo");
    },
    curPageChange(e) {
      this.curPage = e;
      this.getTopoList();
    },
    //获取所有拓扑图元素的状态图片对象
    getTopologySubjectObject() {
      let that = this;
      this.$api
        .getServerAction("/insight/topoDevice/getTopologySubjectObject")
        .then((res) => {
          if (res.code == 200) {
            //console.log("状态图片信息", res.data)
            //缓存拓扑图状态图片信息
            if (res.data) {
              this.$store.commit("yqInfo/CHANGE_TOPO_IMAGE", res.data);
            }
            that.getTopoList();
          }
        });
    },
    getTopoList() {
      let params = {
        Topo_Name: this.topoName,
        page_no: this.curPage,
        page_size: this.pageSize,
      };
      this.$yqLoading.show();
      //先设置不显示拓扑卡片列表，删除掉相关界面元素，列表数据刷新后，重新渲染新的卡片列表。防止删除拓扑图后，缩略图不刷新
      this.conShow = false;
      this.$api
        .getServerAction("/insight/topology/page", params)
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.topoList = res.data.items;
            this.pageInfo = res.data.page;
            setTimeout(() => {
              this.topoConStyle.width =
                (this.$refs.tiscol[0].$el.clientWidth / 10) * 7;
              this.topoConStyle.height =
                (this.topoConStyle.width / this.$store.state.yqInfo.TOPOWITH) *
                  this.$store.state.yqInfo.TOPOHEIGHT +
                "px";
              this.topoConStyle.width += "px";
              this.conShow = true;
            }, 1);
            // console.log("topo数据u === ", res.data);
          }
        });
    },
    editTopo(topo) {
      this.$emit("editTopo", topo);
    },
    setTopo(topo) {
      console.log(topo.TOPO_CODE);
      this.$yqLoading.show();
      this.$api
        .postServerAction(
          "/insight/topology/setTopologyCarType?car_type=" + topo.TOPO_CODE
        )
        .then((res) => {
          this.$yqLoading.hide();
          if (res.code == 200) {
            this.$message.success("设置成功！");
            this.getTopoList();
          } else {
            this.$message.warning("设置失败！");
          }
        });
    },
    closeImport() {
      this.showImport = false;
    },
    importTopo() {
      this.$refs.importExcel.init();
      this.showImport = true;
    },
    exportTopo(topo) {
      this.$yqAlert({
        content: "确定要导出这个拓扑图吗？",
        hideCancel: false,
        suc: () => {
          let url =
            this.$store.state.yqInfo.serverIp +
            "/insight/topology/exportExcel?id=" +
            topo.ID;
          window.location.href = url;
        },
      });
    },
    delTopo(topo) {
      if (topo.DEFAULT_SHOW == "1") {
        this.$message.warning("无法删除默认展示的拓扑图！");
        return;
      }
      this.$yqAlert({
        content: "确定要删除这个拓扑图吗？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/topology/delete", {
              id: topo.ID,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.getTopoList();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topo-item {
  border: var(--status-bar-tools-border);
  /* min-height: 240px; */
  margin: 8px;
  width: calc(100% - 16px);
  position: relative;
  background-color: var(---status-bar-bg-color);
  text-align: left;
}

.topo-title {
  width: 100%;
  border-bottom: var(--status-bar-tools-border);
  font-size: var(--text-size-big);
  height: 3vw;
  line-height: 3vw;
}

.topo-con {
  display: flex;
  justify-content: center;
  padding: 8px;
}
.topo-bottom {
  width: 100%;
  display: flex;
  bottom: 0;
  justify-content: space-between;
  height: 3.2vw;
  // font-size: var(--text-size-light);
  line-height: 3.2vw;
  background-color: var(--status-bar-tools-bg);
  text-align: center;
}
.topo-bottom-btn {
  width: calc(100% / 2);
}

.topo-add {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color-weak);
}

.btn-border-r {
  border-right: var(--status-bar-tools-border);
}
</style>
