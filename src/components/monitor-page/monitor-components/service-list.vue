<template>
  <div>
    <box-show
      style="padding: 0 8px"
      :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
    >
      <div v-if="$store.state.yqInfo.connectedStu">
        <div class="flex-between">
          <div class="input-box">
            <div class="input-label">服务名称</div>
            <div class="input-con">
              <tis-input
                v-model="serviceName"
                placeholder="请输入服务名称"
              ></tis-input>
            </div>
            <tis-button type="primary" @click="searchKey">查询</tis-button>
            <tis-button type="info" @click="resetKey">重置</tis-button>
            <div class="flex" style="margin-left: 12px">
              <el-tag style="font-size: 14px"> 总数：{{ this.totalSum }}</el-tag>
              <el-tag class="open-color" style="font-size: 14px"> 正常：{{ this.successSum }}</el-tag>
              <el-tag type="danger" class="close-color" style="font-size: 14px"> 异常：{{ this.errorSum }}</el-tag>
            </div>
          </div>
          <tis-button
            type="danger"
            @click="showCard"
            round
            style="margin-right: 16px"
            >卡片展示</tis-button
          >
        </div>

        <div>
          <div style="margin: 0px 8px">
            <self-table
              :tableData="tableData"
              :tableObj="tableObj"
              @sortClick="sortClick"
              :tableHeight="$store.state.yqInfo.MAINHEIGHT - 72 - 16"
            >
              <template v-slot:cpuUsage="props">
                <div>{{ props.cellValue.toFixed(2) + "%" }}</div>
              </template>
              <template v-slot:memUsage="props">
                <div>{{ props.cellValue.toFixed(2) + "%" }}</div>
              </template>
              <template v-slot:status="props">
                <div class="open-color" v-if="props.cellValue >= 0">正常</div>
                <div class="close-color" v-else-if="props.cellValue == -1">
                  异常
                </div>
              </template>
              <template v-slot:startup="props">
                <div v-if="props.cellValue === 'auto'">自动</div>
                <div v-else-if="props.cellValue === 'manual'">手动</div>
              </template>
              <template v-slot:handle="props">
                <div
                  v-if="props.cellData.status >= 0"
                  class="danger-color"
                  @click="startOff(props.cellData, 2)"
                >
                  停用
                </div>
                <div
                  v-else
                  class="warning-color"
                  @click="startOff(props.cellData, 1)"
                >
                  启用
                </div>
              </template>
            </self-table>
          </div>
        </div>
      </div>
      <div v-else>
        <weijietong></weijietong>
      </div>
      <div style="height: 16px"></div>
    </box-show>
  </div>
</template>
<script>
import {serviceMixin} from "@/utils/mobileMixins/serviceMixin"
export default {
  mixins:[serviceMixin],
  data() {
    return {
      
    };
  },
  created() {
     this.resetKey();
  },
  mounted() {},
  methods: {
   
  },
};
</script>
<style lang="scss" scoped>
</style>
