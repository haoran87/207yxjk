<template>
  <div>
    <tis-dialog
      title="文件导入"
      :visible.sync="showImport"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      append-to-body
      @close="close"
    >
      <div>
        <div v-if="file.name" class="f-files-area">
          <div class="f-file-show">
            <div style="font-size: var(--pop-title-size); margin-bottom: 16px">
              <i class="el-icon-tickets"></i>
            </div>
            <div>{{ file.name }}</div>
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
          @click="drgclick('file')"
        >
          <div class="f-file-show">
            <div style="font-size: var(--pop-title-size); margin-bottom: 16px">
              <i class="el-icon-upload"></i>
            </div>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </div>
        </div>
        <input
          id="file"
          ref="dragInput"
          type="file"
          :accept="suffix"
          style="display: none"
          @change="dragInputChange"
        />
      </div>

      <span slot="footer" class="dialog-footer">
        <tis-button @click="close">关 闭</tis-button>
        <tis-button type="danger" @click="submitUpload"> 上传文件 </tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
export default {
  props: [
    "showImport",
    "action",
    "href",
    "showModuleDown",
    "tipText",
    "suffix",
    "data",
  ],
  data() {
    return { file: {} };
  },

  methods: {
    //清空文件
    delFile() {
      this.file = {};
    },
    //点击上传文件
    dragInputChange(e) {
      console.log(e);
      this.file = e.target.files[0];
      console.log("this.file ==== ", this.file);
      e.target.value = "";
    },
    //文件选择框
    drgclick(id) {
      console.log("aaaa", this.$syberh);
      if (this.$platform.type === "pad") {
        this.$syberh.filepicker.open({
          count: 1,
          title: "选择文件",
          showBack: true,
          category: "document",
          success: (result) => {
            if (result && result.files) {
              this.file = result.files[0];
              console.log(JSON.stringify(result.files));
            }
          },
          fail: (error) => {
            this.$message.error("filepicker open fail : " + error.msg);
          },
        });
      } else {
        document.getElementById(id).click();
      }
    },
    fileDragover(e) {
      e.preventDefault();
    },
    init() {
      this.file = {};
    },
    //关闭弹出框
    close() {
      this.$emit("close");
    },
    //文件拖动
    fileDrop(e) {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        const file = e.dataTransfer.files[0]; // 获取到第一个上传的文件对象
        console.log("获取到文件", file);
        if (!file) return;
        console.log("拖动图片成功");
        /* let formData = new FormData();
         formData.append("uploadFile", file);*/
        e.target.value = "";
        this.file = file;
      }
    },
    //提交请求
    submitUpload() {
      if (this.$platform.type === "pad") {
        this.$syberh.upload.start({
          url: this.action,
          filePath: this.file.path,
          success: (res) => {
            if (res.status == 3) {
              this.$message.success("上传成功");
              this.close();
              this.file = {};
              this.$emit("page");
            }
          },
          fail: (err) => {
            this.$message.error("上传失败" + err.msg);
          },
        });
      } else {
        let formData = new FormData();
        formData.append("file", this.file);
        console.log(this.data);
        if (this.data != undefined) {
          formData.append(this.data.key, this.data.value);
        }
        this.$api.postServerAction(this.action, formData).then(
          (res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success("上传成功！");
              this.close();
              this.file = {};
              this.$emit("page");
            } else {
              this.$message.error(res.info);
            }
          },
          () => {
            this.$yqLoading.hide();
          }
        );
      }
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

.file-del {
  position: absolute;
  color: var(--text-color-weak);
  right: 16px;
  top: 16px;
  font-size: var(--text-size-big);
}

.file-del:hover {
  color: var(--hover-color);
}
</style>
