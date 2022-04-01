<template>
  <div>
    <basic-data-list v-if="!detailStu" @showDetail="showDetail"></basic-data-list>
    <basic-data-detail v-else @hideDetail="hideDetail" :detail="detail"></basic-data-detail>
  </div>
</template>
<script>
import BasicDataDetail from './monitor-components/basic-data-detail.vue'
import BasicDataList from './monitor-components/basic-data-list.vue'
export default {
  components:{
    BasicDataList,
    BasicDataDetail
  },
  data(){
    return {
      detailStu:false,
      detail:null,
    }
  },
  methods:{
    showDetail(detail){
      this.detail = detail;
      this.detailStu = true
    },
    hideDetail(){
      this.detailStu = false
    }
  }
}
</script>
<style lang="scss" scoped>

</style>