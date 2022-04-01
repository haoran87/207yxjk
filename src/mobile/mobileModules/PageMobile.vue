<template>
  <div style="height: 100%" class="flex flex-center">
    <div class="page-box" ref="pageBox">
     <slot v-if="boxHeight" :boxHeight="boxHeight"></slot>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      boxHeight:0,
    }
  },
  created(){

  },
  mounted(){
    this.boxHeight = this.$refs.pageBox.getBoundingClientRect().height;
  },
  methods:{
  }
};
</script>

<style lang='scss' scoped>
.page-box {
  overflow: hidden;
  height: calc(100% - 8px);
  width: calc(100% - 8px);
  background: var(--footer-background-color);
}
</style>