<template>
  <div>
    <process-line ref="proLine" :dataType="'process'" @getListAgain='getListAgain' ></process-line>
    <div style="height: 16px"></div>
    <process-list ref="proList" @resetProTop='resetProTop' :conHeight = "listHeight"></process-list>
  </div>
</template>
<script>
import ProcessLine from "./monitor-components/process-line.vue";
import processList from "./monitor-components/process-list.vue";
export default {
  components: { processList, ProcessLine },
  data() {
    return {
		listHeight : 0,
	};
  },
  mounted(){
	  let rect = this.$refs.proLine.$el.getBoundingClientRect()
	  this.listHeight = this.$store.state.yqInfo.MAINHEIGHT - rect.height - 16 
	  console.log("高度啊啊啊",this.$store.state.yqInfo.MAINHEIGHT,this.listHeight,rect.height)
  },
  methods:{
    getListAgain(){
      this.$refs.proList.getPocessList()
    },
    resetProTop(){
      this.$refs.proLine.resetProTop()
    }
  }
};
</script>
<style lang="scss" scoped>
</style>