<template>
  <div>
    <div>
      <tis-form
        ref="form"
        :model="form"
        label-width="100px"
        style="margin-top: 10px"
      >
        <tis-form-item
          label="类型"
          prop="type"
          :rules="[
            { required: true, message: '请选择类型', trigger: 'change' },
          ]"
        >
          <select-dict v-model="form.type" placeholder="请选择类型" type="faultType"></select-dict>
        </tis-form-item>
        <tis-form-item
          label="标题"
          prop="name"
          :rules="[
            { required: true, message: '请输入标题', trigger: 'change' },
          ]"
        >
          <tis-input v-model.trim="form.name" placeholder="请输入标题" maxlength="50"
                     show-word-limit></tis-input>
        </tis-form-item>

        <tis-form-item
          label="故障描述"
          prop="description"
          :rules="[
            { required: true, message: '请输入故障描述', trigger: 'change' },
          ]"
        >
          <editor ref="editord" v-model="form.description"></editor>
        </tis-form-item>
        <tis-form-item
            label="故障原因"
            prop="fault_cause"
            :rules="[
            { required: true, message: '请输入故障原因', trigger: 'change' },
          ]"
        >
          <editor ref="editord" v-model="form.fault_cause"></editor>
        </tis-form-item>
        <tis-form-item
          label="解决方案"
          prop="solution"
          :rules="[
            { required: true, message: '请输入解决方案', trigger: 'change' },
          ]"
        >
          <editor ref="editors" v-model="form.solution"></editor>
        </tis-form-item>
      </tis-form>
    </div>
    <div>
      <div class="flex" style="align-items: flex-start">
        <div style="width: 80px; text-align: right; padding-right: 12px">
          附 件
        </div>
        <div>
          <div class="flex">
            <div
              class="file-item flex-column-center"
              v-for="(f, idx) in fileList"
              :key="idx"
            >
              <div>
                <icon
                  v-if="f.name.includes('.xls')"
                  name="excel"
                  size="3vw"
                ></icon>
                <icon
                  v-else-if="f.name.includes('.doc')"
                  name="word"
                  size="3vw"
                ></icon>
                <icon
                  v-else-if="f.name.includes('.ppt')"
                  name="ppt"
                  size="3vw"
                ></icon>
                 <icon
                  v-else
                  name="file"
                  size="3vw"
                ></icon>
                <div>{{f.name}}</div>
              </div>
              <div class="file-del" @click="removeFile(f,idx)"><i class="el-icon-delete"></i></div>
              <!-- <div>{{ file.name }}</div> -->
              <!-- <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span> -->
            </div>
            <m-uploader v-if="this.$platform.type === 'pad'" :after-read="afterRead" :preview-image="true" class="file-item flex-column-center" accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx">
              <i class="el-icon-plus" style="font-size: 28px;margin-top: 30px;margin-left: 25px; color: #8c939d;"></i>
            </m-uploader>
            <tis-upload v-else
                list-type="picture-card"
                name="uploadFile"
                :action="action"
                :on-preview="handlePreview"
                accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleSuccess"
                multiple
                :data="{ relation_id: this.form.id }"
                :file-list="fileList"
                :show-file-list="false"
            >
              <div style="margin-top:-10px">
                <i class="el-icon-plus"></i>
              </div>
            </tis-upload>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editor from "../../page/editor";

export default {
  components: {
    editor: editor,//富文本框
  },
  updated() {
    if (!this.showPop && this.form.isShow && this.fileList.length > 0) {
      this.$api
        .getServerAction("/insight/attachment/deleteByFaultId", {
          relation_id: this.form.id,
        })
        .then((res) => {
          if (res.code == 200) {
            console.log("删除成功");
          }
        });
    }
    if (!this.showPop && !this.form.isShow) {
      this.$emit("page");
    }
  },
  props: {
    form: {},
    pluginList: {},
    alarmRuleList: [],
    fileList: [],
    showPop: Boolean,
  },
  data() {
    return {
      action:"/api/insight/attachment/create",//PC上传附件地址
      padAction:"/insight/attachment/create",//PAD上传附件地址
    };
  },

  methods: {
    //移动端上传功能
    afterRead(file) {
      let formData = new FormData();
      formData.append("uploadFile", file.file);
      formData.append("relation_id", this.form.id);
      this.$api.postServerAction(this.padAction, formData).then((res) => {
                if (res.success) {
                  this.fileList.push({
                    name: res.data.filename,
                    id: res.data.id,
                    url:
                        this.$store.state.yqInfo.serverIp +
                        "/insight/attachment/download" +
                        "/" +
                        res.data.filename,
                  });
                  console.log("上传成功：", this.fileList);
                } else {
                  this.$message.error("上传失败!" + res.message);
                }
              });
    },
    //删除文件
    removeFile(file, idx) {
      let id = file.id;
      this.$api
          .getServerAction("/insight/attachment/delete", {id: id})
          .then((res) => {
            if (res.code == 200) {
              this.fileList.splice(idx, 1);
            }
          });
    },
    //文件移除操作
    handleRemove(file, fileList) {
      let id = file.id;
      this.$api
          .getServerAction("/insight/attachment/delete", {id: id})
          .then((res) => {
            if (res.code == 200) {
              this.fileList = fileList;
            }
          });
    },
    //点击文件列表中已上传文件进行下载
    handlePreview(file) {
      var a = document.createElement("a");
      var event = new MouseEvent("click");
      a.download = file.name;
      a.href = file.url;
      a.dispatchEvent(event);
    },
    //删除操作
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //上传成功
    handleSuccess(res) {
      if (res.success) {
        this.fileList.push({
          name: res.data.filename,
          id: res.data.id,
          url:
              this.$store.state.yqInfo.serverIp +
              "/insight/attachment/download" +
              "/" +
              res.data.filename,
        });
        console.log("上传成功：", this.fileList);
      } else {
        this.$message.error("上传失败!" + res.message);
      }
    },
    /**
     * 关闭弹出框
     * */
    chosePop() {
      this.showPop = false;
      this.$emit("close");
    },
    /**
     * 确定按钮
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/faultKnowledge/edit";
          let message = "修改成功";
          if (this.form.isShow) {
            path = "/insight/faultKnowledge/create";
            message = "添加成功";
          }
          this.$api.postServerAction(path, this.form).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success(message);
              this.$emit("page");
            } else {
              this.$message.error(res.info);
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-upload--picture-card {
  background-color: transparent;
  color: var(--text-color);
  border: var(--status-bar-tools-border);
  width: 8vw;
  height: 8vw;
}

.file-item {
  color: var(--text-color);
  border: var(--status-bar-tools-border);
  width: 8vw;
  height: 8vw;
  border-radius: 5px;
  margin-right: 16px;
  margin-top: 5px;
  position: relative;
  font-size: var(--text-size-light);
}

.file-del {
  position: absolute;
  top: 0.2vw;
  right: 0.2vw;
  color: var(--text-color-weak)
}

.file-del:hover {
  color: var(--hover-color);
}
</style>
