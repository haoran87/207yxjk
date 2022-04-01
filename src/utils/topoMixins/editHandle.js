import bus from "@/utils/bus";
export const editHandle = {
    methods: {
        initRemovedListener() {
            this.onEdgeRemoved();
            this.onNodeRemoved();
        },
		//添加拓扑图元素
        addWatcher() {
            bus.$off("topo-handle")
            bus.$on("topo-handle", (e) => {
                if (e.name === 'drawBg') {
                    let carbg = e.data.PATH;
                    this.svgObj.bgInfo.image = carbg;
                    this.updateBg(this.svgObj.bgInfo)
                }
                else if(e.name === "clearBg"){
                    this.svgObj.bgInfo.image = "";
                    this.graph.clearBackground();
                }
                else if (e.name === 'addDevice') {
                    // console.log("添加的设备新嘻嘻嘻", e.device)
					let device
					if(e.topoType === 'inside'){
						device = e.device;
					}
					else if(e.topoType === 'between'){
						device = e.carDevice
					}
					if(device){
						let imgUrl = this.$store.state.yqInfo.serverIp + device.status_list[0].img_path
						let deviceInfo = {
						    device_id: device.ID,
						    device_name:device.name,
						    device_ip: '',
						    device_type:device.code,
						    device_topo:'',
						    car_info:"",
						}
						//this.addDevice(str, data)
						//获取要拖拽进入的临时节点，将设备信息设置进去
						let node = this.getAddNode(imgUrl, deviceInfo,e.topoType) 
						if(e.topoType === 'between'){
                            node.setAttrs({ text: { text: e.device.name } });
                            node.setData({ device_name: e.device.name });
                            node.setData({ device_ip: e.device.ip });
                            node.setData({ car_info: e.device});
                            if(e.device.name == '本车'){
                                node.setData({isStarCar:true});
                            }
                            else{
                                node.setData({isStarCar:false});
                            }
							
						}
						//开始x6的拖拽方法
						this.dnd.start(node, e.event)
					}

                }
                else if (e.name === "changeLineStatus") {
                    // console.log("ffffff",this.lineEdge)
                   if(!e.isLine && this.lineEdge){
                       this.graph.removeEdge(this.lineEdge)
                       this.lineNode = null;
                   }
                   if(e.isLine){
                    this.graph.disableSelection()
                   }
                   else{
                    this.graph.enableSelection()
                   }
                    this.lineStatus(e.isLine)
                }
                else if (e.name === "delEdges") {
                    let edges = this.graph.getEdges()
                    if (edges.length > 0) {
                        // let edge = edges[edges.length - 1]
                        // this.graph.removeEdge(edge)
                        // this.lineNode = null;
                        // this.lineEdge = null;
                        // this.container.removeEventListener("mousemove", this.onMouseMove);
                    }
                }
            });
        },
		
		getAddNode(imgUrl, deviceInfo,ty) {
            let w = 28 * 1.3;
            let h = 47 * 1.3;
            let refy = '0'
            if(ty === 'between'){
                w = 28 * 3;
                h = 47 * 3;
                 refy =  h / 4 + ''
            }
		  //创建子拓扑节点
		  let newNode = this.graph.createNode({
		    shape: "image",
		    width: w, // Number，可选，节点大小的 width 值
		    height: h, // Number，可选，节点大小的 height 值
		    // label: "hello", // String，节点标签,
		    zIndex: 3,
		    markup: [
		      { tagName: 'image', selector: 'body' },
		      { tagName: 'circle', selector: 'port' },
		      { tagName: 'text' },
		    ],
		    attrs: {
		      image: {
		        "xlink:href": imgUrl,
		      },
		      body: {
		    		
		      },
		      port: {
		        cx: w/2,
		        cy: h/2,
		        r: 0,
		        strokeWidth: 1,
		        stroke: 'red',
		        fill: "none",
		        visible: true,
		      },
		      text: {
		        text: "",
		        fill: '#fff',
		        fontSize: 13,
		        refX: 0.5,
		        refY: refy,
		        refY2: 4,
		      },
		    },
		    data: deviceInfo,
		  })
		  return newNode
		},
		
		
        initShines() {
            if (!this.svgObj.imgs['shine']) {
                this.svgObj.imgs['shine'] = {};
                let imgPaths = {
                    "0": 'onlineShine.png',
                    '10': 'shine-warnning.png',
                    '20': "shine-danger.png",
                    'offline': "shine-offline.png",
                }
                for (let key in imgPaths) {
                    let timg = require('@/assets/img/' + imgPaths[key])
                    if (timg) {
                        this.getImgBase64(timg, (str) => {
                            this.svgObj.imgs['shine'][key] = str;
                        })
                    }
                }
            }

        },

        image2Base64(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL("image/png");
            return dataURL;
        },
        getImgBase64(imgUrl, callback) {
            var img = new Image();
            img.crossOrigin = '';
            img.src = imgUrl;
            img.onload = () => {
                let base64 = this.image2Base64(img);
                callback(base64)
                // alert(base64);
            }
        },
        getBase64(imgurl) {
            console.log(window.URL, "uuuuuurrrrlllll")
            window.URL = window.URL || window.webkitURL;
            var xhr = new XMLHttpRequest();
            xhr.open("get", imgurl, true);
            // 至关重要
            xhr.responseType = "blob";
            xhr.onload = function () {
                if (this.status == 200) {
                    //得到一个blob对象
                    var blob = this.response;
                    console.log("blob", blob)
                    // 至关重要
                    let oFileReader = new FileReader();
                    oFileReader.onloadend = function (e) {
                        let base64 = e.target.result;
                        console.log("方式一》》》》》》》》》", base64)
                    };
                    oFileReader.readAsDataURL(blob);
                    //====为了在页面显示图片，可以删除====
                    var img = document.createElement("img");
                    img.onload = function () {
                        window.URL.revokeObjectURL(img.src); // 清除释放
                    };
                    let src = window.URL.createObjectURL(blob);
                    img.src = src
                    console.log(img.src, 'ssssddddd')
                    // document.getElementById("container1").appendChild(img);
                    //====为了在页面显示图片，可以删除====

                }
            }
            xhr.send();
        },
        onEdgeRemoved() {
            // this.graph.on('edge:removed', ({ edge }) => {
            //     console.log("监听到边 被删除 &&&",edge)
               
            // })
        },
		onNodeRemoved(){
			this.graph.on('node:removed', () => {
			    // console.log("监听到 设备 被删除 ***",node)
			   this.$emit("delDevice");
			})
		}
    }
}