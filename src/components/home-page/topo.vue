<template>
  <div>
    <div
      class="topo-grid flex-column-center"
      :style="{
        height: topoHeight,
        backgroundImage: backgroundImg,
        backgroundSize: '100% 100%',
      }"
    >
      <home-svg
        ref="homeSvg"
        @getComInfo="getComInfo"
        @showCarInfo="showCarInfo"
        @hideCarInfo="hideCarInfo"
        @svgInfo="initSvgInfo"
        @changeTopo="changeTopo"
      ></home-svg>
      <div class="topo-name font-e">
        <div class="name-line1"></div>
        <div class="name-line2"></div>
        <div>{{ titleMsg }}</div>
        <div class="name-line3"></div>
      </div>
      <div class="info-box module-bg" v-if="comInfo">
        <div class="car-info-title">设备信息</div>
        <div class="car-info-con">
          <div>设备名称：{{ comInfo.device_name }}</div>
          <div>设备IP：{{ comInfo.device_ip }}</div>
          <div>
            设备状态：
            <span v-if="comInfo.deviceState == '0'">正常</span>
            <span v-if="comInfo.deviceState == '10'">一般警告</span>
            <span v-if="comInfo.deviceState == '20'">严重警告</span>
            <span v-if="comInfo.deviceState == 'offline'">离线</span>
          </div>
        </div>
        <div class="border-top-line"></div>
        <div class="border-right-line"></div>
        <div class="border-angle border-top-left"></div>
        <div class="border-angle border-bottom-left"></div>
        <div class="border-angle border-bottom-right"></div>

        <div class="border-hypotenuse"></div>
        <div class="border-right-color"></div>
        <div class="border-top-color"></div>
      </div>
      <div class="car-info-pop" :style="carPopStyle" v-if="isShow">
        <div v-if="carInfo">
          <div style="margin-bottom: 0.5vw">名称：{{ carInfo.name }}</div>
          <div style="margin-bottom: 0.5vw">IP：{{ carInfo.ip }}</div>
          <div style="margin-bottom: 0.5vw" v-if="carInfo.type !== 'hide'">
            等级：{{
              carInfo.type == 1 ? "同级" : carInfo.type == 0 ? "上级" : "下级"
            }}
          </div>
          <div>状态：{{ carInfo.stuStr}}</div>
        </div>
        <div v-else>无相关信息</div>
      </div>
    </div>

    <!-- <div
      v-for="(de, idx) in deviceInfoList"
      :key="idx"
      class="device-info"
      :style="{
        top: de.rect.top - de.rect.height / 2 + 'px',
        left: de.rect.left - de.rect.width / 2 + 'px',
      }"
    >
      {{ de.name }}
    </div> -->
  </div>
</template>
<script>
import HomeSvg from "./home-svg.vue";
//indefinite

