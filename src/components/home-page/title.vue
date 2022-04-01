<template>
  <div class="title-box flex-between">
    <left-title :titleMsg="titleMsg"></left-title>
    <div v-if="eNum == 1">
      <tis-popover
        placement="left"
        trigger="click"
        width="240"
        v-model="showPop"
      >
        <div class="module-list-box" style="height: 30vh; overflow: scroll">
          <div
            v-for="(item, idx) in hpmList"
            :key="idx"
            style="text-align: center; padding: 8px"
            class="yq-title-item"
            @click="chooseHpm(item)"
          >
            <div class="flex">
              <div
                style="margin-right: 8px"
                :style="{
                  color:
                    'var(' + (item.onLine ? '--color-6' : '--text-color') + ')',
                }"
              >
                <i v-if="item.show_type == 0" class="el-icon-s-platform"></i>
                <i v-else class="el-icon-edit"></i>
              </div>
              <div style="text-align: left">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="flex-center" >
          <tis-button
            type="primary"
            plain
            style="
              padding: 0.6vw 1.6vw;
              font-size:var(-text-size-small);
              margin-top:8px;
            "
            round
            @click="goChartManage"
          >
            <i class='el-icon-setting'> </i>&nbsp;图表管理
          </tis-button>
        </div>
        <div class="right-title" slot="reference" @click="initHpmList">
          <i class="el-icon-setting" size="8"></i>
        </div>
      </tis-popover>
    </div>
    <div class="right-title" v-else-if="eNum == 2">
      <tis-popover
        placement="left"
        width="240"
        trigger="click"
        popper-class="pickerClass"
        v-model="showTopoPop"
      >
        <div
          v-for="(topo, idx) in topoList"
          :key="idx"
          style="text-align: center; padding: 8px"
          class="yq-title-item"
          @click="topoSelected(topo)"
        >
          {{ topo.TOPO_NAME }}
        </div>
        <tis-button
          plain
          type="primary"
          slot="reference"
          @click="initTopoList"
          style="
            padding: 0.9vh 1.8vh;
            border: 0.05vh solid var(--color-5);
            font-size: 1.2vh;
          "
          >切换</tis-button
        >
      </tis-popover>
    </div>
  </div>
</template>
<script>
import leftTitle from "../page/left-title.vue";
export default {
  components: { leftTitle },
  props: ["eNum", "titleMsg", "moduleKey"],

  data() {
    return {
      hpmList: [],
      showPop: false,
      topoList: [],
      showTopoPop: false,
    };
  },
  created() {
    // this.initHpmList();
  },
  mounted() {},
  methods: {
    goChartManage() {
      this.$navigateTo(8, {});
    },
    initHpmList() {
      let tem = this.$store.state.yqInfo.homeModuleList;
      this.hpmList = [];
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
          tem.forEach((element) => {
            if (
              this.$store.state.yqInfo.homePageModule[this.moduleKey] !==
              element.id
            ) {
              element.onLine = this.checkHave(element.id);
              this.hpmList.push(element);
            }
          });
        }
      });
    },
    initTopoList() {
      this.topoList = [];
      this.$api
        .getServerAction("/insight/topology/getTopologyList")
        .then((res) => {
          if (res.code == 200) {

                this.topoList= res.data

          }else{
            this.topoList = [];
          }
        });
    },
    checkHave(path) {
      for (let k in this.$store.state.yqInfo.homePageModule) {
        if (this.$store.state.yqInfo.homePageModule[k] == path) {
          return true;
        }
      }
      return false;
    },
    chooseHpm(item) {
      this.showPop = false;
      // let hps = this.$store.state.yqInfo.homePageModule;
      // for (let k in hps) {
      //   if (hps[k] == item.id) {
      //     this.doChoose(k, hps[this.moduleKey]);
      //     break;
      //   }
      // }
      this.doChoose(this.moduleKey, item.id);
    },
    doChoose(mk, cid) {
      if (this.moduleKey) {
        this.$store
          .dispatch("yqInfo/changeHomeModule", {
            key: mk,
            path: cid,
          })
          .then(() => {
            // console.log("选择啊啊啊", mk, cid);
            if (this.moduleKey == "leftOne" || this.moduleKey == "leftTwo") {
              this.$parent.$parent.$parent.$parent.$parent.$parent.homeChangeModule(
                mk
              );
            } else {
              this.$parent.$parent.$parent.$parent.homeChangeModule(mk);
            }
          });
      }
    },
    topoSelected(topo) {
      this.$store.commit("yqInfo/CHANGE_TOPO", topo.ID);
      topo.isedit = true;
      this.$emit("changeTopo", topo);
      this.showTopoPop = false;
    },
    setClick() {
      this.$emit("setClick");
    },
    editClick() {
      this.$emit("editClick");
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
