<template>
  <div>
    <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
      <div class="topo">
        <div id="svgScan" :style="scanStyle"></div>
      </div>
    </box-show>
  </div>
</template>
<script>
import boxShow from "../page/box-show.vue";
import { GFORCE } from "@/utils/topoMixins/g6";
export default {
  mixins: [GFORCE],
  components: { boxShow },
  props: [],
  data() {
    return {
      scanStyle: {
        background: "var(--layout-bg-3)",
      },
      originData: {
        nodes: [],
        edges: [],
      },
      forceGraph: null,
      zoomNum:1,
    };
  },
  created() {
    this.zoomNum = (this.$store.state.yqInfo.MAINHEIGHT - 32) / this.$store.state.yqInfo.TOPOHEIGHT
    this.scanStyle.height = this.$store.state.yqInfo.MAINHEIGHT - 32 + "px";
    this.scanStyle.width = this.$store.state.yqInfo.TOPOWITH * this.zoomNum + "px";
  },
  mounted() {},
  methods: {
    initData(graph) {
      // let topoStatusImage = this.$store.state.yqInfo.topoStatusImage;
      let nodes = graph.getNodes();
      let edges = graph.getEdges();
      this.originData.nodes = [];
      this.originData.edges = [];
      nodes.forEach((elNode) => {
        // console.log("eddddd",topoStatusImage[elNode.data.device_type])
        let temObj = {
          id: elNode.id,
          // type:'image',
          size: 60,
          x: elNode.position().x,
          y: elNode.position().y,
          label: elNode.data.device_name,
          anchorPoints:[],
          labelCfg: {
            style: {
              fill: "#000",
            },
          },
          style: {
            fill: "#fc0",
            // img: this.$store.state.yqInfo.serverIp+topoStatusImage[elNode.data.device_type]['0'],
          },
        };
        this.originData.nodes.push(temObj);
      });
      edges.forEach((elEdge) => {
        let temObj = {
          source: elEdge.getSource().cell,
          target: elEdge.getTarget().cell,
        };
        this.originData.edges.push(temObj);
      });
      this.createLayout();
    },
   
  },
};
</script>
<style lang="scss" scoped>
.topo {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>