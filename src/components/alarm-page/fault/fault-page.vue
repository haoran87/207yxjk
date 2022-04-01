<template>
  <fault-list v-if="!see" @showDetail="showDetail"></fault-list>
  <fault-look v-else @hideDetail="hideDetail" :data="data"></fault-look>
</template>

<script>
import FaultList from "./fault-list";
import FaultLook from "./fault-look";

export default {
  components: {
    FaultLook,//故障知识库查看页面
    FaultList//故障知识库列表页面
  },
  data() {
    return {
      see: false,
      data: {}////故障知识库信息
    };
  },
  methods: {
    //查看页面
    showDetail(detail) {
      this.data = detail;
      this.see = true
    },
    //关闭查看页面
    hideDetail() {
      this.see = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
