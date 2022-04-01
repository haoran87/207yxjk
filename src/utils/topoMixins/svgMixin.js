import { Vector } from "@antv/x6";
// import { imgArr } from "../imgbase64";
export const svgMixin = {
  data() {
    return {
      pidx: 0,
      pathObj: null,
      stopAni: null,
      aniEdge: null,
      aniPath:null,
      moveDot:null,
    }
  },
  methods: {
    updateBg(bgInfo) {
      this.graph.clearBackground();
      let imgurl = '';
      if (bgInfo.image) {
        imgurl = this.$store.state.yqInfo.serverIp + bgInfo.image
      }
      let bf = {
        size: '98% 98%',
        image: imgurl,
      }
      this.graph.drawBackground(bf);
    },
    getTerminalLinePoint(node) {
      if (this.aniPath && this.aniPath.data.cloneId === node.data.aniPath) {
        return
      }
      this.stopAniFunc();
      if(node.data.aniPath){
        let fpath = this.graph.getEdges().find(el => {
          return el.id == node.data.aniPath;
        })
        // let pathObj = {
        //   zIndex:1,
        //   source: fpath.getTarget(),
        //   target: fpath.getSource(),
        //   vertices: fpath.getVertices().reverse(),
        //   attrs: {
        //       line: {
        //           targetMarker: null,
        //           stroke: "#A2B1C3",
        //           strokeWidth: 2,
        //       },
        //   },
        // }
        let pathObj = fpath.clone()
        this.aniPath = this.graph.addEdge(pathObj)
        this.aniPath.setData({cloneId:fpath.id})
        this.addPolyLine(this.aniPath)
       
      }
     
      
      // this.pathObj = {
      //   target: { cell: node.id, selector: 'port' },
      //   vertices: [],
      // }
      // let tpahtId = node.data.terminalPath
      // if (tpahtId) this.getPathPoints(tpahtId, "nodeEdge", node);

    },
    getPathPoints(edgeId, routerIdx, deviceNode) {
      let edges = this.graph.getEdges();
      let edge = edges.find(el => {
        return el.id == edgeId
      })
      if (!edge) return;
      if (routerIdx !== 'nodeEdge') {
        let vertices
        if (routerIdx === 'target') {
          vertices = edge.getVertices()
          vertices = vertices.concat(edge.getTarget())
        }
        else {
          vertices = edge.getVertices().slice(0, routerIdx + 1);
        }
        this.pathObj.vertices = vertices.concat(this.pathObj.vertices);
        // console.log("vertice",vertices,edge.getVertices())
      }
      else {
        let vertices = edge.getVertices();
        this.pathObj.vertices = vertices.concat(this.pathObj.vertices);
      }
      if (edge.data.sourceType === 'node') {
        this.pathObj.source = edge.getSource();
        // console.log("连接他的线",this.pathObj)
        let edgeObj = {
          source: this.pathObj.source,
          target: this.pathObj.target,
          vertices: this.pathObj.vertices,
          zIndex: 1,
          attrs: {
            line: {
              stroke: '',
              sourceMarker: {

              },
              targetMarker: {

              }
            },
          },
          data: {
            device_name: 'aniEdge',
            device_type: "aniEdge",
            device_node: deviceNode.id
          }
        }
        let aniEdge = this.graph.getEdges().find(el => {
          return el.data.device_name == 'aniEdge';
        })
        if (aniEdge) {
          if (aniEdge.data.device_node === deviceNode.id) {
            return
          }
        }
        this.stopAniFunc();
        this.addPolyLine(edgeObj)
      }
      else if (edge.data.sourceType === 'edge') {
        // console.log("连接了其他线",edge.data)
        this.getPathPoints(edge.data.edgeId, edge.data.vertexIndex, deviceNode)
      }

      // let
    },
    lineRouterToggle(isshow) {
      let nodes = this.graph.getNodes();
      nodes.forEach(element => {
        if (element.data.device_name === 'lineRouter') {
          isshow ? element.show() : element.hide()
        }
      });
    },
    addShine(deviceNode, status) {
      let pos = deviceNode.position()
      let imgPaths = {
        "0": 'onlineShine.png',
        '10': 'shine-warnning.png',
        '20': "shine-danger.png",
        'offline': "shine-offline.png",
      }
      let shineImg = require('@/assets/img/' + imgPaths[status])

      let shineData = {
        shape: "image",
        x: pos.x - (89 * 1.3 - (28 * 1.3)) / 2 - 3,
        y: pos.y - (67 * 1.3 - (47 * 1.3)) / 2 + 10,
        width: 89 * 1.3,
        height: 67 * 1.3,
        zIndex: 4,
        attrs: {
          image: {
            "xlink:href": shineImg,
          },
        },
        data: {
          device_name: 'shine',
          device_type: 'shine',
          node_id:deviceNode.id,
          node_status:status,
        }
      }
      this.removeShine()
      this.graph.addNode(shineData);
    },
    removeShine() {
      let shineNode = this.graph.getNodes().find(el => {
        return el.data.device_name === 'shine'
      })
      if (shineNode) this.graph.removeNode(shineNode);
    },
    addDevice(imgUrl, deviceInfo) {
      let w = 28;
      let h = 47;
      // if(deviceInfo.device_type === 'car'){
      //   w = 100;
      //   h = 70;
      // }
      console.log("添加节点 **** ",w,h)
      let nodeData = {
        // shape: "image",
        x: this.$store.state.yqInfo.TOPOWITH / 2, // Number，必选，节点位置的 x 值
        y: this.$store.state.yqInfo.TOPOHEIGHT / 2, // Number，必选，节点位置的 y 值
        width: w, // Number，可选，节点大小的 width 值
        height: h, // Number，可选，节点大小的 height 值
        // label: "hello", // String，节点标签,
        zIndex: 10,
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
            refY: '-10',
            refY2: 4,
          },
        },
        // ports: [
        //   // 默认样式
        //   { id: "port1" },
        //   // 自定义链接桩样式
        // ],
        data: deviceInfo,
      }
      let dev = this.graph.addNode(nodeData);
      console.log("新建的设备类型", dev)
    },
    addLineRouter(pos, edge) {
      let isRouter = true

      let vs = edge.getVertices();
      isRouter = vs.length > 0 && pos.x == vs[vs.length - 1].x && pos.y == vs[vs.length - 1].y
      // console.log(pos,isRouter)
      // console.log("添加线路由点")
      let rdata = {
        shape: "circle",
        width: 10,
        height: 10,
        x: pos.x - 5,
        y: pos.y - 5,
        visible: false,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: "#5F95FF",
            fill: "rgba(255,0,0,0.3)",
            opcity: 0.5
          },
        },
        data: {
          device_name: 'lineRouter',
          device_type: 'lineRouter',
          edgeId: edge.id,
          vertexIndex: isRouter ? edge.getVertices().length - 1 : 'target',
        }
      }
      let lineRouter = this.graph.addNode(rdata);
      lineRouter.show()
    },
    polylineToPath(e) {
      let py = e.edge.getPolyline()
      let parr = []
      py.points.forEach(element => {
        parr.push(element.x)
        parr.push(element.y)
      });

    },
    addcylinder() {
      const cylinder = this.graph.addNode({
        shape: 'cylinder',
        x: 80,
        y: 80,
        width: 160,
        height: 120,
        label: 'cylinder',
      })
      // this.graph.addNode(cylinder)
      const view = this.graph.findViewByCell(cylinder)
      if (view) {
        const path = view.findOne('path')
        // console.log("pathaaa",path)
        if (path) {
          const token = Vector.create('circle', { r: 8, fill: 'red' })
          token.animateAlongPath(
            {
              dur: '4s',
              repeatCount: 'indefinite',
            },
            path,
          )

          token.appendTo(path.parentNode)
        }
      }
    },
    addPolyLine(aniEdge) {
      // let aniEdge = this.graph.addEdge(edgeObj)
      const view = this.graph.findViewByCell(aniEdge)
      console.log("view存在吗吗===",view)
      if (view) {
        const path = view.findOne('path')
        // let path = `<path fill="none" cursor="pointer" stroke="transparent" stroke-linecap="round" stroke-linejoin="round" stroke-width="10" d="M 40 80 L 120 120 L 200 40 L 280 120 L 358.21 80.89" ></path>`
        if (path) {
          if(!this.moveDot){
            this.moveDot = Vector.create('circle', { r: 5, fill: '#ffdb29', zIndex: 2, })
          }
        
         this.moveDot.appendTo(path.parentNode)
        // //  this.moveDot.node.hide()
        //   console.log("开始动画哈啊哈",this.moveDot.node,this.graph.getNodes(),aniEdge.getChildren())
          this.stopAni = this.moveDot.animateAlongPath(
            {
              dur: '3s',
              repeatCount: 'indefinite',
              reverse:true,
            },
            path,
          )
        }
      }
    },
    stopAniFunc() {
      if (this.stopAni) {
        this.stopAni()
        this.stopAni = null;
      }
      if(this.aniPath){
        this.graph.removeEdge(this.aniPath);
        this.aniPath = null;
      }
      // let aniEdge = this.graph.getEdges().find(el => {
      //   return el.data.device_name == 'aniEdge';
      // })
      // this.graph.removeEdge(aniEdge);
    },

  }
}