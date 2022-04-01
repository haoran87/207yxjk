<template>
  <div>
    <box-show
      style="padding: 0 8px"
      :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
      v-if="!detailSwitch"
    >
      <div v-if="$store.state.yqInfo.connectedStu">
        <div class="input-box">
          <div class="input-label">插件名称</div>
          <div class="input-con">
            <tis-input v-model="pluginName" placeholder="请输入"></tis-input>
          </div>
          <tis-button @click="searchPlugin" type="primary">查询</tis-button>
          <tis-button type="info" @click="resetPlugin">重置</tis-button>
        </div>
        <div
          :style="{
            height: $store.state.yqInfo.MAINHEIGHT - 72 - 16 - 32 + 'px',
            'overflow-y': 'scroll',
          }"
        >
          <div class="plugin-row">
            <div class="plugin-item" v-for="(p, idx) in pluginList" :key="idx">
              <plugin-item
                :pluginItem="p"
                :isInfo="true"
                @showDetail="showDetail"
              ></plugin-item>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <weijietong></weijietong>
      </div>
    </box-show>
    <plugin-info-detail
      v-else
      :detailInfo="detailInfo"
      @hideDetail="hideDetail"
    ></plugin-info-detail>
  </div>
</template>
<script>
import PluginInfoDetail from "./monitor-components/plugin-info-detail.vue";
import PluginItem from "./monitor-components/plugin-item.vue";
export default {
  components: {
    PluginItem,
    PluginInfoDetail,
  },
  data() {
    return {
      pluginName: "",
      pluginList: [],
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      detailSwitch: false,
      detailInfo: {},
    };
  },
  created() {
    this.getPluginsList();
  },
  mounted() {},

  methods: {
    hideDetail() {
      this.detailSwitch = false;
    },
    showDetail(e) {
      this.detailInfo = e;
      this.detailSwitch = true;
    },
    searchPlugin() {
      this.getPluginsList();
    },
    resetPlugin() {
      this.pluginName = "";
      this.getPluginsList();
    },
    curPageChange(e) {
      this.curPage = e;
      this.getPluginsList();
    },
    getPluginsList() {
      this.$yqLoading.show();
      let path = "/insight/plugin/enableStatusList";
      let params = {
        // name: this.pluginName,
        // page_no: this.curPage,
        // page_size: this.pageSize,
      };
      //测试数据据
      // this.pluginList = getTestPlugin();
      this.$api.getServerAction(path, params).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          if (this.pluginName) {
            this.pluginList = res.data.filter((el) => {
              return el.name.includes(this.pluginName);
            });
          } else {
            this.pluginList = res.data;
          }
          // this.pageInfo = res.data.page;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
