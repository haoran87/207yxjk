<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <tis-tabs type="border-card" v-model="ind" class="log-abs" @tab-click='tabClick'>
      <tis-tab-pane v-for="(item,index) in navBarIndex_array" :name="item.label" :key="index" :label="item.label">
        <span class="navBar-block" slot="label" @click="indexof(item.label)">
          <div><i :class="item.img"/></div>
          <p :class="{'is-active': ind == item.label}">{{ item.label }}</p>
        </span>
      </tis-tab-pane>
    </tis-tabs>
    <div v-if="ind=='日志查询'">
      <tis-row>
        <tis-col :span="5">
          <div>
            <div style="height: 8px"></div>
            <div style="text-align: left; margin: 0px 0px -6px 9px;">
              <span>日志软件</span>
            </div>
            <div style="width: 96%;margin: 10px;">
              <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
              </el-input>
            </div>
            <div
                class="serve-content"
                ref="serveContent"
                :style="{ height: $store.state.yqInfo.MAINHEIGHT-140 + 'px' }"
            >
              <div>
                <el-tree
                    :highlight-current="true"
                    :data="serveList"
                    :props="defaultProps"
                    node-key="name"
                    :current-node-key="serveKey"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @node-click="chooseFileKey"
                    ref="classTree">
                </el-tree>
              </div>
            </div>
          </div>
        </tis-col>
        <tis-col :span="19">
          <div style=" width: calc(100% - 5px)">
            <div style="height: 8px"></div>
            <div style="text-align: left; margin: 3px 0px 2px 9px;">
              <span>日志信息--{{this.cname}}</span>
            </div>
            <div
                class="serve-content"
                ref="fileContent"
                :style="{ height: $store.state.yqInfo.MAINHEIGHT - 90 + 'px' }"
            >
<!--              <div class="input-box">
                <div class="input-label">时间段:</div>
                <div class="input-con">
                  <tis-date-picker
                      v-model="value5"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="timestamp">
                  </tis-date-picker>
                </div>
                <tis-button type="primary" @click="search">查 询</tis-button>
                <tis-button type="info" @click="cleanTime">重 置</tis-button>
              </div>-->
              <tis-table
                  :header-cell-style="{background:'var(--layout-bg-3)',color:'var(--text-color)',fontFamily:'',fontSize:'var(--text-size-big)'}"
                  border
                  :data="fileList"
                  width="100%"
                  :height="$store.state.yqInfo.MAINHEIGHT - 90 + 'px'">
                <tis-table-column
                    label="名称"
                    prop="name"
                    show-overflow-tooltip>
                </tis-table-column>
                <tis-table-column
                    prop="mod_time"
                    label="时间"
                    show-overflow-tooltip>
                  <template scope="scope">
                    {{ scope.row.mod_time | fd }}
                  </template>
                </tis-table-column>
                <tis-table-column
                    prop="size_with_unit"
                    label="文件大小"
                    show-overflow-tooltip>
                </tis-table-column>
                <tis-table-column
                    prop="describe"
                    label="操作"
                    show-overflow-tooltip>
                  <template scope="scope">
                    <span class="selected-color" @click="chooseLogKey(scope.row.name)">查看详情</span>
                  </template>

                </tis-table-column>
              </tis-table>
            </div>
          </div>
        </tis-col>
      </tis-row>
    </div>

    <tis-dialog
        title="日志信息"
        top="60px"
        width="70%"
        :visible="showLog"
        :modal="true"
        :modal-append-to-body="false"
        @open="openLog"
        @close="closeLog"
    >
      <div
          :style="{ height: $store.state.yqInfo.MAINHEIGHT - 16 - 114 + 'px' }"
      >
        <div class="flex log-option">
          <div
              @click="lineNChange"
              style="margin-left: 24px; color: var(--color-6)"
          >
            <i class="el-icon-refresh"></i><span>刷新日志</span>
          </div>
          <div>
            <span>获取日志数目：</span>
            <tis-select v-model="lineN" @change="lineNChange">
              <tis-option
                  v-for="(item, idx) in options"
                  :key="idx"
                  :label="item"
                  :value="item"
              >
              </tis-option>
            </tis-select>
          </div>
        </div>
        <div
            class="log-content"
            ref="logContent"
            style="height: calc(100% - 90px)"
        >
          <div ref="infoBox">
            <div v-for="(logStr, idx) in logData" :key="idx" class="log-str">
              {{ logStr }}
            </div>
          </div>
        </div>
      </div>
    </tis-dialog>
  </box-show>
</template>
<script>
import {formatDate} from "@/utils/util";

