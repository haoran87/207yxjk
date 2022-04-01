<template>
  <div>
    <div class="flex-column-center" :style="homesvgStyle">
      <div id="homeSvg"></div>
    </div>
  </div>
</template>
<script>
import { Graph } from "@antv/x6";
import { svgMixin } from "@/utils/topoMixins/svgMixin";
import { GFORCE } from "@/utils/topoMixins/home-force";
export default {
  mixins: [svgMixin, GFORCE],
  //   props: ["svgObj"],
  data() {
    return {
      shinePath: require("../../assets/img/shine.png"),
      offShinePath: require("../../assets/img/offlineShine.png"),
      warningShinePath: require("../../assets/img/warningShine.png"),
      dangerShinePath: require("../../assets/img/dangerShine.png"),
      seatPath: require("../../assets/img/seat.png"),
      offlineSeatPath: require("../../assets/img/offlineSeat.png"),
      warningSeatPath: require("../../assets/img/warningSeat.png"),
      dangerSeatPath: require("../../assets/img/dangerSeat.png"),
      shine: null,
      offshine: null,
      aniTimer: null,
      comInfo: null,
      svgObj: null,
      topoObj: null,
      deviceTimer: null,
      deviceNum: 10,
      testNum: 1,
      gradient: null,
      initOK: false,
      scaleNum: 1,
      bg: null,
      deviceList: [],
      seatPathObj: {
        0: "seatPath",
        10: "warningSeatPath",
        20: "dangerSeatPath",
        offLine: "offlineSeatPath",
      },
      shinePathObj: {
        0: "shinePath",
        10: "warningShinePath",
        20: "dangerShinePath",
        offLine: "offShinePath",
      },
      homesvgStyle: {},
      graph: null,
      isCar: false,
      starNode: null,
      now: 0, //当前时间
      showForce: false,
      originData: {
        nodes: [],
        edges: [],
      },
      forceGraph: null,
      devInfo: {},
      isClick: false,
    };
  },
  created() {},
  mounted() {
    // this.draw = this.$svg();
    this.initDeviceTimer();
  },
  destroyed() {
    clearInterval(this.deviceTimer);
    this.deviceTimer = null;
  },
  watch: {
    "$store.state.yqInfo.listenStu"() {
      //修改全局ip监听
      if (this.$store.state.yqInfo.ipCheckedStu) {
        this.$store.commit("yqInfo/SET_IPCHECKEDSTU", false);
      }

      if (this.initOK) {
        this.deviceNum = 10;
        if (this.showForce) {
          this.changeForceState();
        } else {
          if (!this.isCar) {
            this.changeDeviceState(this.$store.state.yqInfo.chooseIP);
          } else {
            this.getCarState();
          }
        }
      }
    },
  },
  methods: {
    initForce() {
      this.originData.nodes = [];
      this.originData.edges = [];
      this.devInfo = {};
      this.svgObj.topoJson.cells.forEach((cell) => {
        if (cell.shape === "edge") {
          let temObj = {
            source: cell.source.cell,
            target: cell.target.cell,
          };
          this.originData.edges.push(temObj);
        } else {
          this.devInfo[cell.id] = cell.data;
          this.devInfo[cell.id].stuStr = "";
          // let dv = ipList.find((el) => {
          //   return el.type === cell.data.device_type && !el.isChoose;
          // });
          // if (dv) {
          //   dv.isChoose = true;
          //   this.devInfo[cell.id].device_ip = dv.ip;
          // }
          let temObj = {
            id: cell.id,
            // type:'image',
            size: 60,
            x: cell.position.x,
            y: cell.position.y,
            label: cell.data.device_name,
            anchorPoints: [],
            devInfo: {
              ...this.devInfo[cell.id],
            },
            labelCfg: {
              style: {
                fill: "#000",
              },
            },
            style: {
              fill: "#fc0",
              // img:
              //   this.$store.state.yqInfo.serverIp +
              //   this.$store.state.yqInfo.topoStatusImage[cell.data.device_type][
              //     "0"
              //   ],
            },
          };
          this.originData.nodes.push(temObj);
        }
      });
      this.createLayout();
    },
    initDraw() {
      let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      //console.log("状态图片首页：",topoStatusImage)
      this.isCar = this.topoObj.TOPO_TYPE === "between";
      // console.log("首页初始化拓扑图是  iip = ", ipList);
      // console.log("初始化拓扑图的类型", this.topoObj.TOPO_TYPE);
      this.container = document.getElementById("homeSvg");
      this.graph = new Graph({
        container: this.container,
        panning: false,
        // autoResize: true,
        // resizing: true,
        width: this.$store.state.yqInfo.TOPOWITH,
        height: this.$store.state.yqInfo.TOPOHEIGHT,
        interacting: {
          edgeMovable: false,
          nodeMovable: false,
        },
      });
      if (this.svgObj) {
        let topoJson = this.svgObj.topoJson;
        this.updateBg(this.svgObj.bgInfo);
        this.graph.fromJSON(topoJson);
        this.zoom();
        this.onDeviceClick();
        this.onMouseenter();
        this.onMouseleave();
        //设置所有拓扑图元素的默认展示图片
        this.graph.getNodes().forEach((element) => {
          //拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的，其他设备类型默认展示离线状态的图片
          if (
            element.data.device_type &&
            element.attrs.image &&
            element.data.device_type != "lineRouter" &&
            element.data.device_type != "shine"
          ) {
            let img = topoStatusImage[element.data.device_type]["offline"];
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

        if (this.isCar) {
          //获取本车
          this.getStarCar();
          this.$emit("getComInfo", null);
        } else {
          this.changeDeviceState(this.$store.state.yqInfo.chooseIP);
        }

        this.initOK = true;
        // this.lineRouterToggle(false);
      }
    },
    //初始化更新设备ip
    updateDeviceIp(ipList) {
      //车内拓扑图，自动将设备ip与拓扑图中的元素绑定
      this.graph.getNodes().forEach((element) => {
        //排除线和光点元素（如果后期有其他类型的非接入的采集信息的设备类型，也应该排除掉）
        if (
          element.data.device_type &&
          element.data.device_type != "lineRouter" &&
          element.data.device_type != "shine"
        ) {
          //将ip与对应类型的节点进行绑定
          let dv = ipList.find((el) => {
            return el.type === element.data.device_type && !el.isChoose;
          });
          if (dv) {
            dv.isChoose = true;
            element.setData({ device_ip: dv.ip });
          }
        }
      });
    },
    //定时变更设备状态
    changeDeviceState(ip) {
      let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      let device;
      this.$getDeviceState((res) => {
        if (res.code == 200) {
          this.updateDeviceIp(res.data);
          this.graph.getNodes().forEach((element) => {
            //拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的，根据状态显示对应状态的图片
            if (
              element.data.device_type &&
              element.attrs.image &&
              element.data.device_type != "lineRouter" &&
              element.data.device_type != "shine"
            ) {
              // console.log("社和和恶化",element.data.device_ip)
              let ipObj = res.data.find((el) => {
                return element.data.device_ip === el.ip;
              });
              let status = -1; //默认设置为离线状态，防止最新的状态列表中没有该ip的设备，获取不到最新状态值
              if (ipObj) {
                status = ipObj.status;
              }
              //如果状态值小于0，则表示离线
              if (status < 0) {
                status = "offline";
              }
              //设置对应状态的设备图片
              let img = topoStatusImage[element.data.device_type][status];
              if (img) {
                let imgurl = this.$store.state.yqInfo.serverIp + img;
                element.setAttrs({ image: { "xlink:href": imgurl } });
              } else {
                //未找到相应状态图片的，设为未找到图片
                let imgurl =
                  this.$store.state.yqInfo.serverIp + window.NOTFOUNDIMGAGE;
                element.setAttrs({ image: { "xlink:href": imgurl } });
              }

              if (element.data.device_ip === ip) {
                device = element;
                let shineNode = this.graph.getNodes().find((el) => {
                  return el.data.device_name === "shine";
                });
                let addt =
                  shineNode &&
                  shineNode.data.node_id === device.id &&
                  shineNode.data.node_status === status;
                if (!addt) {
                  this.addShine(
                    device,
                    status //this.svgObj.imgs.shine[status]
                  );
                }

                if (
                  status !== "offline" &&
                  element.data.device_type === "device"
                ) {
                  this.getTerminalLinePoint(device);
                } else {
                  this.stopAniFunc();
                }
                let deviceInfo = {
                  ...device.data,
                  deviceState: status,
                };
                this.$emit("getComInfo", deviceInfo);
              }
            }
          });
          if (!device) {
            if (res.data.length > 0) {
              this.$message.warning("拓扑图设备没有添加该IP,请添加或修改");
            }
          }
        }
        if (!device) {
          this.removeShine();
          this.stopAniFunc();
          this.$emit("getComInfo", null);
        }
      });
    },
    getCarState() {
      let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      this.$api
        .getServerAction("/insight/connectionNode/allConnectionNodeStatus")
        .then((res) => {
          if (res.code == 200) {
            this.graph.getNodes().forEach((el) => {
              if (el.id !== this.starNode.id) {
                if (el.data.car_info) {
                  let studata = res.data.find((sel) => {
                    return sel.ip === el.data.car_info.ip;
                  });
                  if (studata) {
                    //如果状态值小于0，表示离线
                    if (studata.status < 0) {
                      studata.status = "offline";
                    }
                    //设置对应状态的设备图片
                    let img =
                      topoStatusImage[el.data.device_type][studata.status];
                    if (img) {
                      let imgurl = this.$store.state.yqInfo.serverIp + img;
                      el.setAttrs({ image: { "xlink:href": imgurl } });
                    } else {
                      //未找到相应状态图片的，设为未找到图片
                      let imgurl =
                        this.$store.state.yqInfo.serverIp +
                        window.NOTFOUNDIMGAGE;
                      el.setAttrs({ image: { "xlink:href": imgurl } });
                    }
                    //设置节点信息
                    el.data.car_info.stuStr = this.stuStrs[studata.status];
                    el.data.car_info.check_time = studata.check_time;
                  }
                }
              } else {
                //设置本车为正常状态图片 拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的
                if (
                  el.data.device_type &&
                  el.attrs.image &&
                  el.data.device_type != "lineRouter" &&
                  el.data.device_type != "shine"
                ) {
                  let img = topoStatusImage[el.data.device_type]["0"];
                  if (img) {
                    let imgurl = this.$store.state.yqInfo.serverIp + img;
                    el.setAttrs({ image: { "xlink:href": imgurl } });
                  } else {
                    //未找到相应状态图片的，设为未找到图片
                    let imgurl =
                      this.$store.state.yqInfo.serverIp + window.NOTFOUNDIMGAGE;
                    el.setAttrs({ image: { "xlink:href": imgurl } });
                  }
                }
              }
            });
          }
        });
    },
    getStarCar() {
      let nodes = this.graph.getNodes();
      this.starNode = nodes.find((el) => {
        return el.data.isStarCar;
      });
      // for (let i = 0; i < nodes.length; i++) {
      //   let device = nodes[i];
      //   let isStar = true;
      //   this.graph.getEdges().forEach((edge) => {
      //     if (isStar) {
      //       isStar =
      //         device.id === edge.getTarget().cell ||
      //         device.id === edge.getSource().cell;
      //     }
      //     // console.log("十名行车吗？", isStar);
      //   });
      //   if (isStar) {
      //     this.starNode = device;
      //     break;
      //   }
      // }
      //获取最新状态
      this.getCarState();
    },
    onDeviceClick() {
      this.graph.on("node:click", (e) => {
        if (this.isClick) return;
        this.isClick = true;
        let device = e.node;
        if (this.isCar) {
          if (this.starNode.id === device.id) {
            this.$api
              .getServerAction("/insight/topology/getShowTopology")
              .then((res) => {
                if (res.code == 200) {
                  let carTopo = res.data;
                  if (carTopo) {
                    this.$store.commit("yqInfo/CHANGE_TOPO", carTopo.ID);
                    this.$emit("changeTopo", carTopo);
                  }
                }
              });
          }
        } else if (device.data.device_type !== "shine") {
          if (device.data.device_ip) {
            if (this.$store.state.yqInfo.chooseIP != device.data.device_ip) {
              this.$getDeviceState((res) => {
                if (res.code == 200) {
                  let ds = false;
                  let ipObj = res.data.find((el) => {
                    return el.ip === device.data.device_ip;
                  });
                  if (ipObj) {
                    ds = ipObj.status != -1;
                    if (ds) {
                      let chooseIpObj = {
                        ip: device.data.device_ip,
                        connectedStu: ds,
                      };
                      this.$store.commit("yqInfo/CHANGE_IP", chooseIpObj);
                    } else {
                      this.$message.warning("设备处于离线状态");
                    }
                  } else {
                    this.$message.warning("没有获取该设备的ip信息！");
                  }
                }
              });
            }
          } else {
            this.$message.warning("设备没有添加该IP,请添加或修改");
          }
        }
        setTimeout(() => {
          this.isClick = false;
        }, 100);
      });
    },
    onMouseenter() {
      let that = this;
      this.graph.on("node:mouseenter", ({ e, node, view }) => {
        if (this.isCar) {
          //本地节点不显示信息
          if (node.id !== that.starNode.id) {
            let bbox = view.getBBox();
            // let data = {
            //   left:
            //     bbox.x +
            //     (this.$parent.$el.clientWidth -
            //       this.$store.state.yqInfo.TOPOWITH * this.scaleNum) /
            //       2 +
            //     bbox.width,
            //   top:
            //     bbox.y +
            //     (this.$parent.$el.clientHeight -
            //       this.$store.state.yqInfo.TOPOHEIGHT * this.scaleNum) /
            //       2,
            //   info: node.data.car_info,
            // };
            let etbox = e.target.getBoundingClientRect();
            let data = {
              left: etbox.left + bbox.width,
              top: etbox.top,
              info: node.data.car_info,
            };
            this.$emit("showCarInfo", data);
          }
        }
      });
    },
    onMouseleave() {
      this.graph.on("node:mouseleave", ({ e }) => {
        if (this.isCar) {
          this.$emit("hideCarInfo", e);
        }
      });
    },
    initDeviceTimer() {
      if (this.deviceTimer === null) {
        this.deviceTimer = setInterval(() => {
          if (this.deviceNum > 0) {
            this.deviceNum -= 1;
            return;
          }
          this.deviceNum = 10;
          if (this.showForce) {
            this.changeForceState();
          } else {
            if (!this.isCar) {
              this.changeDeviceState(this.$store.state.yqInfo.chooseIP);
            } else {
              this.getCarState();
            }
          }
        }, 1000);
      }
    },

    zoom() {
      this.graph.resize(
        this.$store.state.yqInfo.TOPOWITH * this.scaleNum,
        this.$store.state.yqInfo.TOPOHEIGHT * this.scaleNum
      );
      this.graph.zoomTo(this.scaleNum, {
        center:
          (this.$store.state.yqInfo.TOPOWITH,
          this.$store.state.yqInfo.TOPOHEIGHT),
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topo {
  margin-bottom: 16px;
  height: calc(1200px - 284px - 32px);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>