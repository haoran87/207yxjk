<template>
  <div>
    <div v-if="this.fileName" class="f-files-area">
      <div class="f-file-show">
        <div style="font-size: var(--pop-title-size);; margin-bottom: 16px">
          <i class="el-icon-tickets"></i>
        </div>
        <div>{{ fileName }}</div>
      </div>
      <div class="file-del" @click="delFile">
        <i class="el-icon-circle-close"></i>
      </div>
    </div>
    <div
      v-else
      class="f-files-area"
      @dragover="fileDragover"
      @drop="fileDrop"
      @click="drgclick"
    >
      <div class="f-file-show">
        <div style="font-size: var(--pop-title-size);; margin-bottom: 16px">
          <i class="el-icon-files"></i>
        </div>
        <div>{{upTip}}</div>
      </div>
    </div>
    <input
      ref="dragInput"
      type="file"
      style="display: none"
      :id="dragInputId"
      @change="dragInputChange"
    />
  </div>
</template>
<script>
export default {
  props: ["fileName", "dragInputId",'upTip'],
  data() {
    return {};
  },
  created(){
    console.log("hahahah",this.dragInputId)
  },
  watch: {},
  methods: {
    delFile(){
      this.$emit("delFile")
    },
    drgclick() {
      this.$emit("dragClick");
    },
    dragInputChange(e) {
      if (e.target.files && e.target.files[0]) {
        this.$emit("dragUpLoad", e.target.files[0]);
      }
    },
    fileDragover(e) {
      e.preventDefault();
    },
    fileDrop(e) {
      e.preventDefault();
      const file = e.dataTransfer.files[0]; // 获取到第一个上传的文件对象
      console.log("获取到文件", file);
      if (!file) return;
      console.log("拖动图片成功");
      this.$emit("dragUpLoad", file);
      //   if (file.size > this.MAX_FILE_SIZE) {
      //     return alert('文件大小不能超过10M')
      //   }

      //   this.batchFile = file
      //   this.fileName = file.name
    },
  },
};
</script>
<style lang="scss" scoped>
.f-files-area {
  width: 100%;
  height: 200px;
  border: 1px dotted var(--color-3);
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-color-weak);
  position: relative;
}
.file-del{
  position:absolute;
  color:var(--text-color-weak);
  right:16px;
  top:16px;
  font-size: var(--text-size-big);
}
.file-del:hover{
  color:var(--hover-color);
}
</style>
