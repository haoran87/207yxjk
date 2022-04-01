<template>
  <div>
    <div class="loading-box" v-if="loadShow">
      <div style="font-size:var(--pop-title-size)">
         <i class="el-icon-loading"></i>
      </div>
      <div>
        {{loadText}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:["loadText","loadShow"],
  data(){
    return{
    }
  },
  methods:{
    
  }
}
</script>
<style  scoped>
.loading-box {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>