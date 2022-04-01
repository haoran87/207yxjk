<template>
  <box-show :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }">
    <div ref="topCon">
      <div class="input-box">
        <div class="input-item">
          <div class="input-label">插件名称:</div>
          <div class="input-con">
            <tis-input
              v-model="plugin_code"
              placeholder="请输入插件名称"
            ></tis-input>
          </div>
        </div>
        <div class="input-item">
          <div class="input-label">告警类型:</div>
          <div class="input-con">
            <tis-select
              popper-class="pickerClass"
              v-model="level"
              placeholder="请选择告警类型"
            >
              <tis-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </tis-option>
            </tis-select>
          </div>
        </div>
        <div class="input-item">
          <div class="input-label">告警状态:</div>
          <div class="input-con">
            <tis-select
              popper-class="pickerClass"
              v-model="alarm_status"
              placeholder="请选择告警状态"
            >
              <tis-option
                v-for="item in postOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </tis-option>
            </tis-select>
          </div>
        </div>
        <div class="input-item" v-if="$store.state.yqInfo.platform === 'pc'">
          <div class="input-label">选择时间:</div>
          <div class="input-con">
            <tis-date-picker
              v-model="time"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
            </tis-date-picker>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <div class="input-item" v-if="$store.state.yqInfo.platform === 'pad'">
          <div class="input-label">选择时间:</div>
          <div class="input-con">
            <tis-date-picker
              v-model="time"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            >
            </tis-date-picker>
          </div>
        </div>
        <tis-button type="primary" @click="searchKey">查 询</tis-button>
        <tis-button type="info" @click="resetKey">重 置</tis-button>
        <tis-button type="primary" @click="delAll('1')">批量删除</tis-button>
        <tis-button type="danger" @click="delAll('0')">清空</tis-button>
      </div>
    </div>
    <div style="margin: 16px 16px 0px" v-if="topHeight > 0">
      <self-table
        ref="selfTable"
        :tableData="tableData"
        :tableObj="tableObj"
        checkable="true"
        :tableHeight="$store.state.yqInfo.MAINHEIGHT - topHeight - 48"
      >
        <template v-slot:device="props">
          <span> {{ props.cellData.plugin_name || props.cellData.ip }}</span>
        </template>
        <template v-slot:level="props">
          <span class="warning-color" v-if="props.cellValue == 10"
            >一般告警</span
          >
          <span class="danger-color" v-else-if="props.cellValue == 20"
            >严重告警</span
          >
          <span v-else>正常</span>
        </template>
        <template v-slot:alarm_status="props">
          <span v-if="props.cellValue == '0'">正在告警</span>
          <span v-else>历史告警</span>
        </template>
        <template v-slot:confirm_status="props">
          <span v-if="props.cellValue == '1'">已读</span>
          <span class="warning-color" v-else>未读</span>
        </template>
        <template v-slot:start_time="props">
          <tis-popover
            :disabled="$store.state.yqInfo.platform === 'pc'"
            placement="top-start"
            width="200"
            trigger="hover"
            :content="props.cellValue | fd"
          >
            <div slot="reference">
              <span> {{ props.cellValue | fd }}</span>
            </div>
          </tis-popover>
        </template>
        <template v-slot:handle="props">
          <span class="selected-color" @click="showDetail(props.cellData)"
            >查 看</span
          >{{ "&nbsp;" }}
          <span class="selected-color" @click="deleteInfo(props.cellData)"
            >删 除</span
          >
        </template>
      </self-table>
    </div>
    <list-page
      :pageInfo="pageInfo"
      :curPage="curPage"
      :pageSize="pageSize"
      @cpc="curPageChange"
    ></list-page>
  </box-show>
</template>

<script>
import { warningInfoMixin } from "@/utils/mobileMixins/warningInfoMixin";
export default {
  mixins: [warningInfoMixin],
  components: {},
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.topHeight = rect.height + 16;
  },
};
</script>

<style lang="scss" scoped>
.input-item {
  display: flex;
  align-items: center;
}
.btn-box {
  display: flex;
  /* flex-direction: row-reverse; */
  margin: 0 16px;
}
</style>
