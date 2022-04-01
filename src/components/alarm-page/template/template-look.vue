<template>
  <box-show style="padding: 0 16px">
    <div
      class="page-con"
      :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
    >
      <div ref="topCon">
        <div style="height: 16px"></div>
        <div class="flex-between">
          <div style="font-size: var(--pop-title-size)">{{ data.name }}</div>
          <div class="flex">
            <div @click="hideDetail">
              <icon :name="'back'" :size="'25'"></icon>
            </div>
          </div>
        </div>
        <div style="height: 32px"></div>
        <div>
          <div style="text-align: left; margin-bottom: 16px">
            <span v-if="data.status == '1'" class="open-color"> 已启用</span>
            <span v-else class="close-color"> 未启用</span>
          </div>
          <table class="altrowstable table-border number-font">
            <tr>
              <td class="altrowstable-left table-border table-title">
                告警名称
              </td>
              <td class="altrowstable-right table-border">{{ data.name }}</td>
              <td class="altrowstable-left table-border table-title">
                告警描述
              </td>
              <td class="altrowstable-right table-border">{{ data.remark }}</td>
            </tr>
            <tr>
              <td class="altrowstable-left table-border table-title">
                设备/进程名称
              </td>
              <td class="altrowstable-right table-border">
                {{ data.equipment_id }}
              </td>
              <td class="altrowstable-left table-border table-title">
                模板状态
              </td>
              <td class="altrowstable-right table-border">
                <span v-if="data.status == '1'">已启用</span>
                <span v-else>未启用</span>
              </td>
            </tr>
          </table>
        </div>
        <div style="height: 32px"></div>
        <div>
          <div style="text-align: left">
            <span>告警规则:</span>
          </div>
          <div class="flex" style="text-align: left; margin-top: 16px">
            <div class="stu-dot stu-dot-warning"></div>
            <div>
              <span v-if="data.trigger_type == '1'">满足所有条件时触发</span>
              <span v-if="data.trigger_type == '0'">满足任意条件时触发</span>
            </div>
          </div>
        </div>
        <div style="height: 16px"></div>
      </div>
      <div>
        <div v-show="data.type != 'log'">
          <tis-table
            :data="data.alarmRuleList"
            style="width: 100%"
            :header-cell-style="{
              background: 'var(--layout-bg-2)',
              color: 'var(--text-color)',
              fontFamily: '',
              fontSize: 'var(--text-size-big)',
            }"
            height="100%"
          >
            <tis-table-column prop="subject_index" label="指标" min-width="20%">
              <template scope="scope">
                <span v-for="(a, idx) in pluginAttributes" :key="idx">
                  <span
                    v-if="
                      scope.row.subject_index == a.key && data.type == 'device'
                    "
                  >
                    {{ a.name }}
                  </span>
                  <span
                    v-if="
                      scope.row.subject_index == a.value &&
                      data.type == 'plugin'
                    "
                  >
                    {{ a.name }}
                  </span>
                </span>
              </template>
            </tis-table-column>
            <tis-table-column prop="conditions" label="条件" min-width="20%">
              <template scope="scope">
                {{ ifStr[scope.row.conditions] }}
              </template>
            </tis-table-column>
            <tis-table-column label="一般告警" min-width="25%">
              <tis-table-column
                prop="commonly"
                label="指标阈值"
                min-width="15%"
              >
              </tis-table-column>
              <tis-table-column
                prop="commonlySum"
                label="连续出现次数"
                min-width="10%"
              >
              </tis-table-column>
            </tis-table-column>
            <tis-table-column label="严重告警" min-width="25%">
              <tis-table-column prop="serious" label="指标阈值" min-width="15%">
              </tis-table-column>
              <tis-table-column
                prop="seriousSum"
                label="连续出现次数"
                min-width="10%"
              >
              </tis-table-column>
            </tis-table-column>
          </tis-table>
        </div>
        <div v-show="data.type == 'log'">
          <tis-table
            border
            :header-cell-style="{
              background: 'var(--layout-bg-2)',
              color: 'var(--text-color)',
              fontSize: 'var(--text-size-small)',
              'font-weight': 'normal',
            }"
            :data="data.alarmRuleList"
            style="width: 100%"
            height="100%"
          >
            <tis-table-column prop="commonly" label="一般告警" min-width="45%">
            </tis-table-column>
            <tis-table-column prop="serious" label="严重告警" min-width="45%">
            </tis-table-column>
          </tis-table>
        </div>
      </div>
      <div style="height: 50px"></div>
    </div>
  </box-show>
</template>

<script>
export default {
  props: ["data"],
  data() {
    return {
      pluginAttributes: [], //插件的属性列表
      ifStr: {
        ">": "大于",
        "<": "小于",
        "=": "等于",
        "!=": "不等于",
        ">=": "大于等于",
        "<=": "小于等于",
        contain: "包含",
        notContain: "不包含",
      },
      topHeight: 0,
    };
  },
  created() {
    //获取插件的属性列表
    this.getPluginAttributes();
  },
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.topHeight = rect.height + 8;
  },
  methods: {
    hideDetail() {
      this.$emit("hideDetail");
    },
    /**
     * 获取插件的属性列表
     * @param pluginCode 插件标识
     */
    getPluginAttributes() {
      var pluginCode = this.data.plugin_id;
      this.pluginAttributes = [];
      if (this.data.type == "device") {
        this.pluginAttributes = [
          {
            index: "8",
            value: "procName",
            name: "进程",
            type: "1",
            key: "8-procName",
          },
          {
            index: "18",
            value: "cpuRateAvg",
            name: "cup平均使用率",
            key: "18-cpuRateAvg",
          },
          {
            index: "4",
            value: "usedPercent",
            name: "内存使用率",
            key: "4-usedPercent",
          },
          {
            index: "5",
            value: "usedPercent",
            name: "磁盘使用率",
            key: "5-usedPercent",
          },
        ];
      } else if (this.data.type == "plugin") {
        this.$yqLoading.show();
        this.$api
          .getServerAction("/insight/plugin/getPluginAlarmAttributes", {
            code: pluginCode,
          })
          .then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.pluginAttributes = res.data;
            } else {
              this.$message.warning("获取插件的属性列表失败！");
            }
          });
      } else {
        console.log("success");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-con {
  overflow-y: scroll;
}

table.altrowstable {
  font-size: var(--text-size-small);
  width: 100%;
  height: 200px;
  border-collapse: collapse;
}

table.altrowstable td {
  border: var(--status-bar-tools-border);
  padding: 8px;
  text-align: center;
}

.altrowstable-left {
  background: var(--layout-bg-2);
  width: 20%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  font-size: var(--text-size-small);
}

::v-deep .el-table th {
  font-weight: normal;
}

::v-deep .el-table--border,
.el-table--group {
  border: var(--status-bar-tools-border);
}

::v-deep .el-table td,
.el-table th.is-leaf {
  border: var(--status-bar-tools-border);
}

::v-deep .el-table--border th,
.el-table--border th.gutter:last-of-type {
  border: var(--status-bar-tools-border);
}

::v-deep .el-table--border td,
.el-table--border th {
  border: var(--status-bar-tools-border);
}

::v-deep.el-table {
  width: 100%;
  box-sizing: border-box;
}

::v-deep.el-table::before {
  height: 0px;
}

::v-deep .el-table--border::after,
.el-table--group::after {
  width: 0px;
  height: 0px;
}

::v-deep.el-table th > .cell {
  text-align: center;
}

::v-deep.el-table .cell {
  text-align: center;
}

::v-deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
</style>
