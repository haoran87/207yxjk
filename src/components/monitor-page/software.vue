<template>
  <div>
    <div v-if="!detailStu">
      <process-line ref="proLine" :dataType="'soft'" @getListAgain='getListAgain'></process-line>
      <div style="height: 16px"></div>
      <software-list ref="softList" @showDetail="showDetail" @resetTop="resetTop"></software-list>
    </div>
    <div v-else>
      <soft-detail @hideDetail="hideDetail" :info="detailInfo"></soft-detail>
    </div>
  </div>
</template>
<script>
import processLine from "./monitor-components/process-line.vue";
import SoftDetail from "./monitor-components/soft-detail.vue";
import SoftwareList from "./monitor-components/software-list.vue";
export default {
  components: { processLine, SoftwareList, SoftDetail },
  data() {
    return {
      detailStu: false,
      detailInfo: null,
    };
  },
  methods: {
    resetTop(){
      if(this.$refs.proLine)
      this.$refs.proLine.resetSoftTop();
    },
    getListAgain(){
      if(this.$refs.softList)
      this.$refs.softList.getSoftList();
    },
    showDetail(item) {
      this.detailInfo = item;
      this.detailStu = true;
    },
    hideDetail() {
      this.detailStu = false;
    },
  },
};
</script>