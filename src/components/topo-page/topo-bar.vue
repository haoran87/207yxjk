<template>
  <div style="margin: 0 16px">
    <div v-if="tbName == 'bar'&& false">
      <div class="topo-name-input">
        <div style="width: 100%">名称：{{ TOPO_NAME }}</div>
        <!-- <tis-input
          placeholder="请输入拓扑名称"
          v-model="TOPO_NAME"
          disabled
          @blur="nameBlur"
        >
        </tis-input> -->
      </div>
      <div class="topo-name-input">
        <div style="width: 100%">编号：{{ TOPO_CODE }}</div>
        <!-- <tis-input
          placeholder="请输入拓扑编号"
          disabled
          v-model="TOPO_CODE"
          @blur="codeBlur"
        >
        </tis-input> -->
      </div>
      <div class="topo-name-input">
        <div style="width: 100%">
          类型：
          <span v-if="TOPO_TYPE === 'inside'">车内拓扑图</span>
          <span v-else-if="TOPO_TYPE === 'between'">车际拓扑图</span>
        </div>
        <!-- <el-radio-group
        disabled
          v-model="TOPO_TYPE"
          @change="typeChange"
          style="
            width: 100%;
            padding: 24px 0;
            text-align: left;
            font-size: var(--text-size-big);
          "
        >
          <el-radio label="inside">车内拓扑图</el-radio>
          <el-radio label="between">车际拓扑图</el-radio>
        </el-radio-group> -->
      </div>
      <div style="margin-top: 32px">
        <tis-button
          type="info"
          class="topo-bar-item"
          @click="topobarClick('info')"
          >编辑信息</tis-button
        >
      </div>
      <div>
        <tis-button
          type="danger"
          class="topo-bar-item"
          @click="topobarClick('bg')"
          >编辑背景</tis-button
        >
      </div>
      <div>
        <tis-button
          type="primary"
          class="topo-bar-item"
          @click="topobarClick('device')"
          >添加设备</tis-button
        >
      </div>
      <div>
        <tis-button
          type="danger"
          class="topo-bar-item"
          @click="topobarClick('lines')"
          >连接设备</tis-button
        >
      </div>
      <!-- <div  class="flex">
     
      </div> -->
      <div v-if="TOPO_TYPE == 'between'">
        <tis-button
          type="primary"
          class="topo-bar-item"
          @click="topobarClick('carManage')"
          >车辆管理</tis-button
        >
      </div>
    </div>
    <topo-bg-list v-else-if="tbName == 'bg'" @bgOk="bgOk"></topo-bg-list>
    <topo-device-list
      v-else-if="tbName == 'device'"
      @deviceOK="deviceOK"
	  :topoType='TOPO_TYPE'
    ></topo-device-list>
    <topo-line-list
      v-else-if="tbName == 'lines'"
      @linesOK="linesOK"
    ></topo-line-list>
  </div>
</template>
<script>
import topoBgList from "./topo-module/topo-bg-list.vue";
import TopoDeviceList from "./topo-module/topo-device-list.vue";
import TopoLineList from "./topo-module/topo-line-list.vue";
import bus from "@/utils/bus";
export default {
  components: { topoBgList, TopoDeviceList, TopoLineList },
  props: ["barStu", "topoObj"],
  data() {
    return {
      TOPO_NAME: "",
      TOPO_CODE: "",
      TOPO_TYPE: "",
      tbName: "",
      isLine: false,
    };
  },
  created() {
    this.tbName = this.barStu;
    this.initTopoInfo();
  },
  methods: {
    changeLineStus() {
      bus.$emit("topo-handle", {
        name: "changeLineStatus",
        isLine: false,
      });
    },
    linesOK(doType) {
      this.changeLineStus();
      this.isLine = false;
      this.tbName = "bar";
      if (doType === 2) {
        this.emitToParent("preserve");
      }
    },
    deviceOK() {
      this.emitToParent("lines");
      this.tbName = "lines";
      this.addEdges();
    },
    bgOk() {
      this.emitToParent("device");
      this.tbName = "device";
    },
    initTopoInfo() {
      this.TOPO_NAME = this.topoObj.TOPO_NAME;
      this.TOPO_CODE = this.topoObj.TOPO_CODE;
      this.TOPO_TYPE = this.topoObj.TOPO_TYPE;
    },
    delEdges() {
      bus.$emit("topo-handle", {
        name: "delEdges",
      });
    },
    addEdges() {
      this.isLine = true;
      bus.$emit("topo-handle", {
        name: "changeLineStatus",
        isLine: this.isLine,
      });
    },
    clearStorage() {
      localStorage.removeItem("antvTopo");
    },
    nameBlur() {
      this.$parent.$parent.$parent.topoObj.TOPO_NAME = this.TOPO_NAME;
    },
    codeBlur() {
      this.$parent.$parent.$parent.topoObj.TOPO_CODE = this.TOPO_CODE;
    },
    typeChange() {
      this.$parent.$parent.$parent.topoObj.TOPO_TYPE = this.TOPO_TYPE;
    },
    emitToParent(type) {
      this.$emit("emitToParent", type);
    },
    topobarClick(type) {
      if (type !== "info" && type !== "carManage") {
        this.tbName = type;
        if (type === "lines") {
          this.addEdges();
        }
      }

      this.emitToParent(type);
    },
  },
};
</script>
<style lang="scss" scoped>
.topo-bar-item {
  width: 100%;
  margin-top: 16px;
}

.topo-name-input {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  padding-top: 16px;
}
</style>