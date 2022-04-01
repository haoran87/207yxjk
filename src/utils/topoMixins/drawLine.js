export const drawLine = {
    methods: {
        lineStatus(state) {
            
            this.isLine = state;
            // this.graph.options.interacting.nodeMovable = !this.isLine;
            // this.lineRouterToggle(this.isLine)
            let edges = this.graph.getEdges()
            edges.forEach(element => {
                if(state){
                    element.addTools(['vertices', {
                        name: 'button-remove',
                        args: { distance: -40 },
                      }]) 
                } 
                else{
                    element.removeTools()
                }
            });
          
            // this.graph.options.interacting.edgeMovable = !this.isLine;
        },
        onMouseMove(e) {
            if (this.lineEdge) {
                let pos = this.graph.clientToLocal(e.clientX, e.clientY);
                this.lineEdge.setTarget(pos);
            }
        },
        finish(isover,node) {
            if (this.lineNode && this.lineEdge) {
                // const vertices = this.lineEdge.getVertices();
                if (isover === 1) {
                    this.lineEdge.setTarget({x:node.x,y:node.y})
                    this.addLineRouter({x:node.x,y:node.y},node.edge)
                }
                else if(isover === 2){
                    this.lineNode.setZIndex(10)
                    this.lineEdge.setTarget({cell:node.id,selector:'port'})
                    this.lineEdge.addTools(['vertices', {
                        name: 'button-remove',
                        args: { distance: -40 },
                      }]) 
                    node.setData({aniPath:this.lineEdge.id})
                    this.lineEdge.setZIndex(1)
                }
                this.lineNode = null;
                this.lineEdge = null;
                this.container.removeEventListener("mousemove", this.onMouseMove);
            }
        },
        initLine(pos, node) {
            this.lineNode = node;
            let sourceObj
            sourceObj = {
                cell: this.lineNode.id,
                selector:'port'
            }
            this.lineEdge = this.graph.addEdge({
                zIndex:1,
                source: sourceObj,
                target: pos,
                vertices: [],
                attrs: {
                    line: {
                        targetMarker: null,
                        stroke: "#A2B1C3",
                        strokeWidth: 2,
                    },
                },
                tools: [
                ],
            });
            this.lineEdge.data = {
                sourceType:"node",
            }  
        },
    }
}