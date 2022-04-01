<template>
  <div>
    <box-show
      style="position: relative"
      :style="{ height: mainHeight }"
      v-if="!see"
    >
      <div class="fixed-header">
        <div class="info-title">
          <span>{{ data.alarm_name }}</span>
          <!-- <tis-button type="primary" v-if="data.confirm_status!='1'" size="medium" @click="changeStatus(data)">确 认</tis-button>
            <tis-button type="danger" size="medium" @click="deleteInfo(data)">删 除</tis-button> -->
          <span @click="hideDetail">
            <icon :name="'back'" :size="'25'"></icon>
          </span>
        </div>
        <div class="flex-center">
          <div style="margin-top: 0px; width: 60%; text-align: center">
            <tis-steps simple>
              <tis-step
                v-for="(step, index) in stepInfo"
                :key="index"
                :status="index + 1 == activeNum ? 'success' : 'wait'"
              >
                <template v-slot:icon><i :class="step.icon"></i></template>
                <template v-slot:title
                  ><span @click="stepClick(index + 1)">{{
                    step.title
                  }}</span></template
                >
              </tis-step>
            </tis-steps>
          </div>
        </div>
      </div>
      <div
        ref="info_content"
        class="info-content"
        @scroll="scrollEvent"
        :style="{ height: conHeight }"
      >
        <div class="info-item" ref="warn_info">
          <div class="chart-title" style="margin-top:0">告警信息</div>
          <table class="altrowstable">
            <tr>
              <td class="altrowstable-left">告警名称</td>
              <td class="altrowstable-right">
                {{ data.alarm_name }}
              </td>
              <td class="altrowstable-left">告警类型</td>
              <td class="altrowstable-right">
                <span class="warning-color" v-if="data.level == '10'"
                  >一般告警</span
                >
                <span class="danger-color" v-else-if="data.level == '20'"
                  >严重告警</span
                >
                <span v-else>正常</span>
              </td>
              <td class="altrowstable-left">确认状态</td>
              <td class="altrowstable-right">
                <span v-if="data.alarm_status == '1'" class="open-color"
                  >已确认</span
                >
                <span class="warning-color" v-else>未确认</span>
              </td>
            </tr>
            <tr>
              <td class="altrowstable-left">IP</td>
              <td class="altrowstable-right">{{ data.ip }}</td>
              <td class="altrowstable-left">告警类型</td>
              <td class="altrowstable-right">
                {{ data.alarm_type }}
              </td>
              <td class="altrowstable-left">告警设备/插件</td>
              <td class="altrowstable-right">{{ data.plugin_name }}</td>
            </tr>
            <tr>
              <td class="altrowstable-left">来源类型</td>
              <td class="altrowstable-right">
                <span v-if="data.source_type == 'plugin'">插件</span>
                <span v-else-if="data.source_type == 'log'">日志</span>
                <span v-else-if="data.source_type == 'device'">设备</span>
              </td>
              <td class="altrowstable-left">信息来源</td>
              <td class="altrowstable-right">
                <span v-if="data.info_source == 'local'">本地系统告警</span>
                <span v-else-if="data.info_source == 'log'">第三方告警</span>
              </td>

              <td class="altrowstable-left">告警状态</td>
              <td class="altrowstable-right">
                {{ data.alarm_status == "0" ? "正在告警" : "历史告警" }}
              </td>
            </tr>
            <tr>
              <td class="altrowstable-left">重复次数</td>
              <td class="altrowstable-right">{{ data.repeat_times }}</td>

              <td class="altrowstable-left">告警开始时间</td>
              <td class="altrowstable-right">{{ data.start_time | fd }}</td>
              <td class="altrowstable-left">告警结束时间</td>
              <td class="altrowstable-right">{{ data.stop_time | fd }}</td>
            </tr>
            <tr>
              <td class="altrowstable-left">描述信息</td>
              <td colspan="5" style="text-align: left; padding: 0 8px">
                {{ data.description }}
              </td>
            </tr>
          </table>
        </div>

        <div class="info-item" ref="warn_source">
          <div class="chart-title">告警资源</div>
          <table class="altrowstable">
            <tr>
              <td class="altrowstable-left">来源类型</td>
              <td class="altrowstable-right">
                <span v-if="data.source_type == 'plugin'">插件</span>
                <span v-else-if="data.source_type == 'log'">日志</span>
                <span v-else-if="data.source_type == 'device'">设备</span>
              </td>
              <td class="altrowstable-left">资源名称</td>
              <td class="altrowstable-right">{{ data.plugin_name }}</td>
              <td class="altrowstable-left">告警IP</td>
              <td class="altrowstable-right">{{ data.ip }}</td>
            </tr>
            <tr v-if="data.source_type == 'plugin'">
              <td class="altrowstable-left">插件编码</td>
              <td colspan="5" style="text-align: left; padding: 0 8px">
                {{ data.plugin_code }}
              </td>
            </tr>
            <tr v-if="data.source_type == 'log'">
              <td colspan="6" style="text-align: left; padding: 0 8px">
                日志内容:<br />
                {{ data.log_text }}
              </td>
            </tr>
          </table>
        </div>

        <div class="info-item" ref="warn_knowledge">
          <div class="chart-title">故障知识</div>
          <self-table :tableData="faultData" :tableObj="faultObj">
            <template v-slot:type="props">
              <span v-if="props.cellValue == '0'">软件知识</span>
              <span v-else-if="props.cellValue == '1'">硬件知识</span>
              <span v-else-if="props.cellValue == '2'">业务运维</span>
              <span v-else-if="props.cellValue == '3'">常见故障</span>
            </template>
            <template v-slot:create_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:update_time="props">
              {{ props.cellValue | fd }}
            </template>
            <template v-slot:handle="props">
              <span class="selected-color" @click="showFault(props.cellData)"
                >查看策略</span
              >
            </template>
          </self-table>
        </div>
        <div style="height: 100vh"></div>
      </div>
    </box-show>
    <div v-else>
      <fault-look
        @hideDetail="hideDetails"
        :data="fault"
        :del="false"
      ></fault-look>
    </div>
  </div>
