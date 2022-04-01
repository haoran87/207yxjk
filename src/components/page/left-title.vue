<template>
  <div>
    <div class="left-title">
      {{ titleMsg || "标题内容" }}
      <div class="right-triangle"></div>
      <div class="bottom-line"></div>
    </div>
  </div>
</template>
<script>
export default {
    props:["titleMsg"],
    data(){
        return{

        }
    }
}
</script>
<style  scoped>
.left-title {
  position: relative;
  padding: 0 40px 0 5px;
  border-top: 0.05vh solid var(--color-8);
  border-bottom: 0.05vh solid var(--color-8);
  /* top: 0; */
  height: 3vh;
  line-height: 3vh;
  font-size: 1.6vh;
}
.right-triangle {
  width: 0;
  height: 0;
  border-top: 0.8vh solid var(--color-6);
  border-left: 0.8vh solid transparent;
  position: absolute;
  right: 0;
  top: 0;
}
.bottom-line {
  width: 90%;
  height: 0.2vh;
  background-color: var(--color-6);
  position: absolute;
  bottom: 0;
  left: 0;
  background: radial-gradient(circle at top right, transparent 3px, var(--color-6) 0)
    top right;
}
</style>