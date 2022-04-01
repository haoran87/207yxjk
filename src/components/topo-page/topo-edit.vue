<template>
  <div>
    <tis-row type="flex" v-show="!isScan">
      <tis-col :span="6" style="margin-right: 16px">
        <div class="module-bg">
          <div v-if="chooseType === 'bar'">
            <topo-bar
              ref="topoBar"
              :barStu="barStu"
              :topoObj="topoObj"
              @emitToParent="getBarInfo"
              :style="{ height: mainHeight }"
            ></topo-bar>
          </div>
          <device-info
            v-else-if="chooseType === 'deviceInfo'"
            ref="deviceInfo"
            :infoObj="deviceInfo"
            :topoType="topoObj.TOPO_TYPE"
            @deviceInfoBack="deviceBack"
            @delDevice="delDevice"
          >
          </device-info>
        </div>
      </tis-col>
      <tis-col :span="18">
        <div class="topo-edit-box module-bg" :style="{ height: mainHeight }">
          <edit-area
            ref="drawsvg"
            :topoObj="topoObj"
            :activeNum="activeNum"
            @showDeviceInfo="showDeviceInfo"
            @goEditLine="goEditLine"
            @delDevice="delDevice"
            @stepClick="getStepInfo"
            @changeShowType="changeShowType"
             @deviceInfoBack="deviceBack"
             @scan="scanTopo"
          ></edit-area>
        </div>
      </tis-col>
    </tis-row>

    <topo-scan ref="topoScan" v-show="isScan"></topo-scan>
    <tis-dialog
      title="编辑拓扑图信息"
      :visible="activeNum == 1"
      :modal="true"
      :modal-append-to-body="false"
      :show-close="false"
    >
      <tis-form
        ref="topoInfoForm"
        :model="topoObj"
        :rules="rules"
        :label-width="formLabelWidth"
      >
        <tis-form-item label="名称" prop="TOPO_NAME">
          <tis-input placeholder="请输入拓扑名称" v-model.trim="topoObj.TOPO_NAME"  maxlength="50" show-word-limit>
          </tis-input>
        </tis-form-item>
        <tis-form-item label="编号" prop="TOPO_CODE" :rules="[{ required: true, validator: validateCode, trigger: 'blur' }]">
          <tis-input placeholder="请输入拓扑编号" v-model.trim="topoObj.TOPO_CODE"  maxlength="50" show-word-limit>
          </tis-input>
        </tis-form-item>
        <tis-form-item label="类型" prop="TOPO_TYPE">
          <el-radio-group
            v-model="topoObj.TOPO_TYPE"
            style="
              width: 100%;
              text-align: left;
              font-size: var(--text-size-big);
            "
          >
            <el-radio label="inside">车内拓扑图</el-radio>
            <el-radio label="between">车际拓扑图</el-radio>
          </el-radio-group>
        </tis-form-item>
      </tis-form>
      <div slot="footer" class="dialog-footer">
         <tis-button type="info" @click="cancleEdit">取消</tis-button>
        <tis-button type="primary" @click="topoInfoConfirm">确 定</tis-button>
      </div>
    </tis-dialog>
    <bottom-confirm
      @cancel="hideEdit"
      @confirm="preserve"
      @footerClick="getStepInfo"
      @hideCarManage="hideCarManage"
      @scan="scanTopo"
      @cancelScan="cancelScan"
      :isScan="isScan"
      :isCarManage="isCarMange"
      :footerText="footerText"
    >
    </bottom-confirm>
  </div>
</template>
<script>
import bottomConfirm from "../footer-page/bottom-confirm.vue";

