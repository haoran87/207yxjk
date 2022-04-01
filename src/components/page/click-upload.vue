<template>
  <div>
    <div v-if="fileName" class="file-show">
      <img v-if="filePath" :src="filePath" style="height:40px" alt="">
      <i v-else class="el-icon-tickets"></i>{{ fileName }}
      <span @click="delImg" class="del-img"
        ><i class="el-icon-circle-close"></i
      ></span>
    </div>
    <div v-else>
      <slot></slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      :id="inputId"
      @change="inputChange"
    />
  </div>
</template>
<script>
export default {
  props: ["fileName","inputId",'filePath'],
  data() {
    return {
    };
  },
  methods: {
/*    delImg() {
      this.fileName = "";
    }, */
    delImg(){
      this.$emit("delImg")
    },
    inputChange(e) {
      console.log("上传图片选择了",e)
      if (e.target.files && e.target.files[0]) {
        this.$emit("upLoad", e.target.files[0]);
      }
    },
    // iconClicked() {
    //   this.$emit("iconClicked");
    // },
  },
};
</script>
<style lang="scss" scoped>
.file-show{
  font-size: var(--text-size-big); 
  color: var(--hover-color);
  height:60px;
  display:flex;
  justify-content: center;
  align-items: center;
}
.del-img {
  color: var(--text-color-weak);
  margin-left: 16px;
}
.del-img:hover {
  color: var(--hover-color);
}
</style>