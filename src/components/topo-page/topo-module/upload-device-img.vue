<template>
  <tis-dialog
    :title="formTitle"
    :close-on-click-modal="false"
    :visible.sync="visibleShow"
    width="60%"
    :show-close="false"
    style="background-color: rgba(150, 149, 146, 0.8)"
    append-to-body
  >
    <tis-form :model="imgForm">
      <!--      <tis-form-item label="图片名称" :label-width="formLabelWidth">
        <tis-input v-model.trim="imgForm.name" autocomplete="off"></tis-input>
      </tis-form-item> -->
      <tis-form-item
        label="图片状态"
        :label-width="formLabelWidth"
        style="text-align: left"
      >
        <!-- :disabled="isEdit" -->
        <tis-radio-group v-model="imgForm.status" @change="changeStatus">
          <tis-radio label="0">正常</tis-radio>
          <tis-radio label="10">一般告警</tis-radio>
          <tis-radio label="20">严重告警</tis-radio>
          <tis-radio label="offline">离线</tis-radio>
        </tis-radio-group>
      </tis-form-item>
      <tis-form-item
        label="上传图片"
        :label-width="formLabelWidth"
        style="text-align: left"
      >
        <tis-upload
          :action="imgAction"
          :data="upLoadData"
          list-type="picture-card"
          :limit="1"
          :multiple="false"
          :on-success="uploadOk"
          :on-remove="imgRemove"
          :disabled="false"
          :before-upload="beforeImgUpload"
          :name="'uploadFile'"
          :file-list="imgFiles"
          ref="upLoadNode"
        >
          <i class="el-icon-plus"></i>
        </tis-upload>
      </tis-form-item>
    </tis-form>
    <div slot="footer" class="dialog-footer">
      <tis-button @click="hideForm">取 消</tis-button>
      <tis-button type="primary" @click="addDeviceImg">确 定</tis-button>
    </div>
  </tis-dialog>
</template>
<script>
export default {
  props: ["uploadImgShow", "formTitle"],
  data() {
    return {
      formLabelWidth: "120px",
      upLoadStu: false,
      isEdit: false,
      imgFiles: [],
      imgAction: "",
      upLoadData: {
        type: "subject",
        subjectType: "",
        subjectStatus: "",
      },
      imgForm: {
        name: "",
        status: "0",
        device_Id: "",
        img_path: "",
      },
      imgId: "",
      visibleShow: false, //是否显示该窗口
    };
  },
  created() {},
  mounted() {
    let port = ""
    if (window.YQCLIENTPORT) {
      port = ":" + window.YQSERVERPORT
    }
    let path = "http://" + this.$store.state.yqInfo.chooseIP + port + this.$store.state.yqInfo.serverIp
    this.imgAction =
        path + "/insight/file/addTopoNodeStatusFile";
  },
  methods: {
    beforeImgUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      const hasStatus = this.imgForm.status.length > 0;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      if (!hasStatus) {
        this.$message.error("请先选择状态!");
      }
      return (isJPG || isPNG) && isLt2M && hasStatus;
    },
    switchAddBtn(stu) {
      // console.log("踩踩踩踩踩", this.$refs.upLoadNode);
      if (this.$refs.upLoadNode) {
        let nodes = this.$refs.upLoadNode.$children;
        let upbtn = nodes[nodes.length - 1];
        upbtn.$el.style.display = stu;
      }
    },
    imgRemove() {
      this.switchAddBtn("");
      this.upLoadStu = false;
      this.imgForm.img_path = "";
    },
    changeStatus(e) {
      this.upLoadData.subjectStatus = e;
    },
    uploadOk(e) {
      if (e.code == 200) {
        this.upLoadStu = true;
        this.switchAddBtn("none");
        this.$message.success("上传成功！");
        this.imgForm.img_path = "/insight/file/download/" + e.data;
      } else {
        this.$message.error("上传失败！" + e.message);
      }
    },
    hideForm() {
      this.imgFiles = [];
      this.visibleShow = false;
    },
    addDeviceImg() {
      if (!this.imgForm.img_path) {
        this.$message.warning("请上传设备图片！");
        return;
      }

      this.$yqLoading.show();
      let path = "/insight/deviceStatus/insert";
      let data = this.imgForm;
      let tip = "添加";
      if (this.isEdit) {
        let obj = {};
        for (var key in this.imgForm) {
          obj[key] = this.imgForm[key];
        }
        obj.id = this.imgId;
        data = obj;
        path = "/insight/deviceStatus/update";
        tip = "编辑";
      }
      this.$api.postServerAction(path, data).then((res) => {
        this.$yqLoading.hide();
        if (res.code == 200) {
          this.$message.success(tip + "设备图片成功！");
          this.$parent.deviceTypes.forEach((element, idx) => {
            if (element.ID == this.imgForm.device_Id) {
              this.$parent.collapseClick(idx, true);
            }
          });
          this.hideForm();
        } else {
          this.$message.error(tip + "设备图片失败！");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-upload--picture-card {
  background-color: transparent;
  color: var(--text-color);
  border: var(--status-bar-tools-border);
}
</style>