import EditArea from "./edit-area.vue";
import TopoBar from "./topo-bar.vue";
import DeviceInfo from "./topo-module/device-info.vue";
import TopoScan from "./topo-scan.vue";
// import { getneralId } from "@/utils/util";
export default {
  components: {
    bottomConfirm,
    EditArea,
    TopoScan,
    TopoBar,
    DeviceInfo,
  },
  props: ["topoObj"],
  data() {
    return {
      formLabelWidth: "120px",
      topoName: "",
      barStu: "bar",
      chooseType: "bar",
      chooseInfo: "",
      lineInfo: "",
      lineNum: "",
      lineList: [],
      isScan: false,
      isCarMange: false,
      deviceInfo: null,
      activeNum: 1,
      mainHeight: "100vh",
      footerText: "编辑信息",
      rules: {
        TOPO_NAME: [
          { required: true, message: "请输入拓扑图名称", trigger: "blur" },
        ],
        TOPO_TYPE: [
          { required: true, message: "请选择拓扑图类型", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    if (this.topoObj.SHOW_TYPE === "") {
      this.topoObj.SHOW_TYPE = "0";
    }
    this.mainHeight = this.$store.state.yqInfo.MAINHEIGHT + "px";
    this.$store.commit("yqInfo/CHANGE_BSTU", 3);
  },
  watch: {
    activeNum(val) {
      switch (val) {
        case 1:
          this.footerText = "编辑背景";
          break;
        case 2:
          this.footerText = "添加设备";
          break;
        case 3:
          this.footerText = "连接设备";
          break;
        case 4:
          this.footerText = "保存";
          break;
      }
    },
  },
  methods: {
    validateCode(rule, value, callback){
      if (value == "" || value == undefined) {
        callback(new Error("请填写设备类型"));
      }
      var a=/[^a-zA-Z-0-9-*_-]/g
      if (a.test(value)) {
        callback(new Error("只可输入英文数字和 '-'  '_'  '*'字符"));
      }
      callback();
    },
    changeShowType(e) {
      this.topoObj.SHOW_TYPE = e;
    },
    cancelScan() {
      this.isScan = false;
      this.$refs.topoScan.destroyForceGraph();
    },
    scanTopo() {
      let graph = this.$refs.drawsvg.graph;
      this.$refs.topoScan.initData(graph);
      this.isScan = true;
    },
    footerClick() {},
    getStepInfo(type) {
      if (this.chooseType === "deviceInfo") {
        this.deviceBack();
        this.$nextTick(() => {
          this.getStepInfo(type);
        });
        return;
      }
      if (this.$refs.topoBar.tbName === type) {
        return;
      }
      if (this.$refs.topoBar.tbName === "lines") {
        this.$refs.topoBar.linesOK();
      }
      if (type === "info" || type === "preserve") {
        this.$refs.topoBar.tbName = "bar";
        this.getBarInfo(type);
      } else {
        this.$refs.topoBar.topobarClick(type);
      }
    },
    getBarInfo(type) {
      if (type === "info") {
        this.activeNum = 1;
      } else if (type === "carManage") {
        this.isCarMange = true;
      } else if (type === "device") {
        this.activeNum = 3;
      } else if (type === "bg") {
        this.activeNum = 2;
      } else if (type === "lines") {
        this.activeNum = 4;
      } else if (type === "preserve") {
        this.$confirm("完成并保存拓扑图", "提示", {
          confirmButtonText: "保存",
          cancelButtonText: "继续编辑",
          type: "warning",
        })
          .then(() => {
            this.preserve();
          })
          .catch(() => {
            console.log("继续编辑拓扑图");
          });
      }
    },
    topoInfoConfirm() {
      this.$refs["topoInfoForm"].validate((valid) => {
        if (valid) {
          this.$refs.topoBar.initTopoInfo();
          this.$refs.topoBar.tbName = "bg";
          this.activeNum = 2;
        } else {
          return false;
        }
      });
    },

    hideCarManage() {
      this.isCarMange = false;
    },
    goEditLine() {
      this.$refs.topoBar.topobarClick("lines");
    },
    showDeviceInfo(e) {
      if (!this.topoObj.TOPO_TYPE) {
        this.$message.warning("请先选择要编辑拓扑图类型！");
        return;
      }
      this.activeNum = 3;
      if (this.chooseType === "deviceInfo") {
        this.$refs.deviceInfo.deviceInfo = e;
        this.deviceInfo = e;
        this.$refs.deviceInfo.init();
      } else {
        this.deviceInfo = e;
        this.chooseType = "deviceInfo";
      }
    },
    delDevice() {
      this.$refs.drawsvg.graph.removeNode(this.deviceInfo);
      this.deviceBack();
    },
    deviceBack() {
      this.$refs.drawsvg.graph.cleanSelection();
      this.barStu = "device";
      this.chooseType = "bar";
    },
    cancleEdit(){
      this.$emit("hideEdit");
          this.$store.commit("yqInfo/CHANGE_BSTU", 2);
    },
    hideEdit() {
      this.$confirm("需要保存拓扑图吗？", "提示", {
        confirmButtonText: "保存",
        cancelButtonText: "不保存",
        type: "warning",
      })
        .then(() => {
          this.preserve();
        })
        .catch(() => {
          this.cancleEdit()
        });
    },
    preserve() {
      if (this.$refs.topoBar && this.$refs.topoBar.tbName === "lines") {
        this.$refs.topoBar.linesOK();
      }
      this.topoObj.TOPO_DATA = this.$refs.drawsvg.getJson();
      this.$yqLoading.show();
      if (this.topoObj.ID) {
        this.$api
          .postServerAction("/insight/topology/edit", this.topoObj)
          .then((res) => {
            this.$yqLoading.hide();
            console.log("提交拓扑需改返回结果", res);
            if (res.code == 200) {
              this.$message.success("拓扑图保存成功");
              this.$store.commit("yqInfo/CHANGE_BSTU", 2);
              this.$emit("hideEdit");
            } else {
              this.$message.warning(res.message + " 保存失败");
            }
          });
      } else {
        this.$api
          .postServerAction("/insight/topology/create", this.topoObj)
          .then((res) => {
            this.$yqLoading.hide();
            // console.log("提交拓扑返回结果", res);
            if (res.code == 200) {
              this.$message.success("拓扑图保存成功");
              this.$store.commit("yqInfo/CHANGE_BSTU", 2);
              this.$emit("hideEdit");
            } else {
              this.$message.warning(res.info);
            }
          });
      }
    },
    saveSvg() {
      var svgXml = this.$refs.drawsvg.draw.node;
      let serializer = new XMLSerializer();
      let source =
        '<?xml version="1.0" standalone="no"?>\r\n' +
        serializer.serializeToString(svgXml);
      let image = new Image();
      image.src =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      let canvas = document.createElement("canvas");
      canvas.width = 824;
      canvas.height = 580;
      let context = canvas.getContext("2d");
      // context.fillStyle = "#fff";
      // context.fillRect(0, 0, 10000, 10000);
      context.drawImage(image, 0, 0);
      image.onload = function () {
        context.drawImage(image, 0, 0);
        let a = document.createElement("a");
        a.download = "nihao.png";
        a.href = canvas.toDataURL(`image/png`);
        a.click();
      };
      console.log("hahahahahah", svgXml);
    },
  },
};
</script>
<style lang="scss" scoped>
.fixed-step {
  position: fixed;
  right: 20px;
  top: 0px;
  height: 60vh;
  /* width: 100%; */
}

.topo-seat-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.topo-name-input {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