export default {
  props: ["topoHeight"],
  components: {
    // SubTitle,
    HomeSvg,
  },
  data() {
    return {
      titleMsg: "拓扑图",
      comInfo: null,
      topoObj: null,
      gridStyle: {},
      isShow: false,
      carInfo: null,
      carPopStyle: {},
      deviceInfoList: [],
      backgroundImg: "",
    };
  },
  created() {},
  mounted() {
    //获取所有拓扑图元素的状态图片对象
    this.getTopologySubjectObject();
    //设置拓扑图区域背景图地址
    this.backgroundImg =
      "url(" +
      this.$store.state.yqInfo.serverIp +
      "/insight/file/download/topo-background.png" +
      ")";
    if (this.topoHeight !== "0px") {
      this.$refs.homeSvg.scaleNum =
        Number(this.topoHeight.split("px")[0]) /
        this.$store.state.yqInfo.TOPOHEIGHT;
    }
  },
  watch: {
    topoHeight() {
      // let nomalHeight = 643.375;
      this.$refs.homeSvg.scaleNum =
        Number(this.topoHeight.split("px")[0]) /
        this.$store.state.yqInfo.TOPOHEIGHT;
      // console.log(
      //   "拓扑图区域的高度",
      //   this.topoHeight,
      //   this.$refs.homeSvg.scaleNum
      // );
    },
  },
  methods: {
    hideCarInfo() {
      this.isShow = false;
    },
    showCarInfo(e) {
      this.carPopStyle = {
        top: e.top + "px",
        left: e.left + "px",
      };
      this.carInfo = e.info;
      this.isShow = true;
    },
    //获取所有拓扑图元素的状态图片对象
    getTopologySubjectObject() {
      // let that = this
      this.$api
        .getServerAction("/insight/topoDevice/getTopologySubjectObject")
        .then((res) => {
          if (res.code == 200) {
            //console.log("状态图片信息", res.data)
            //缓存拓扑图状态图片信息
            if (res.data) {
              this.$store.commit("yqInfo/CHANGE_TOPO_IMAGE", res.data);
            }
            this.getTopo();
          }
        });
    },
    getTopo() {
      //wangtao 20211126 每次加载首页，默认加载默认拓扑图
      this.$api
        .getServerAction("/insight/topology/getShowTopology")
        .then((res) => {
          if (res.code == 200) {
            this.topoObj = res.data;
            this.$store.commit("yqInfo/CHANGE_TOPO", this.topoObj.ID);
            this.changeTopo(res.data);
          } else {
            this.$message.warning(res.info);
          }
        });
    },
    initSvgInfo(info) {
      this.titleMsg = info;
    },
    getComInfo(info) {
      this.comInfo = info;
    },
    topoEdit() {
      this.$emit("showEditTopo", this.$refs.homeSvg.topoObj);
    },
    changeTopo(e) {
      this.titleMsg = e.TOPO_NAME;
      this.$refs.homeSvg.topoObj = e;
      this.$refs.homeSvg.showForce = e.SHOW_TYPE === "1";
      this.$refs.homeSvg.svgObj = JSON.parse(e.TOPO_DATA);
      this.$getDeviceState((res) => {
        if (res.code == 200) {
          if (this.$refs.homeSvg.graph) this.$refs.homeSvg.graph.dispose();
          this.$refs.homeSvg.graph = null;
          this.comInfo = null;
          this.$refs.homeSvg.destroyForceGraph();

          if (this.$refs.homeSvg.showForce) {
            this.$refs.homeSvg.initForce(res.data);
          } else {
            this.$refs.homeSvg.initDraw(res.data);
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.device-info {
  position: fixed;
  opacity: 0.8;
}
.topo-grid {
  position: relative;
}
.topo-name {
  position: absolute;
  bottom: 2vw;
  left: 2vw;
  font-size: 1.2vw;
}
.name-line1 {
  width: calc(100% + 2vw);
  height: 0.1vw;
  background-color: var(--color-8);
  margin-bottom: 0.1vw;
}
.name-line2 {
  width: calc(100% + 1vw);
  height: 0.2vw;
  background-color: var(--color-6);
  margin-bottom: 0.6vw;
}
.name-line3 {
  width: calc(100% + 1vw);
  height: 0.1vw;
  background-color: var(--color-5);
  margin-top: 0.3vw;
}
.car-info-pop {
  position: fixed;
  padding: 0.5vw;
  text-align: left;
  font-size: var(--text-size-light);
  background-color: var(--layout-bg-3);
  border: 1px solid var(--color-5);
  border-radius: 0.1vw;
  z-index: 100;
}
.info-box {
  position: absolute;
  width: 15vw;
  border-left: #505350 solid 0.08vw;
  border-bottom: #505350 solid 0.08vw;
  /* border-radius: 0.15vw; */
  right: 4vw;
  top: 3vw;
  text-align: left;
  font-size: var(--text-size-small);
}
.car-info-title {
  padding: 0.5vw;
  border-bottom: #505350 solid 0.08vw;
}
.car-info-con {
  font-size: var(--text-size-small);
  color: var(--text-color-weak);
  padding: 0 0.5vw;
}
.car-info-con div {
  margin: 0.5vw 0;
}

.border-angle {
  position: absolute;
  width: 1vw;
  height: 1vw;
}
.border-top-left {
  border-top: var(--color-5) solid 0.1vw;
  border-left: var(--color-5) solid 0.1vw;
  top: -0.08vw;
  left: -0.08vw;
}
.border-bottom-left {
  border-bottom: var(--color-5) solid 0.1vw;
  border-left: var(--color-5) solid 0.1vw;
  bottom: -0.08vw;
  left: -0.08vw;
}
.border-bottom-right {
  border-bottom: var(--color-5) solid 0.1vw;
  border-right: var(--color-5) solid 0.1vw;
  bottom: -0.08vw;
  right: -0.08vw;
}
.border-top-line {
  border-top: #505350 solid 0.08vw;
  width: 14vw;
  top: -0.08vw;
  position: absolute;
}
.border-right-line {
  height: 7.4vw;
  border-left: #505350 solid 0.08vw;
  right: -0.08vw;
  bottom: -0.08vw;
  position: absolute;
}
.border-hypotenuse {
  border-top: var(--color-5) solid 0.1vw;
  position: absolute;
  width: 1.05vw;
  top: 0.24vw;
  right: -0.08vw;
  transform: rotate(45deg);
}
.border-right-color {
  border-right: var(--color-5) solid 0.1vw;
  height: 0.8vw;
  top: 0.65vw;
  right: 0vw;
  position: absolute;
}
.border-top-color {
  border-top: var(--color-5) solid 0.1vw;
  width: 0.8vw;
  top: -0.08vw;
  right: 0.8vw;
  position: absolute;
}
/* .border-top-right {
  border-top: var(--color-5) solid 0.1vw;
  border-right: var(--color-5) solid 0.1vw;
  top: -0.08vw;
  right: -0.08vw;
} */
</style>