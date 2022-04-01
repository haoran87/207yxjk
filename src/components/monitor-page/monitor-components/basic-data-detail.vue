<template>
  <div style="position: relative" v-if="detail">
    <div style="margin-bottom: 16px" ref='topCon'>
      <box-show>
        <div class="device-basic">
          <div style="margin-bottom: 16px">
            <span style="margin-right: 16px"> 插件名称：{{ detail.name }}</span>
          </div>
          <div>
            <span style="margin-right: 48px">
              插件标识：{{ detail.plugin_code }}</span
            >
            <span>时间：{{ ctime }}</span>
          </div>
          <div class="back-btn" @click="hideDetail">
            <icon :name="'back'" :size="'24'" :color="'#E4E4E4'"></icon>
          </div>
        </div>
      </box-show>
    </div>
    <div>
      <box-show style=" padding:8px ">
        <div style="text-align: left" :style="deStyle">
          <json-viewer
              :value="dataText"
              :expanded="true"
              sort
              theme="my-awesome-json-theme"
          ></json-viewer>
        </div>
      </box-show>
    </div>
  </div>
</template>
<script>
import { formatDate } from "@/utils/util";
import JsonViewer from "vue-json-viewer";
// import BatchLook from "../../system-check/batch/batch-look";
// import BatchList from "../../system-check/batch/batch-list";
// import ImmediatelyList from "../../system-check/immediately-list";
// import CronLook from "../../system-check/cron/cron-look";
// import CronList from "../../system-check/cron/cron-list";
// import ImportExcel from "../../page/importExcel";
export default {
  props: ["detail"],
  components: {JsonViewer},
  data() {
    return {
      dataText: "",
      ctime: "",
	   deStyle:{}
    };
  },
  created() {
    this.dataText = JSON.parse(this.detail.value);
    this.ctime = formatDate(this.detail.create_time);
  },
  mounted() {
    let rect = this.$refs.topCon.getBoundingClientRect()
    this.deStyle = {height:this.$store.state.yqInfo.MAINHEIGHT - rect.height - 16 - 16 + 'px','overflow-y':'scroll'}
  },
  methods: {
    hideDetail() {
      this.$emit("hideDetail");
    },
  },
};
</script>
<style lang="scss" scoped>
.device-basic {
  padding: 16px;
  text-align: left;
  position: relative;
}
.back-btn {
  position: absolute;
  right: 32px;
  top: 8px;
}
</style>
