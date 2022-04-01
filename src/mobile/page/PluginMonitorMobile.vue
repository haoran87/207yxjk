<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <div v-if="!detailSwitch">
        <search-top-mobile
          :placeholder="'请输入插件名称'"
          @search="searchPlugin"
          @clear="searchPlugin"
          @input="inputFunc"
        >
        </search-top-mobile>
        <div style="margin: 0px 8px">
          <list-mobile
            :tableObj="listObj"
            :tableData="pluginList"
            :tableHeight="boxHeight - 54 - 8"
          >
            <template v-slot:type="props">
              <div>{{ typeArr[props.cellValue] }}</div>
            </template>
            <template v-slot:show_status="props">
              <span v-if="props.cellValue == 3" class="open-color">已启用</span>
              <span v-else-if="props.cellValue == 2" class="close-color"
                >未启用</span
              >
              <span v-else-if="props.cellValue == 1" class="warning-color"
                >未加载</span
              >
            </template>
            <template v-slot:handle="props">
              <div class="warning-color" @click="showDetail(props.cellData)">
                查看详情
              </div>
            </template>
          </list-mobile>
        </div>
      </div>
      <plugin-detail-mobile 
      v-else
      :detailInfo="detailInfo"
      @hideDetail="hideDetail"
      > 
      </plugin-detail-mobile>
    </template>
  </page-mobile>
</template>

<script>
import PluginDetailMobile from "../mobileModules/PluginDetailMobile.vue";
export default {
  components: { PluginDetailMobile },
  data() {
    return {
      listObj: {
        name: {
          slot: false,
          lable: "插件名称",
          class: "",
          sortable: false,
          width: "30%",
        },
        code: {
          slot: false,
          lable: "标识",
          class: "",
          sortable: false,
          width: "30%",
        },
        type: {
          slot: true,
          lable: "插件类型",
          class: "",
          sortable: false,
          width: "10%",
        },
        show_status: {
          slot: true,
          lable: "插件状态",
          class: " tabel-content-center",
          sortable: false,
          width: "10%",
        },
        handle: {
          slot: true,
          lable: "操作",
          class: "cell-text-center",
          sortable: false,
          width: "15%",
        },
      },
      pluginName: "",
      pluginList: [],
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      detailSwitch: false,
      detailInfo: {},
      typeArr: {
        server: "服务",
        script: "脚本",
      },
    };
  },
  created() {
    this.getPluginsList();
  },
  mounted() {},
  methods: {
    inputFunc(e) {
      this.pluginName = e;
    },
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
      let params = {};
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
        }
      });
    },
  },
};
</script>

<style lang="scsss" scoped>
</style>