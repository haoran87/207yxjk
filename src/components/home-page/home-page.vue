<template>
  <div>
    <tis-row type="flex" v-if="isGet" ref="homeBox">
      <tis-col :span="16" :style="{ 'margin-right': gutter + 'px' }">
        <div
          class="home-topo module-bg"
          :style="{
            'background-image': 'url(' + bgpath + ')',
            'background-size': '100%',
          }"
        >
          <topo ref="topo" :topoHeight="topoHeight"></topo>
          <div>
            <sub-title
              style="position: absolute; top: 8px; width: calc(100% - 16px)"
              :titleMsg="'拓扑图'"
              :eNum="2"
              @changeTopo="changeTopo"
            ></sub-title>
          </div>
        </div>
        <div>
          <tis-row type="flex">
            <tis-col :span="12" :style="{ 'margin-right': gutter + 'px' }">
              <div class="home-left-item module-bg">
                <component
                  ref="m_leftOne"
                  :is="modules.leftOne"
                  :moduleKey="'leftOne'"
                  :mData="mData.leftOne"
                  :titleSet="1"
                  :chartHeight="rChartHeight"
                  :chartWidth="chartWidth"
                ></component>
              </div>
            </tis-col>
            <tis-col :span="12">
              <div class="home-left-item module-bg">
                <component
                  ref="m_leftTwo"
                  :is="modules.leftTwo"
                  :moduleKey="'leftTwo'"
                  :mData="mData.leftTwo"
                  :titleSet="1"
                  :chartHeight="rChartHeight"
                  :chartWidth="chartWidth"
                ></component>
              </div>
            </tis-col>
          </tis-row>
        </div>
      </tis-col>
      <tis-col :span="8" ref="leftBox">
        <div>
          <div class="home-left-item module-bg">
            <component
              ref="m_rightOne"
              :is="modules.rightOne"
              :moduleKey="'rightOne'"
              :mData="mData.rightOne"
              :titleSet="1"
              :chartHeight="chartHeight"
              :chartWidth="chartWidth"
            ></component>
          </div>
          <div class="home-left-item module-bg">
            <component
              ref="m_rightTwo"
              :is="modules.rightTwo"
              :moduleKey="'rightTwo'"
              :mData="mData.rightTwo"
              :titleSet="1"
              :chartHeight="chartHeight"
              :chartWidth="chartWidth"
            ></component>
          </div>
          <div class="home-left-item module-bg">
            <component
              ref="m_rightThree"
              :is="modules.rightThree"
              :moduleKey="'rightThree'"
              :mData="mData.rightThree"
              :titleSet="1"
              :chartHeight="chartHeight"
              :chartWidth="chartWidth"
            ></component>
          </div>
          <div class="home-left-item module-bg">
            <component
              ref="m_rightFour"
              :is="modules.rightFour"
              :moduleKey="'rightFour'"
              :mData="mData.rightFour"
              :titleSet="1"
              :chartHeight="chartHeight"
              :chartWidth="chartWidth"
            ></component>
          </div>
        </div>
      </tis-col>
    </tis-row>
  </div>
</template>
<script>
import Topo from "./topo.vue";
import topoEdit from "../topo-page/topo-edit.vue";
import SubTitle from "./title.vue";
export default {
  components: {
    Topo,
    topoEdit,
    SubTitle,
  },
  data() {
    return {
      modules: {},
      editTopo: false,
      topoObj: null,
      mData: {},
      isAdd: false,
      chartHeight: "0px",
      topoHeight: "0px",
      chartWidth: "calc(100% - 16px)",
      rChartHeight: "0px",
      bgpath: require("../../assets/img/grid.png"),
      isGet: false,
      gutter: 16,
    };
  },
  created() {
    if (this.$platform.type === "pad") {
      this.gutter = 8;
    }
    // console.log("首页的 运行时 平台 === ",this.$store.state.yqInfo.platform)
    window.addEventListener("resize", this.getConHeight);
  },
  mounted() {
    setTimeout(() => {
      this.getConHeight();
      this.initHpmList();
    }, 1);
  },
  methods: {
    getConHeight() {
      let appParents = document.getElementsByClassName("status-bar-container");
      let fh =
        this.$parent.$parent.$parent.$refs.yq_footer.$children[0].$refs
          .bottombar.clientHeight;
      let dh;
      if (appParents.length > 0) {
        // console.log("顶部高度", document.documentElement.clientHeight);
        dh = document.body.clientHeight - appParents[0].clientHeight - fh;
      } else {
        dh = document.documentElement.clientHeight - fh;
      }
      this.$store.commit("yqInfo/SET_MAINHEIGHT", dh - this.gutter);
      this.chartHeight = dh / 4 - this.gutter - 16 + "px";
      this.rChartHeight = ((dh / 4) * 3) / 2 - this.gutter - 16 + "px";
      this.topoHeight = dh - ((dh / 4) * 3) / 2 - this.gutter - 16 + "px";
      this.isGet = true;
    },
    homeChangeModule(e) {
      this.initComponent(e);
    },
    initHpmList() {
      let tem = this.$store.state.yqInfo.homeModuleList;
      this.$api.getServerAction("/insight/chart/getChartList").then((res) => {
        if (res.code == 200) {
          tem = res.data;
          tem.push({
            attribute: "",
            create_time: "",
            id: "zhuangtaizonglan",
            name: "告警信息分类统计",
            plugin: "",
            type: "告警饼图",
            update_time: "",
            show_type: "0",
          });
          this.$store.commit("yqInfo/GET_ALL_MODULE", tem);
          this.initComKey(tem);
        }
      });
    },
    initComKey(list) {
      let hpm = this.$store.state.yqInfo.homePageModule;
      for (let i in hpm) {
        let md = list.find((el) => {
          return el.id == hpm[i];
        });
        this.mData[i] = md;
        let type = md.type;
        if (md.id == "jiankangdu") {
          type = "健康度";
        }
        this.modules[i] = () =>
          import("@/components" + this.$store.state.yqInfo.chartPath[type]);
      }
      let tem = this.modules;
      this.$nextTick(() => {
        this.modules = null;
        this.modules = tem;
      });
    },
    initComponent(key) {
      let md = this.$store.state.yqInfo.homeModuleAll.find((el) => {
        return el.id == this.$store.state.yqInfo.homePageModule[key];
      });
      this.mData[key] = md;
      let type = md.type;
      if (md.id == "jiankangdu") {
        type = "健康度";
      }
      this.modules[key] = () =>
        import("@/components" + this.$store.state.yqInfo.chartPath[type]);
      let tem = this.modules;
      this.$nextTick(() => {
        this.modules = null;
        this.modules = tem;
        setTimeout(() => {
          for (let k in this.$refs) {
            if (k.includes("m_")) {
              this.$refs[k].resetTimer();
            }
          }
        }, 100);
      });
    },
    changeTopo(e) {
      this.$refs.topo.changeTopo(e);
    },
    //  ...mapMutations("yqInfo", ["SET_BREADREUMB"]),
  },
};
</script>
<style lang='scss' scoped>
.home-left-item {
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 8px;
}
.home-topo {
  margin-bottom: 16px;
  padding: 8px;
  position: relative;
}
.yqxxkjPad {
  .home-left-item {
    margin-bottom: 8px;
  }
  .home-topo {
    margin-bottom: 8px;
  }
}
</style>