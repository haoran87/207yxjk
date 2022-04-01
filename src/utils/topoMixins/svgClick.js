export const svgclick = {
  methods: {
    initClicks() {
      this.onNodeClick();
      this.onNodeRightClick(),
      this.onBlankClick();
      this.onEdgeClick();
      this.onEdgeRightClick();
      this.onNodeSelected();
      this.onNodeUnselected();
    },
    onNodeClick() {
      this.graph.on("node:click", (e) => {
        if (this.isLine) {
          if (this.lineNode === null) {
            this.initLine({ x: e.x, y: e.y }, e.node);
            this.container.addEventListener("mousemove", this.onMouseMove);
          }
        }
        else {
          this.$emit("showDeviceInfo", e.node)
          if (this.checkStatus) {
            let pos = e.node.position();
            let shineImg = this.svgObj.imgs.shine[e.node.data.addStatus]
            this.addShine(pos, shineImg)
            this.getTerminalLinePoint(e.node)
          }
        }
      });
    },
    onNodeRightClick() {
      this.graph.on("node:contextmenu", (e) => {
        if (this.isLine) {
          if (this.lineNode && this.lineNode.id !== e.node.id) {
            this.finish(2, e.node)
          }

        }
      });
    },
    onEdgeClick() {
      this.graph.on("edge:click", (e) => {
        if (this.isLine) {
          if (this.lineEdge && this.lineNode) {
            const nodes = this.graph.getNodesFromPoint(e.x, e.y);
            if (nodes.length === 0) {
              this.lineEdge.appendVertex({ x: e.x, y: e.y });
            }
          }
          else {
            console.log("划线时选中线段", e.edge)
          }
        }
        else{
          this.$emit("goEditLine",e.edge)
        }
      });
    },
    onNodeSelected(){
      this.graph.on('node:selected', (e) => {
        e.node.addTools( {
          name: 'button-remove',
          args: {
            x: e.node.size().width / 2,
            y: e.node.size().height + 20,
          
          },
        }) 
       
      })
    },
    onNodeUnselected(){
      this.graph.on('node:unselected', (e) => { 
        e.node.removeTools()
        this.$emit("deviceInfoBack");
      })
    },
    onEdgeRightClick() {
      this.graph.on("edge:contextmenu", (e) => {
        console.log("右击线段啊", e)
      });
    },
    onBlankClick() {
      this.graph.on("blank:click", () => {
        console.log("连线时点击")
      });
    },
  }
}