<template>
  <div>
    <div class="flex-column-center" :style="svgStyle">
      <div :id="topoObj.ID"></div>
    </div>
  </div>
</template>
<script>
import { Graph } from "@antv/x6";
import { svgMixin } from "@/utils/topoMixins/svgMixin";
export default {
  mixins: [svgMixin],
  props: ["svgId", "svgStyle", "topoObj"],
  data() {
    return {
      svgObj: null,
      scaleNum: 0.5,
	  now: 0,//当前时间
    };
  },
  created() {
    let height = parseInt(this.svgStyle.height);
    this.scaleNum = height / this.$store.state.yqInfo.TOPOHEIGHT;
    this.svgObj = JSON.parse(this.topoObj.TOPO_DATA);
  },
  mounted() {
    this.initDraw();
	this.now = Date.now()
  },
  methods: {
    initDraw() {
	  let topoStatusImage = this.$store.state.yqInfo.topoStatusImage
	  //console.log("状态图片111",topoStatusImage)
      if (this.graph) this.graph.dispose();
      this.graph = null;
      this.container = document.getElementById(this.topoObj.ID);
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
        this.graph.getNodes().forEach((element) => {
			//console.log("元素类型",element.data.device_type)
			//拓扑元素有设备类型属性，属性中有图片属性； 除了线类型的，其他设备类型默认展示正常状态的图片
          if (element.data.device_type && element.attrs.image && element.data.device_type != "lineRouter" && element.data.device_type != "shine") {
			let img = topoStatusImage[element.data.device_type]["0"]
            if (img) {
              let imgurl = this.$store.state.yqInfo.serverIp + img;
              element.setAttrs({ image: { "xlink:href": imgurl } });
            } else{
				//未找到相应状态图片的，设为未找到图片
				let imgurl = this.$store.state.yqInfo.serverIp + window.NOTFOUNDIMGAGE
				element.setAttrs({ image: { "xlink:href": imgurl } });
			}
          }
        });
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