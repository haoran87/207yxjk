<template>
  <div>
    <div>
      <service-list
        v-if="showType == 'list'"
        ref="serviceList"
        @showDetail="showDetail"
        @getList="getList"
        @resetTop="resetTop"
        @showCard="changeShowType"
      ></service-list>
      <service-card 
      @showList="changeShowType"
      v-else-if="showType == 'card'"> </service-card>
    </div>
   
  </div>
</template>
<script>
import ServiceCard from "./monitor-components/service-card.vue";
import ServiceList from "./monitor-components/service-list.vue";
export default {
 
  components: {
    ServiceList,
    ServiceCard,
  },
  data() {
    return {
      detailStu: false,
      detailInfo: null,
      showType: "card",
    };
  },
  created(){
   
  },
  methods: {
    changeShowType(e) {
      this.showType = e;
    },
    resetTop() {
      if (this.$refs.proLine) this.$refs.proLine.resetSoftTop();
    },
    getListAgain() {
      if (this.$refs.serviceList) this.$refs.serviceList.getSoftList();
    },
    showDetail(item) {
      this.detailInfo = item;
      this.detailStu = true;
    },
    hideDetail() {
      this.detailStu = false;
    },
    getList() {
      // this.$refs.proLine.serviceList = e;
      // this.$refs.proLine.resetServiceTop();
    },
  },
};
</script>