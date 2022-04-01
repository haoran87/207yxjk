<template>
  <div style="height: 100%">
    <warning-info-list-mobile v-if="!see" @showDetail="showDetail">
    </warning-info-list-mobile>
    <warning-info-detail-mobile
     v-else
     :data="detail"
     @hideDetail="hideDetail"
     > 
     </warning-info-detail-mobile>
  </div>
</template>

<script>
import WarningInfoDetailMobile from "../mobileModules/WarningInfoDetailMobile.vue";
import WarningInfoListMobile from "../mobileModules/WarningInfoListMobile.vue";
export default {
  components: { WarningInfoListMobile, WarningInfoDetailMobile },
  data() {
    return {
      see: false,
      detail: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    showDetail(e) {
      this.see = true;
      this.detail = e;
    },
    hideDetail(){
      this.see = false;
    }
  },
};
</script>

<style lang='scss' scoped>
</style>