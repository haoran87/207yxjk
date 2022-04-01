<template>
  <div>
    <div style="margin-top: 10px">
      <tis-steps :active="actives" finish-status="success" simple>
        <tis-step title="基本信息"></tis-step>
        <tis-step title="目标信息"></tis-step>
        <tis-step title="下发"></tis-step>
      </tis-steps>
    </div>
    <div v-if="actives == 1">
      <tis-form
          ref="form"
          :model="form"
          label-width="100px"
          style="margin-top: 10px"
      >
        <tis-form-item
            label="配置名称"
            prop="name"
            :rules="[
            { required: true, message: '请输入配置名称', trigger: 'change' },
          ]"
        >
          <tis-input
              v-model.trim="form.name"
              maxlength="50"
              show-word-limit
              placeholder="请输入配置名称"
          ></tis-input>
        </tis-form-item>

        <tis-form-item
            label="配置类型"
            prop="type"
            :rules="[
            { required: true, message: '请选择配置类型', trigger: 'change' },
          ]"
        >
          <select-dict
              v-model.trim="form.type"
              placeholder="请选择类型"
              type="configureType"
          ></select-dict>
        </tis-form-item>
        <tis-form-item
            label="配置文件"
            prop="file_name"
            :rules="[
            { required: true, validator: validateFile, trigger: 'change' },
          ]"
        >
          <drag-upload
              :dragInputId="'pluginDrag'"
              :fileName="pluginStr"
              :upTip="'拖到或点击这里上传文件'"
              @dragClick="dragClick('pluginDrag')"
              @dragUpLoad="iconChoose($event)"
              @delFile="delFile('plugin')"
          ></drag-upload>
        </tis-form-item>
        <tis-form-item label="配置描述" prop="describe">
          <tis-input
              placeholder="请输入配置描述"
              type="textarea"
              :rows="8"
              maxlength="200"
              show-word-limit
              v-model="form.describe"
          ></tis-input>
        </tis-form-item>
        <tis-form-item>
          <tis-button type="primary" @click="submit()" style="float: right"
          >下一步
          </tis-button
          >
        </tis-form-item>
      </tis-form>
    </div>

    <div v-else-if="actives == 2">
      <issue-form :id="sendId" @up="up" @listPage="listPage"></issue-form>
    </div>
    <div v-else>
      <issue-list
          :active="actives"
          :id="sendId"
          @up="up"
          @chosePop="chosePop"
      ></issue-list>
    </div>
  </div>
</template>

<script>
import dragUpload from "../../page/drag-upload";
import IssueForm from "./issue-form";
import IssueList from "./issue-list";

export default {
  components: {IssueList, IssueForm, dragUpload},
  watch: {
    form: {
      handler(newName) {
        if (newName.id != undefined) {
          this.pluginObj.plugin = newName.file_name;
        }else{
          this.pluginObj.plugin =""
        }
        if (newName.template && newName.file_name != "") {
          this.pluginObj.plugin = newName.file_name;
        }
      },
      immediate: true,
    },
    showPop(val) {
      if (val) {
        if (this.$refs['form'] !== undefined) {
          // 清除表单内容和清除表单验证消息
          this.$refs['form'].resetFields();
        }
      }else{
        this.active=1
      }
    }
  },
  props: {
    form: {},//下发信息
    showPop: Boolean,
    //步骤数
    active: {
      type: [Number, String],
      default: 1,
    },
  },
  data() {
    return {
      sendId: "",//下发ID
      actives:this.active,//步骤数
      //文件信息
      pluginObj: {
        plugin: "",
      },
    };
  },
  computed: {
    pluginStr() {
      if (this.pluginObj.plugin) {
        let arr = this.pluginObj.plugin.split("/");
        return arr[arr.length - 1];
      } else {
        return "";
      }
    },
  },
  methods: {
    //检测文件
    validateFile(rule, value, callback) {
      if (this.form.file_name == "" || this.form.file_name == undefined) {
        return callback(new Error("请选择配置文件"));
      }
      return callback();
    },
    //删除文件
    delFile(key) {
      this.pluginObj[key] = "";
      this.form.file_name = "";
    },
    dragClick(id) {
      document.getElementById(id).click();
    },
    //选择文件
    iconChoose(e) {
      var file = e;
      let formData = new FormData();
      formData.append("uploadFile", file);
      this.$yqLoading.show("正在上传文件");
      this.$api
          .postServerAction("/insight/configureTemplate/upload", formData)
          .then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.pluginObj.plugin = res.data.file_name;
                  this.form.file_name = res.data.file_name;
                } else {
                  this.$message.error("上传失败！");
                }
              },
              () => {
                this.$yqLoading.hide();
              }
          );
    },
    /**
     * 关闭弹出框
     * */
    chosePop() {
      this.$emit("close");
    },
    /**
     * 确定按钮
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/configureSend/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/configureSend/insert";
            message = "添加成功";
          }
          this.$api.postServerAction(path, this.form).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              if (this.form.id != undefined) {
                this.sendId = this.form.id;
              } else {
                this.sendId = res.data;
                this.form.id = this.sendId;
              }
              this.$message.success(message);
              this.actives = 2;
              this.listPage();
            } else {
              this.$message.success(res.info);
            }
          });
        } else {
          return false;
        }
      });
    },
    //列表加载
    listPage(){
      this.$emit("page");
    },
    //上一步或者下一步
    up(sum) {
      this.actives = sum;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
