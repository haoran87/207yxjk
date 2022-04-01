<template>
  <box-show
    style="padding: 0px 16px"
    :style="{ height: $store.state.yqInfo.MAINHEIGHT + 'px' }"
  >
    <div style="display: relative">
      <div ref="topCon" style="margin-top: 16px">
        <div class="back-btn">
          <div @click="hideDetail">
            <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
          </div>
        </div>
        <div class="fault-title">
          <span style="text-align: left; font-size: var(--app-title-size)">{{
            data.name
          }}</span>
        </div>
        <div class="fault-base-info">
          <span>故障类型：</span>
          <span v-for="(item, idx) in faultType" :key="idx">{{
            data.type == item.value ? item.label : " "
          }}</span>
          {{ "&nbsp;" }}
          <!--					<span>创建人：</span><span>{{ data.create_person }}</span> {{ "&nbsp;" }}-->
          <span>创建时间：</span><span>{{ data.create_time | fd }}</span>
          {{ "&nbsp;" }} <span>更新时间：</span
          ><span>{{ data.update_time | fd }}</span>
        </div>
        <div class="line"></div>
      </div>
      <div :style="deStyle">
        <div class="chart-title">故障描述</div>
        <div
          style="
            text-align: left;
            padding: 20px 50px;
            font-size: var(--pop-title-size);
          "
          v-html="data.description"
        ></div>
        <div class="chart-title">故障原因</div>
        <div
          style="
            text-align: left;
            padding: 20px 50px;
            font-size: var(--pop-title-size);
          "
          v-html="data.fault_cause"
        ></div>
        <div class="chart-title">解决方案</div>
        <div
          style="
            text-align: left;
            padding: 20px 50px;
            font-size: var(--pop-title-size);
          "
          v-html="data.solution"
        ></div>
        <div class="chart-title">附件下载</div>
        <div
          style="text-align: left; padding: 20px 50px"
          v-for="(item, idx) in data.attachmentInfos"
          :key="idx"
        >
          <span
            style="cursor: pointer"
            title="点击下载"
            @click="exportFile(item)"
            >{{ item.filename }}</span
          >
        </div>
        <div></div>
      </div>
    </div>
  </box-show>
</template>

<script>
import { formatDate } from "@/utils/util";

export default {
  props: ["data", "del"],
  data() {
    return {
      //故障类型
      faultType: [
        {
          label: "软件知识",
          value: "0",
        },
        {
          label: "硬件知识",
          value: "1",
        },
        {
          label: "业务运维",
          value: "2",
        },
        {
          label: "常见故障",
          value: "3",
        },
      ],
      deStyle: {}, //样式
    };
  },
  filters: {
    fd(time) {
      return formatDate(time);
    },
  },
  mounted() {
    //调整样式
    let rect = this.$refs.topCon.getBoundingClientRect();
    this.deStyle = {
      height:
        this.$store.state.yqInfo.MAINHEIGHT - rect.height - 32 - 16 + "px",
      "overflow-y": "scroll",
    };
  },
  methods: {
    //隐藏
    hideDetail() {
      console.log("隐藏只是想起");
      this.$emit("hideDetail");
    },
    //下载附件信息
    exportFile(item) {
      let url =
        this.$store.state.yqInfo.serverIp +
        "/insight/attachment/download/" +
        item.filename;
      window.location.href = url;
    },
  },
};
</script>

<style lang="scss" scoped>
.back-btn {
  display: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row-reverse;
}

.fault-base-info {
  text-align: left;
  margin-top: 32px;
  margin-bottom: 8px;
  font-size: var(--text-size-small);
}

.line {
  height: 1px;
  margin: 0px auto;
  padding: 0px;
  background-color: var(--text-color-weak);
  overflow: hidden;
  margin-bottom: 16px;
}

.chart-title {
  margin-top: 32px;
  margin-bottom: 32px;
  font-size: var(--tab-title-size);
  color: var(--color-5);
  text-align: left;
}
</style>
