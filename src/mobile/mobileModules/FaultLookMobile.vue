<template>
  <page-mobile>
    <template slot-scope="{ boxHeight }">
      <div>
        <div ref="topCon" style="margin: 8px">
          <div class="flex flex-between">
            <div></div>
            <div class="fault-title">
              <span style="text-align: left; font-size: 18px">{{
                data.name
              }}</span>
            </div>
            <div class="back-btn">
              <div @click="hideDetail">
                <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
              </div>
            </div>
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
        <div 
        style="margin:0 8px"
        :style="{ 'overflow-y': 'scroll', height: boxHeight - 84 + 'px' }"
        >
          <div class="chart-title">故障描述</div>
          <div
            style="text-align: left; padding: 20px 50px"
            v-html="data.description"
          ></div>
          <div class="chart-title">故障原因</div>
          <div
            style="text-align: left; padding: 20px 50px"
            v-html="data.fault_cause"
          ></div>
          <div class="chart-title">解决方案</div>
          <div
            style="text-align: left; padding: 20px 50px"
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
    </template>
  </page-mobile>
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
  mounted() {},
  methods: {
    //隐藏
    hideDetail() {
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
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 14px;
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
  font-size: 16px;
  color: var(--color-5);
  text-align: left;
}
</style>
