<template>
  <info-list v-if="!see" @showDetail="showDetail"></info-list>
  <info-look v-else @hideDetail="hideDetail" :data="detail"></info-look>
</template>

<script>
import InfoList from "./info-list";
import InfoLook from "./info-look";

export default {
  components: {
    InfoLook,
    InfoList,
  },
  data() {
    return {
      see: false,
      detail: {},
      pageData: null,
    };
  },
  created() {
    this.pageData = this.$pageData();
    if (this.pageData) {
      this.showDetail(this.pageData);
    }
  },
  methods: {
    showDetail(detail) {
      this.detail = detail;
      this.see = true;
    },
    hideDetail() {
      if (this.pageData) {
        console.log("有返回的页面吗",this.pageData.backNav)
        this.$navigateTo(this.pageData.backNav);
      } else {
        this.see = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
