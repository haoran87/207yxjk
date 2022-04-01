<template>
  <div>
    <div class="plugin-add-icon">
      <i class="el-icon-plus"></i>
      <div>
        <div class="border-angle border-top-left"></div>
        <div class="border-angle border-bottom-left"></div>
        <div class="border-angle border-bottom-right"></div>
        <div class="border-angle border-top-right"></div>
      </div>
    </div>
    
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.plugin-add-icon{
    width: 48px;
    height: 48px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: var(--tab-title-size);
    font-weight: bold;
    position: relative;
}
.border-angle {
  position: absolute;
  width: 12px;
  height: 12px;
}
.border-top-left {
  border-top: #505050 solid 4px;
  border-left: #505050 solid 4px;
  border-radius: 3px;
  top: 0;
  left: 0;
}
.border-bottom-left {
  border-bottom: #505050 solid 4px;
  border-left: #505050 solid 4px;
  border-radius: 3px;
  bottom: 0;
  left: 0;
}
.border-bottom-right {
  border-bottom: #505050 solid 4px;
  border-right: #505050 solid 4px;
  border-radius: 3px;
  bottom: 0;
  right: 0;
}
.border-top-right {
  border-top: #505050 solid 4px;
  border-right: #505050 solid 4px;
  border-radius: 3px;
  top: 0;
  right: 0;
}
</style>