export default {
  watch: {
    filterText(val) {
      this.$refs.classTree.filter(val);
    }
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  data() {
    return {
      filterText: "",
      navBarIndex_array: [
        {
          img: "el-icon-search",
          label: "日志查询",
          tabIndex: 0
        },
        {
          img: "el-icon-setting",
          label: "设置",
          tabIndex: 1
        },
        {
          img: "el-icon-delete",
          label: "日志清理",
          tabIndex: 2
        },
      ],
      ind: '日志查询',
      logData: [],
      logTimer: null,
      options: [500, 1000, 2000, 3000, 5000],
      lineN: 1000,
      serveList: [],
      value5: [],
      tableData: [{name: "11"}],
      fileList: [],
      findName: "",
      cname: "",
      serveKey: "",
      logKey: "",
      logFilePath: "",
      logPath: "",
      showLog: false,
      defaultProps: {
        label: 'cname'
      }
    };
  },
  created() {
    this.getDir();
  },
  destroyed() {
    this.clearTimer();
  },
  methods: {
    //标签点击事件
    tabClick() {
      if (this.ind == "日志查询") {
        this.getDir();
      }
    },
    //查询
    search() {

    },
    //重置
    cleanTime() {
    },
    //过滤查询
    filterNode(value, data) {
      if (!value) return true;

      return data.cname.indexOf(value) !== -1;
    },
    indexof(index) {
      this.ind = index;
      console.log(this.ind)
      console.log(index)
    },
    // 展示日志 ***
    openLog() {

    },
    // 隐藏日志 ===
    closeLog() {
      this.showLog = false;
      this.clearTimer()
    },
    getDir() {
      this.$api
          .getOutServerAction(window.ALL_SERVICE_REGISTERINFO)
          .then((res) => {
            if (res != undefined) {
              this.serveList = res.ServiceRegInfo;
              console.log("获取到的服务信息 *** ", this.serveList);
              if (this.serveList.length > 0) {
                this.chooseFileKey(this.serveList[0]);
              }
              this.$nextTick(() => {
                this.$refs.classTree.setCurrentKey(this.serveKey);
              });
            }
          });
    },
    getFileList() {
      let pams = {
        ip: this.$store.state.yqInfo.chooseIP,
        path: this.logFilePath,
      };
      //清空日志文件列表数据
      this.fileList = [];
      //清空日志信息
      this.logData = [];
      this.$api
          .getServerAction("/insight/logAlarm/getLogFilesList", pams)
          .then((res) => {
            if (res.code === 200) {
              this.fileList = res.data;
            }
          });
    },
    initTimer() {
      if (this.logTimer === null) {
        this.logTimer = setInterval(() => {
          this.getLogData();
        }, 1000 * 10);
      }
    },
    clearTimer() {
      if (this.logTimer) {
        clearInterval(this.logTimer);
        this.logTimer = null;
      }
    },
    lineNChange() {
      //清空日志信息
      this.logData = [];
      this.$yqLoading.show("正在获取日志...");
      this.getLogData();
      this.clearTimer();
      this.initTimer();
    },
    initFilesPath(serve) {
      if (process.env.NODE_ENV === "development") {
        this.logFilePath = serve.dir;
        // console.log(
        //   "开发调试模式，当前服务bin路径 。。。 ",
        //   serve.dir,
        //   this.logFilePath
        // );
      } else {
        this.logFilePath = serve.dir.substr(0, serve.dir.length - 4) + "/logs";
        // console.log("当前服务bin路径 。。。 ", serve.dir, this.logFilePath);
      }
      this.getFileList();
    },

    //选择服务，获取服务对应的日志信息列表
    chooseFileKey(serve) {
      if (this.serveKey === serve.name) return;
      this.serveKey = serve.name;
      this.cname = serve.cname;
      this.initFilesPath(serve);
    },
    chooseLogKey(log) {
      this.logKey = log;
      this.logPath = this.logFilePath + "/" + log;
      this.lineNChange();
    },
    getLogData() {
      let params = {
        path: this.logPath,
        headTail: "tail",
        lineN: this.lineN,
        ip: this.$store.state.yqInfo.chooseIP,
      };

      this.$api
          .getServerAction("/insight/logAlarm/getLogFileContent", params)
          .then((res) => {
            this.$yqLoading.hide();
            if (res.code === 200) {
              this.showLog = true;
              this.logData = res.data;
              this.$nextTick(() => {
                if (this.$refs.infoBox) {
                  this.$refs.logContent.scrollTop =
                      this.$refs.infoBox.getBoundingClientRect().height;
                }
              });
            }
          });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
  background-color: gray !important;
}

.log-content::-webkit-scrollbar {
  display: block;
}

.log-option {
  flex-direction: row-reverse;
  margin-right: 16px;
  margin-top: 16px;
  font-size: 14px;
}

.log-content {
  text-align: left;
  margin: 0 16px;
  overflow-y: scroll;
  overflow-x: hidden;
  font-size: var(--tab-title-size);
  width: calc(100% - 42px);
  border: 1px solid #979797;
  padding: 5px;
  margin-top: 8px;
}

.log-str {
  line-height: 32px;
  margin-bottom: 16px;
}

.serve-content {
  overflow-y: scroll;
  overflow-x: hidden;
  font-size: var(--tab-title-size);
  border: 1px solid #979797;
  margin-left: 8px;
}

::v-deep .el-tabs__nav {
  display: flex;
  float: none;

}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  height: 50px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-top: none;
  margin-top: 0;
}

.log-abs {

::v-deep.el-tabs__content {
  display: none;
}

}
.navBar-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

> div {
  width: 50%;
  height: 50%;
}

> p {

  line-height: 20px;
  font-size: 16px;
  padding-top: 5px;
}

}


::v-deep.el-table .cell {
  text-align: center;
}

.yqxxkjStyle .input-label {
  width: unset;
}
</style>
