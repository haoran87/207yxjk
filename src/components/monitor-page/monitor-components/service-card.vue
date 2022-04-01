<template>
  <div>
    <box-show
        style="padding: 0 8px"
        :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
    >
      <div v-if="$store.state.yqInfo.connectedStu">
        <div>
          <div class="flex-between">
            <div class="input-box">
              <div class="input-label">服务名称</div>
              <div class="input-con">
                <tis-input
                    v-model="serviceName"
                    placeholder="请输入服务名称"
                ></tis-input>
              </div>
              <tis-button @click="searchPlugin" type="primary">查询</tis-button>
              <tis-button type="info" @click="resetPlugin">重置</tis-button>
              <div class="flex" style="margin-left: 12px">
                <el-tag style="font-size: 14px"> 总数：{{ this.totalSum }}</el-tag>
                <el-tag class="open-color" style="font-size: 14px"> 正常：{{ this.successSum }}</el-tag>
                <el-tag type="danger" class="close-color" style="font-size: 14px"> 异常：{{ this.errorSum }}</el-tag>
              </div>
            </div>
            <tis-button
                type="danger"
                @click="showList"
                round
                style="margin-right: 16px"
            >列表展示
            </tis-button
            >
          </div>
          <div class="flex" style="margin-left: 8px">
            <div class="input-label">选择排序</div>
            <tis-button
                v-for="(item, idx) in sortArr"
                :key="item.key"
                size="small"
                :type="item.key === sortKey ? 'primary' : 'default'"
                @click="sortClick(item, idx)"
            >
              {{ item.title }}
              <i :class="sortLogos[item.sortType]"></i>
            </tis-button>
          </div>
        </div>
        <div
            class="service-scroll"
            :style="{ height: $store.state.yqInfo.MAINHEIGHT - 72 - 32 + 'px' }"
        >
          <div class="plugin-row">
            <div
                class="plugin-item"
                v-for="(service, idx) in tableData"
                :key="idx"
            >
              <div class="service-con">
                <div class="flex service-title service-con-item">
                  <i class="el-icon-monitor logo"></i>
                  <div style="text-align: left">
                    <div class="service-name text-line-double">
                      {{ service.cName }}
                    </div>
                    <div class="sercie-en">{{ service.serverName }}</div>
                  </div>
                </div>
                <div class="flex-between service-con-item">
                  <div class="service-usage">
                    <div>CPU使用率</div>
                    <div class="service-value">
                      {{ service.cpuUsage.toFixed(2) + "%" }}
                    </div>
                  </div>
                  <div class="service-usage">
                    <div>内存占用</div>
                    <div class="service-value">
                      {{ service.memUsage.toFixed(2) + "%" }}
                    </div>
                  </div>
                </div>
                <div class="flex-between service-con-item">
                  <div class="service-usage">
                    <div>运行状态</div>
                    <div class="service-value">
                      <span class="open-color" v-if="service.status >= 0"
                      >正常</span
                      >
                      <span class="close-color" v-else>异常</span>
                    </div>
                  </div>
                  <div class="service-usage">
                    <div>启动形式</div>
                    <div class="service-value">
                      <span v-if="service.startup == 'auto'">自动</span>
                      <span v-else-if="service.startup == 'manual'">手动</span>
                    </div>
                  </div>
                </div>
                <div class="service-con-item" style="text-align: right">
                  <tis-button
                      v-if="service.status >= 0"
                      plain
                      type="danger"
                      round
                      style="padding: 8px 16px"
                      @click="startOff(service, 2)"
                  >停用
                  </tis-button
                  >
                  <tis-button
                      v-else
                      plain
                      type="primary"
                      round
                      style="padding: 8px 16px"
                      @click="startOff(service, 1)"
                  >启用
                  </tis-button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <weijietong></weijietong>
      </div>
    </box-show>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      serviceName: "",
      tableData: [],
      showPop: false,
      totalSum: 0,
      successSum: 0,
      errorSum: 0,
      popTitle: "添加插件",
      isLoad: true,
      formData: null,
      pageInfo: null,
      curPage: 1,
      pageSize: 15,
      testArr: new Array(8),
      sortLogos: ["el-icon-sort", "el-icon-sort-up", "el-icon-sort-down"],
      sortArr: [
        {
          key: "cpuUsage",
          title: "CPU占用率",
          sortType: 0,
        },
        {
          key: "memUsage",
          title: "内存占用",
          sortType: 0,
        },
        {
          key: "status",
          title: "进行状态",
          sortType: 0,
        },
        {
          key: "startup",
          title: "启动形式",
          sortType: 0,
        },
      ],
      sortKey: "",
      sortType: "",
    };
  },
  created() {
    if (this.$store.state.yqInfo.connectedStu) {
      this.getPluginsList();
    }
  },
  mounted() {
  },
  methods: {
    sortClick(item) {
      if (this.sortKey && item.key === this.sortKey) {
        if (item.sortType === 1) {
          this.sortType = "desc";
          item.sortType = 2;
        } else if (item.sortType === 2) {
          this.sortKey = "";
          this.sortType = "";
          item.sortType = 0;
        }
      } else {
        this.sortArr.forEach((el) => {
          el.sortType = 0;
        });
        this.sortKey = item.key;
        this.sortType = "asc";
        item.sortType = 1;
      }
      this.getPluginsList()
    },
    startOff(item, type) {
      let url;
      let showMessage = "";
      if (type == 2) {
        url = window.STOPSERVICE;
        showMessage = "停用";
      } else if (type == 1) {
        url = window.STARTSERVICE;
        showMessage = "启用";
      }
      // console.log("启用禁用", item);
      let pams = {
        service: item.serverName,
        node: this.$store.state.yqInfo.chooseIP,
      };

      let contentStr = "确认" + showMessage + item.cName + "？";

      this.$yqAlert({
        content: contentStr,
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api.getOutServerAction(url, pams).then((res) => {
            if (res.return && res.return.toLowerCase() == "ok") {
              this.$message.success(showMessage + "成功，正在" + showMessage);
            } else {
              this.$message.error(showMessage + "失败");
            }
            setTimeout(() => {
              //执行启停反应没那么快，等待2秒后再重新刷新列表
              this.getPluginsList();
              this.$yqLoading.hide();
            }, 2000);
          });
        },
      });
    },
    showList() {
      this.$emit("showList", "list");
    },
    searchPlugin() {
      this.getPluginsList();
    },
    resetPlugin() {
      this.serviceName="";
      this.getPluginsList();
    },
    curPageChange(e) {
      this.curPage = e;
      this.getPluginsList();
    },
    getPluginsList() {
      let that = this;
      let pams = {
        node: this.$store.state.yqInfo.chooseIP,
      };
      this.tableData = [];
      this.$yqLoading.show();
      this.$api
          .getOutServerAction(window.ALLSERVICELOADINFO, pams)
          .then((res) => {
            this.$yqLoading.hide()
            if (res.errCode === 0) {
              if (res.data.serviceList.length > 0) {
                let temData = [];
                if (
                    that.serviceName == undefined ||
                    that.serviceName == "" ||
                    that.serviceName == null
                ) {
                  temData = res.data.serviceList.slice();
                } else {
                  for (let i = 0; i < res.data.serviceList.length; i++) {
                    if (
                        res.data.serviceList[i].cName.indexOf(that.serviceName) !=
                        -1
                    ) {
                      temData.push(res.data.serviceList[i]);
                    }
                  }
                }
                this.totalSum = 0
                this.successSum = 0
                this.errorSum = 0
                temData.forEach(o => {
                  if (o.status === 0) {
                    this.successSum += 1
                  } else {
                    this.errorSum += 1
                  }
                })
                this.totalSum=temData.length
                if (this.sortKey && this.sortType) {
                  this.sortTableData(temData);
                } else {
                  this.tableData = temData;
                }
              }
            }
          });

    },
    sortTableData(arr) {
      arr.sort((m, n) => {
        let a = m[this.sortKey];
        let b = n[this.sortKey];
        if (this.sortType === "asc") {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        } else if (this.sortType === "desc") {
          if (a < b) return 1;
          if (a > b) return -1;
          return 0;
        }
      });
      this.tableData = arr;
    },
  },
};
</script>
<style lang="scss" scoped>
.service-scroll {
  overflow-y: scroll;
}

.service-con {
  margin: 16px;
}

.logo {
  color: var(--color-5);
  font-size: 2vw;
  margin-right: 8px;
}

.service-con-item {
  margin-bottom: 24px;
  text-align: left;
}

.service-name {
  font-size: var(--tab-title-size);
}

.sercie-en {
  font-size: var(--text-size-light);
  color: var(--text-color-weak);
}

.service-usage {
  width: 50%;
  font-size: var(--text-size-big);
  text-align: center;
}

.service-value {
  margin-top: 4px;
}
</style>
