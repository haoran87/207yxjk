import G6 from '@antv/g6';
import insertCss from 'insert-css';
insertCss(`
  .g6-tooltip {
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 18px;
    color: #fff;
    background-color: var(--layout-bg-3);
    padding: 10px 8px;
    text-align:left;
    width:240px;
  }
`);
insertCss(`
  .g6-component-tooltip {
    border: 1px solid var(--border-color);
    background-color: var(--layout-bg-3);
    padding: 10px;
    font-size: 14px;
    color: #fff;
    text-align:left;
    box-shadow:none;
  }
  .g6-component-tooltip li{
      margin-bottom:5px
  }
`);

//  // box-shadow: rgb(174, 174, 174) 0px 0px 10px;
export const GFORCE = {
    data() {
        return {
            stuColors: {
                "-1": '#D7D7D7',
                '10': '#FF853A',
                '20': '#FF3744',
                '0': '#fc0',
            },
            stuStrs: {
                "-1": '离线',
                '10': '一般警告',
                '20': '严重警告',
                '0': '正常',
                "offline": '离线',
            },
            test: -1,
        }
    },
    methods: {
        insideState() {
            this.$getDeviceState(res => {
             
                if (res.code === 200) {
                    this.updateDevIp(res.data);
                    res.data.forEach(element => {
                        let ip = element.ip;
                        for (let key in this.devInfo) {
                            if (this.devInfo[key].device_ip === ip) {
                                let targetNode = this.forceGraph.findById(key)
                                let stu = element.status;
                                if (targetNode) {
                                    if (ip === this.$store.state.yqInfo.chooseIP) {
                                        this.updateDeviceActive(targetNode, 3)
                                    }
                                    else {
                                        this.updateDeviceActive(targetNode, 0)
                                    }
                                    this.updateStatusBg(targetNode, stu)
                                    this.devInfo[key].stuStr = this.stuStrs[stu]
                                }

                            }
                        }
                    });
                }
            })
        },
        //跟新设备ip
        updateDevIp(ipList) {
            for (let key in this.devInfo) {
                let cell = this.devInfo[key];
                let dv = ipList.find((el) => {
                    return el.type === cell.device_type && !el.isChoose;
                });
                if (dv) {
                    dv.isChoose = true;
                    cell.device_ip = dv.ip;
                }
            }
        },
        betweenSate() {
            let that = this
            this.$api
                .getServerAction("/insight/connectionNode/allConnectionNodeStatus")
                .then(res => {
                    // console.log("是车际拓扑图", res, this.devInfo)
                    if (res.code === 200) {
                        res.data.forEach(element => {
                            for (let key in that.devInfo) {
                                if (that.devInfo[key].isStarCar) {
                                    let starNode = that.forceGraph.findById(key)
                                    this.updateStatusBg(starNode, "0")
                                }
                                else if (element.ip === that.devInfo[key].device_ip) {
                                    let targetNode = that.forceGraph.findById(key)
                                    let stu = element.status;
                                    if (targetNode) {
                                        this.updateStatusBg(targetNode, stu)
                                        that.devInfo[key].stuStr = this.stuStrs[stu]
                                    }
                                }
                            }
                        })
                    }

                })
        },
        updateDeviceActive(targetNode, w) {
            this.forceGraph.updateItem(targetNode, {
                stateStyles: {
                    activeStu: {
                        stroke: "red",
                        lineWidth: w,
                    },
                },
            })
        },
        updateStatusBg(targetNode, stu) {
            this.forceGraph.updateItem(targetNode, {
                stateStyles: {
                    statusBg: {
                        fill: this.stuColors[stu]
                    },
                },
            })
        },
        changeForceState() {
           
            if (this.topoObj.TOPO_TYPE === "between") {
                this.betweenSate()
            }
            else if (this.topoObj.TOPO_TYPE === "inside") {
                this.insideState()
            }
        },
        destroyForceGraph() {
            if (this.forceGraph) {
                this.forceGraph.clear()
                this.forceGraph.destroy()
                this.forceGraph = null;
            }
        },
        createLayout() {
            let that = this;
            const container = document.getElementById("homeSvg");
            const width = this.$store.state.yqInfo.TOPOWITH * this.scaleNum;
            const height = this.$store.state.yqInfo.TOPOHEIGHT * this.scaleNum;
            this.forceGraph = new G6.Graph({
                container: container,
                width,
                height,
                layout: {
                    type: "force",
                    preventOverlap: true,
                    linkDistance: 40,
                    nodeStrength: 0,
                    edgeStrength: 0,
                    nodeSpacing: (d) => {
                        if (d.id === 'nodes0') {
                            return 30
                        }
                        return 60;
                    },
                },
                defaultNode: {
                    size: 30,
                },
                nodeStateStyles: {
                    statusBg: {
                        fill: that.stuColors['-1']
                    },
                    activeStu: {
                        stroke: "red",
                        lineWidth: 0,
                    }
                },
                plugins: [this.creatToolTip()],
                modes: {
                    default: ['drag-canvas'],
                },
            });

            let data = this.originData;
            this.forceGraph.data({
                nodes: data.nodes,
                edges: data.edges.map(function (edge, i) {
                    edge.id = "edge" + i;
                    return Object.assign({}, edge);
                }),
            });
            this.forceGraph.render();
            this.forceGraph.zoom(
                this.scaleNum,
                {
                    x: this.$store.state.yqInfo.TOPOWITH * this.scaleNum / 2,
                    y: this.$store.state.yqInfo.TOPOHEIGHT * this.scaleNum / 2
                }
            )
            // let mode = this.forceGraph.getCurrentMode()
            let nodes = this.forceGraph.getNodes()
            nodes.forEach(el => {
                // this.forceGraph.setItemState(el, 'offLine', true);
                this.forceGraph.setItemState(el, 'statusBg', true);
                this.forceGraph.setItemState(el, 'activeStu', true);
            })
            this.changeForceState()
           
            this.onNodeClick();
            this.initOK = true;
            // this.forceGraph.on("node:mouseenter", (e) => {
            //     console.log("进区域了", e)
            // });
            // this.forceGraph.on("node:mouseout", (e) => {
            //     console.log("出区域了", e)
            // });
            if (typeof window !== "undefined")
                window.onresize = () => {
                    if (!this.forceGraph || this.forceGraph.get("destroyed")) return;
                    if (
                        !container ||
                        !container.scrollWidth ||
                        !container.scrollHeight
                    )
                        return;
                    this.forceGraph.changeSize(container.scrollWidth, container.scrollHeight);
                };

          
        },
        onNodeClick() {
            function refreshDragedNodePosition(e) {
                const model = e.item.get("model");
                model.fx = e.x;
                model.fy = e.y;
            }
            if (this.$store.state.yqInfo.platform === 'pad') {
                this.forceGraph.on("node:touchstart", (e) => {
                    let tem = this.devInfo[e.item.get("model").id];
                    let infoObj;
                    if (this.topoObj.TOPO_TYPE === "between") {
                        infoObj = tem.car_info;
                    }
                    else {
                        infoObj = {
                            name: tem.device_name,
                            ip: tem.device_ip,
                            type: 'hide'
                        }
                    }
                    if (!tem.isStarCar) {
                        let data = {
                            left: e.clientX,
                            top: e.clientY,
                            info: {
                                ...infoObj,
                                stuStr: tem.stuStr,
                            },
                        };
                        this.$emit("showCarInfo", data);
                    }

                    // this.forceGraph.layout();
                    // refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:touchmove", (e) => {
                    const forceLayout = this.forceGraph.get("layoutController").layoutMethods[0];
                    forceLayout.execute();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on('touchend', () => {
                    this.$emit("hideCarInfo");
                })
                this.forceGraph.on("node:touchend", (e) => {
                    let tem = this.devInfo[e.item.get("model").id];
                    let device = e.item.getModel();
                    if (this.topoObj.TOPO_TYPE === "between") {
                        if (tem.isStarCar) {
                            this.clickFunc(device)
                        }
                    }
                    else {
                        this.clickFunc(device)
                    }
                    this.forceGraph.layout();
                    refreshDragedNodePosition(e);
                    e.item.get("model").fx = null;
                    e.item.get("model").fy = null;
                });
            }
            else {
                this.forceGraph.on("node:dragstart", (e) => {
                    this.forceGraph.layout();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:drag", (e) => {
                    const forceLayout = this.forceGraph.get("layoutController").layoutMethods[0];
                    forceLayout.execute();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:dragend", (e) => {
                    e.item.get("model").fx = null;
                    e.item.get("model").fy = null;
                });

            }
            this.forceGraph.on('node:click', (ev) => {
                let device = ev.item.getModel();
                this.clickFunc(device)
            });
        },
        clickFunc(device) {
            if (this.topoObj.TOPO_TYPE === "between") {
                if (this.devInfo[device.id].isStarCar) {
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
            } else if (device.devInfo.device_type !== "shine") {
                let deviceIP = this.devInfo[device.id].device_ip;
                if (deviceIP) {
                    if (this.$store.state.yqInfo.chooseIP != deviceIP) {
                        this.$getDeviceState((res) => {
                            if (res.code == 200) {
                                let ds = false;
                                let ipObj = res.data.find((el) => {
                                    return el.ip === deviceIP;
                                });
                                if (ipObj) {
                                    ds = ipObj.status != -1;
                                    if (ds) {
                                        let chooseIpObj = {
                                            ip: deviceIP,
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
        },
        creatToolTip() {
            return new G6.Tooltip({
                offsetX: 0,
                offsetY: 0,
                fixToNode: [1, 1],
                itemTypes: ['node'],
                getContent: (e) => {
                    const outDiv = document.createElement('div');
                    outDiv.style.width = 'fit-content';
                    let info = this.devInfo[e.item.getModel().id]
                    let level = info.car_info.type == 1 ? '同级' : info.car_info.type == 0 ? '上级' : '下级'
                    let titleStr = this.topoObj && this.topoObj.TOPO_TYPE === "between" ? "车辆信息" : "设备信息"
                    //outDiv.style.padding = '0px 0px 20px 0px';
                    if (this.topoObj.TOPO_TYPE === "between") {
                        outDiv.innerHTML = `
                        <h4 style='text-align:center;margin-bottom:16px'>${titleStr}</h4>
                        <ul>
                          <li>名称:  ${info.device_name}</li>
                          <li>IP:${info.device_ip}</li>
                          <li>等级:${level}</li>
                          <li>状态:   ${info.stuStr} </li>
                        </ul>`;
                    }
                    else {
                        outDiv.innerHTML = `
                        <h4 style='text-align:center;margin-bottom:16px'>${titleStr}</h4>
                        <ul>
                          <li>名称:  ${info.device_name}</li>
                          <li>IP:${info.device_ip}</li>
                          <li>状态:   ${info.stuStr} </li>
                        </ul>`;
                    }
                    return outDiv;
                },
                shouldBegin: (e) => {
                    if (this.topoObj.TOPO_TYPE === "between") {
                        if (e.item.getModel().devInfo.isStarCar) {
                            return false;
                        }
                    }
                    return true;
                }
            });
        }
    }
}