</template>

<script>
import { warningInfoDetailMixin } from "@/utils/mobileMixins/warningInfoDetailMixin";
import FaultLook from "../fault/fault-look";

export default {
  mixins: [warningInfoDetailMixin],
  components: {
    FaultLook
  },
  data() {
   return{

   }
  },
  created() {
   
  },
  mounted() {
    
  },
  
  methods:{

  }
};
</script>

<style lang="scss" scoped>
.fixed-header {
  margin: 16px;
  height: 80px;
  /* position: absolute;
  top: 0;
  width: calc(100% - 42px);
  background-color: var(--layout-bg-1); */
}
.info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* width:calc(100% - 32px); */
  font-size: var(--pop-title-size);
}
.info-content {
  overflow-y: scroll;
}
.info-item {
  margin: 16px;
}

table.altrowstable {
  font-size: var(--text-size-small);
  border: var(--status-bar-tools-border);
  border-collapse: collapse;
}

table.altrowstable th {
  padding: 8px;
  width: 25vh;
  border: var(--status-bar-tools-border);
  text-align: center;
}

table.altrowstable td {
  padding: 8px 0;
  height: 60px;
  border: var(--status-bar-tools-border);
  text-align: center;
}
.altrowstable-left {
  background: var(--layout-bg-2);
  width: 10%;
  font-size: var(--text-size-small);
}

.altrowstable-right {
  font-size: var(--text-size-small);
  width: 23%;
}

table {
  width: 100%;
  /* height: 200px; */
  /* border-collapse属性设置表格的边框是否被合并为一个单一的边框，还是像在标准的HTML中那样分开显示 */
  /* separate：默认值，边框会分开 */
  /* collapse: 如果可能，边框会合并为单一的边框 */
  border-collapse: collapse;
}

.chart-title {
  margin-top: 32px;
  margin-bottom: 12px;
  font-size: var(--tab-title-size);
  color: var(--color-5);
  text-align: left;
}
</style>
