import G6 from '@antv/g6';
export const GFORCE = {
    methods: {
        destroyForceGraph(){
            if(this.forceGraph){
                this.forceGraph.destroy()
                this.forceGraph = null;
            }
           
        },
        createLayout() {
            // let that = this;
            const container = document.getElementById("svgScan");
            const width = this.$store.state.yqInfo.TOPOWITH * this.zoomNum;
            const height = this.$store.state.yqInfo.TOPOHEIGHT * this.zoomNum;
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
                        if(d.id ==='nodes0'){
                            return 30
                        }
                        return 60;
                    },
                },
                defaultNode: {
                    size: 15,
                },
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
                this.zoomNum,
                {
                    x: this.$store.state.yqInfo.TOPOWITH * this.zoomNum / 2,
                    y: this.$store.state.yqInfo.TOPOHEIGHT * this.zoomNum / 2
                }
            )
            // let mode = this.forceGraph.getCurrentMode()
            // let nodes = this.forceGraph.getNodes()
            //  nodes[0].hide()
            if (this.$store.state.yqInfo.platform === 'pad'){
                this.forceGraph.on("node:touchstart", (e) => {
                    this.forceGraph.layout();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:touchmove",  (e) => {
                    const forceLayout = this.forceGraph.get("layoutController").layoutMethods[0];
                    forceLayout.execute();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:touchend",  (e) => {
                    e.item.get("model").fx = null;
                    e.item.get("model").fy = null;
                });
            }
            else{
                this.forceGraph.on("node:dragstart", (e) => {
                    this.forceGraph.layout();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:drag",  (e) => {
                    const forceLayout = this.forceGraph.get("layoutController").layoutMethods[0];
                    forceLayout.execute();
                    refreshDragedNodePosition(e);
                });
                this.forceGraph.on("node:dragend",  (e) => {
                    e.item.get("model").fx = null;
                    e.item.get("model").fy = null;
                });
            }
           

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

            function refreshDragedNodePosition(e) {
                const model = e.item.get("model");
                model.fx = e.x;
                model.fy = e.y;
            }
        },
    }
}