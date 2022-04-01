<template>
  <box-show
    style="padding: 0 8px"
    :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
  >
    <div class="flex-between">
      <div class="input-box">
        <div class="input-label">图表名称：</div>
        <div class="input-con">
          <tis-input
            v-model="chartName"
            placeholder="请输入图表名称"
          ></tis-input>
        </div>
        <tis-button type="primary" @click="searchKey">查询</tis-button>
        <tis-button type="info" @click="resetKey">重置</tis-button>
      </div>
      <div @click="goback">
        <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
      </div>
    </div>
    <div
      :style="{ height: $store.state.yqInfo.MAINHEIGHT - 56 - 50 + 'px' }"
      style="overflow-y: scroll"
    >
      <tis-row style="flex">
        <tis-col :span="6">
          <div class="topo-item" @click="addChart">
            <div style="height: 3.2vw"></div>
            <div class="topo-add" style="height: 9vw">
              <plugin-add-icon></plugin-add-icon>
              <div style="margin-top: 16px">点击新增图表</div>
            </div>
            <div style="height: 3.2vw"></div>
          </div>
        </tis-col>
        <tis-col :span="6" v-for="(chart, idx) in chartList" :key="idx">
          <div class="topo-item">
            <div class="topo-title text-line-only">
              {{ chart.name }}
            </div>
            <div class="topo-con">
              <tis-row style="width: 100%">
                <tis-col :span="12">
                  <div style="padding: 8px">
                    <div class="p-title">插件</div>
                    <div class="p-con text-line-double">
                      {{ chart.plugin }}
                    </div>
                  </div>
                </tis-col>
                <tis-col :span="12">
                  <div style="padding: 8px">
                    <div class="p-title">图表类型</div>
                    <div class="p-con">{{ chart.type }}</div>
                  </div>
                </tis-col>
              </tis-row>
            </div>
            <div class="topo-bottom">
              <div
                class="topo-bottom-btn"
                style="border-right: var(--status-bar-tools-border)"
                @click="sanChart(chart)"
              >
                查看
              </div>
              <div
                class="topo-bottom-btn"
                style="border-right: var(--status-bar-tools-border)"
                @click="editChart(chart)"
              >
                编辑
              </div>
              <div class="topo-bottom-btn" @click="delChart(chart)">删除</div>
            </div>
          </div>

        </tis-col>

      </tis-row>
    </div>
    <list-page
        :pageInfo="pageInfo"
        :curPage="curPage"
        @cpc="curPageChange"
        :pageSize="pageSize"
    ></list-page>
  </box-show>
</template>
<script>
import PluginAddIcon from "../monitor-page/monitor-components/plugin-add-icon.vue";
export default {
  components: {
    PluginAddIcon,
  },
  data() {
    return {
      chartList: [],
      chartName: "",
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
    };
  },
  created() {
    this.getChartList();
  },
  mounted() {},
  methods: {
    goback() {
      if (this.$parent.pageData) {
        this.$navigateTo(this.$parent.pageData.backNav);
      }
    },
    sanChart(chart) {
      let params = {
        id: chart.id,
      };
      this.$api
        .getServerAction("/insight/chart/getChartById", params)
        .then((res) => {
          if (res.code == 200) {
            this.$emit("scanChart", res.data);
          }
        });
    },
    searchKey() {
      this.curPage = 1;
      this.getChartList();
    },
    resetKey() {
      this.curPage = 1;
      this.chartName = "";
      this.getChartList();
    },
    addChart() {
      this.$emit("addChart");
    },
    curPageChange(e) {
      this.curPage = e;
      this.getChartList();
    },
    getChartList() {
      let params = {
        name: this.chartName,
        page_no: this.curPage,
        page_size: this.pageSize,
      };
      this.$api.getServerAction("/insight/chart/page", params).then((res) => {
        if (res.code == 200) {
          this.chartList = res.data.items;
          this.pageInfo = res.data.page;
          console.log("获取图表 === ", res.data);
        }
      });
      //  this.$api.getServerAction("/insight/chart/getChartList").then((res) => {
      //   if (res.code == 200) {
      //     this.chartList = res.data;
      //     // this.pageInfo = res.data.page;

      //   }
      // });
    },
    editChart(chart) {
      this.$emit("editChart", chart);
    },
    delChart(chart) {
      let hm = this.$store.state.yqInfo.homePageModule;
      for (let k in hm) {
        if (hm[k] === chart.id) {
          this.$yqAlert({
            content: "这个图表正在首页中使用,请在首页中更换后,再删除",
            hideCancel: true,
          });
          return;
        }
      }

      this.$yqAlert({
        content: "确定要删除这个图表吗？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/chart/delete", {
              id: chart.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.getChartList();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.topo-item {
  border: var(--status-bar-tools-border);
  //   min-height: 240px;
  margin: 0 8px 16px;
  /* margin-bottom: 16px; */
  width: calc(100% - 16px);
  position: relative;
  background-color: var(--layout-bg-2);
  text-align: left;
  font-size: var(--text-size-big);
}

.topo-title {
  line-height: 3.2vw;
  height: 3.2vw;
  padding: 0 8px;
  border-bottom: var(--status-bar-tools-border);
}

.topo-con {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 9vw;
  text-align: center;
  /* padding: 8px; */
}

.topo-bottom {
  width: 100%;
  display: flex;
  bottom: 0;
  justify-content: space-between;
  background-color: var(--layout-bg-2);
  line-height: 3.2vw;
  height: 3.2vw;
}

.topo-bottom-btn {
  width: calc(100% / 3);
  text-align: center;
}

.topo-add {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--text-color-weak);
}

.p-con {
  word-break: break-all;
  overflow: hidden;
  height: 3vw;
  color: var(--text-color-weak);
}

.p-title {
  height: 3vw;
  line-height: 3vw;
  color: var(--text-color);
}
</style>
