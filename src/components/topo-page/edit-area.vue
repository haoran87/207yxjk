<template>
  <div ref="editArea" style="height:100%">
    <div class="steps-box flex-center"  style="height:60px">
      <tis-steps simple :active="activeNum" style="width: 100%">
        <tis-step v-for="(step, index) in stepInfo" :key="index">
          <template v-slot:title>
            <span @click="stepClick(step.type)">{{
              step.title
            }}</span>
            </template>
          <template v-slot:icon><i :class="step.icon"></i></template>
        </tis-step>
      </tis-steps>
    </div>
    <div class="topo flex-center">
      <div class="svg-main alert-bg">
        <div id="svg"></div>
      </div>
    </div>
    <div style="height:60px" class="flex-center">
      <div class="flex" :style="{ width: $store.state.yqInfo.TOPOWITH*zoomNum + 'px' }">
        <div style="margin-right: 8px">
          <tis-switch
            v-model="isForce"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="chooseForce"
          >
          </tis-switch>
        </div>
        <div style="width: 320px; text-align: left">
          <span v-if="isForce === '0'">已关闭力导向效果</span>
          <span v-else-if="isForce === '1'">已开启力导向效果  
            <tis-button @click="()=>$emit('scan')" type="text">查看</tis-button>
            </span>
         
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Graph, Addon } from "@antv/x6";
import { svgMixin } from "@/utils/topoMixins/svgMixin";
import { svgclick } from "@/utils/topoMixins/svgClick";
import { drawLine } from "@/utils/topoMixins/drawLine";
import { editHandle } from "@/utils/topoMixins/editHandle";
import bus from "@/utils/bus";
export default {
  mixins: [svgMixin, svgclick, drawLine, editHandle],
  props: ["topoObj", "activeNum"],
  data() {
    return {
      graph: null,
      dnd: null, //拖拽插件
      isLine: false,
      lineNode: null,
      lineEdge: null,
      container: null,
      testLine: null,
      bgInfo: null,
      svgObj: null,
      startDraw: false,
      stepInfo: [
        {
          title: "编辑信息",
          icon: "el-icon-info",
          type: "info",
        },
        {
          title: "编辑背景",
          icon: "el-icon-connection",
          type: "bg",
        },
        {
          title: "添加设备",
          icon: "el-icon-folder",
          type: "device",
        },
        {
          title: "连接设备",
          icon: "el-icon-folder",
          type: "lines",
        },
        // {
        //   title: "保存",
        //   icon: "el-icon-folder",
        //   type:'preserve'
        // },
      ],
      isForce: "0",
      zoomNum:1.8
    };
  },
  created() {
    // if(this.$platform.type === "pc"){
    //   this.zoomNum = 1.8;
    // }
    // else if(this.$platform.type === 'pad'){
    //   this.zoomNum = 0.7
    // }
    this.isForce = this.topoObj.SHOW_TYPE;
    if (this.topoObj.TOPO_DATA) {
      this.svgObj = JSON.parse(this.topoObj.TOPO_DATA);
    }
  },
  mounted() {
    let react = this.$refs.editArea.getBoundingClientRect()
    let hZoom = (react.height - 120 - 32) / this.$store.state.yqInfo.TOPOHEIGHT;
    this.zoomNum = hZoom
    // this.draw = this.$svg().addTo("#svg").size("100%", "100%");
    // this.initDraw();
    this.createTopo();
    this.addWatcher();
  },
  computed: {
    topoStatusImageChange() {
      return this.$store.state.yqInfo.topoStatusImageChange;
    },
  },
  watch: {
    topoStatusImageChange() {
      this.getTopologySubjectObject();
    },
  },
  methods: {
    chooseForce() {
      this.$emit("changeShowType", this.isForce);
    },
    stepClick(type) {
      this.$emit("stepClick", type);
    },
    createTopo() {
      let _this = this;
      //获取缓存的各个类型的拓扑图状态图片信息
      let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      this.container = document.getElementById("svg");
      this.graph = new Graph({
        container: this.container,
        panning: false,
        // autoResize: true,
        // resizing: true,
        width: this.$store.state.yqInfo.TOPOWITH,
        height: this.$store.state.yqInfo.TOPOHEIGHT,
        interacting: {
          edgeMovable: false,
        },
        translating: {
          restrict: true, // 节点的可移动范围，如果设置为 true, 节点不能移动超出画布区域
        },
        selecting: {
          enabled: true, //可点击选择
          multiple: false, //可多选，启用多选后按住 ctrl 或 command 键点击节点实现多选
          //rubberband: true, //可框选
          //movable: false, //在多选情况下，选中的节点是否一起移动，设置为 true 时，拖动选框框选的节点一起移动，默认为 true。
          showNodeSelectionBox: true, //显示节点选中的框
          //showEdgeSelectionBox: true, //显示边选中的框
        },
      });
      //启动点击可选择元素
      //this.graph.enableSelection()

      //初始化Dnd拖拽插件
      this.dnd = new Addon.Dnd({
        target: this.graph,
        scaled: false,
        animation: false,
        validateNode: (e) => {
          if (_this.topoObj.TOPO_TYPE === "between") {
            let nodes = _this.graph.getNodes();
            let tnode = nodes.find((el) => {
              return (
                e.data.device_id === el.data.device_id &&
                e.data.device_name === el.data.device_name &&
                e.data.device_ip === el.data.device_ip
              );
            });
            if (tnode) {
              _this.$message.error("该车辆已经添加到拓扑图了");
              return false;
            }
            return true;
          }
          return true;
        },
        getDropNode: (node) => {
          if (_this.topoObj.TOPO_TYPE === "between") {
            bus.$emit("car-handle", {
              name: "changeCarList",
              node: node,
            });
          }
          const { width, height } = node.size();
          return node.clone().size(width, height);
        },
      });
      if (this.svgObj) {
        let topoJson = this.svgObj.topoJson;
        this.updateBg(this.svgObj.bgInfo);
        this.graph.fromJSON(topoJson);
        this.zoom()
        this.graph.getNodes().forEach((element) => {
          //拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的，其他设备类型默认展示正常状态的图片
          if (
            element.data.device_type &&
            element.attrs.image &&
            element.data.device_type != "lineRouter" &&
            element.data.device_type != "shine"
          ) {
            let img = topoStatusImage[element.data.device_type]["0"];
            if (img) {
              let imgurl = this.$store.state.yqInfo.serverIp + img;
              element.setAttrs({ image: { "xlink:href": imgurl } });
            } else {
              //未找到相应状态图片的，设为未找到图片
              let imgurl =
                this.$store.state.yqInfo.serverIp + window.NOTFOUNDIMGAGE;
              element.setAttrs({ image: { "xlink:href": imgurl } });
            }
          }
        });
        this.lineRouterToggle(false);
      } else {
        this.svgObj = {
          imgs: {},
          bgInfo: {},
          topoJson: {},
        };
      }
      this.initClicks();
      this.initRemovedListener();
      // this.initShines()
      // let nodes = this.graph.getNodes();
      // let edges = this.graph.getEdges();
      // console.log("拓扑图元素", nodes, edges);
      // this.addcylinder();
      // this.addPolyLine(testEdge)
      // this.testLine = this.graph.addEdge(testEdge);
      // this.addUfo()
    },

    getJson() {
      this.graph.getNodes().forEach((el) => {
        el.removeTools();
      });

      let gj = this.graph.toJSON();
      this.svgObj.topoJson = gj;
      localStorage.removeItem("topoPng");
      // this.graph.toSVG(
      //   (topoImg) => {
      //     localStorage.setItem("topoPng", topoImg);
      //   },
      //   {
      //     preserveDimensions: {
      //       width: 300,
      //       height: 300,
      //     },
      //     stylesheet: `
      //       image {
      //         width:28px,
      //         height:72px,
      //       }
      //     `,
      //   }
      // );
      // localStorage.setItem("antvTopo", JSON.stringify(this.svgObj));
      return JSON.stringify(this.svgObj);
      // console.log("拓扑图的json数据", gj);
    },
     zoom() {
      this.graph.resize(
        this.$store.state.yqInfo.TOPOWITH * this.zoomNum,
        this.$store.state.yqInfo.TOPOHEIGHT * this.zoomNum
      );
      this.graph.zoomTo(this.zoomNum, {
        center:
          (this.$store.state.yqInfo.TOPOWITH,
          this.$store.state.yqInfo.TOPOHEIGHT),
      });
    },
    clearJson() {
      localStorage.removeItem("antvTopo");
      localStorage.removeItem("topoObj");
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
            //刷新正在编辑的拓扑图的展示图片
            that.changeEditTopo();
          }
        });
    },
    //刷新正在编辑的拓扑图的展示图片
    changeEditTopo() {
      //获取缓存的各个类型的拓扑图状态图片信息
      let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      this.graph.getNodes().forEach((element) => {
        //拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的，其他设备类型默认展示正常状态的图片
        if (
          element.data.device_type &&
          element.attrs.image &&
          element.data.device_type != "lineRouter" &&
          element.data.device_type != "shine"
        ) {
          let img = topoStatusImage[element.data.device_type]["0"];
          if (img) {
            let imgurl = this.$store.state.yqInfo.serverIp + img;
            element.setAttrs({ image: { "xlink:href": imgurl } });
          } else {
            //未找到相应状态图片的，设为未找到图片
            let imgurl =
              this.$store.state.yqInfo.serverIp + window.NOTFOUNDIMGAGE;
            element.setAttrs({ image: { "xlink:href": imgurl } });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.steps-box {
  margin: 0 16px;
  // height: 80px;
}
.el-steps--simple {
    padding: 13px 6%;
}
.svg-main {
  margin-top: 16px;
  /* width: 824px;
  height: 580px; */
}
</style>
