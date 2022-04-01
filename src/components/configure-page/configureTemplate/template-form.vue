<template>
  <div>
    <tis-form
        ref="form"
        :model="form"
        label-width="100px"

    >
      <tis-form-item
          label="模板名称"
          prop="name"
          :rules="[
          { required: true,message: '请输入模板名称', trigger: 'change' },
        ]"
      >
        <tis-input
            v-model.trim="form.name"
            placeholder="请输入模板名称"
            maxlength="50"
            show-word-limit
        ></tis-input>
      </tis-form-item>
      <tis-form-item
              label="文件类型"
              prop="type"
              :rules="[
            { required: true, message: '请选择类型', trigger: 'change' },
          ]"
      >
        <select-dict v-model="form.type" placeholder="请选择类型" type="configureType" ></select-dict>
      </tis-form-item>
      <tis-form-item
          label="模板文件"
          prop="file_name"
          :rules="[
            { required: true,validator: validateFile, trigger: 'change' },
          ]"
      >
        <drag-upload
              :dragInputId="'pluginDrag'"
              :fileName="pluginStr"
              :upTip="'拖到或点击这里上传文件'"
              @dragClick="dragClick('pluginDrag')"
              @dragUpLoad="iconChoose($event, 1)"
              @delFile="delFile('plugin')"
      ></drag-upload>
      </tis-form-item>

      <tis-form-item
          label="模板描述"
          prop="describe"
      >
        <tis-input
            placeholder="请输入模板描述"
            type="textarea"
            :rows="8"
            maxlength="200"
            show-word-limit
            v-model.trim="form.describe"
        ></tis-input>
      </tis-form-item>
    </tis-form>
  </div>
</template>

<script>
import dragUpload from '../../page/drag-upload'
export default {
  components: { dragUpload},
  props: {
    form: {},
    pluginList: {},
    alarmRuleList: [],
    showPop: Boolean,
    disabled: Boolean,
    pluginObj: {
      plugin: ""
    }
  },
  data() {
    return {
    };
  },
  computed: {
    //文件名截取
    pluginStr() {
      console.log(this.pluginObj.plugin)
      if (this.pluginObj.plugin) {
        let arr = this.pluginObj.plugin.split("/");
        return arr[arr.length - 1];
      } else {
        return "";
      }
    }
  },
  updated() {
    if (!this.showPop && this.form.id != undefined) {
      this.$emit("page");
    }
  },
  watch:{
    showPop(val){
      if (val){
        if (this.$refs['form']!==undefined) {
          // 清除表单内容和清除表单验证消息
          this.$refs['form'].resetFields();
        }
      }

    }
  },
  methods: {
    //删除文件
    delFile(key) {
      this.pluginObj[key] = "";
    },
    //文件点击
    dragClick(id) {
      console.log("aaaa", id);
      document.getElementById(id).click();
    },
    //校验文件
    validateFile(rule, value, callback) {

      if (this.pluginObj.plugin == "" || this.pluginObj.plugin == undefined) {
        return callback(new Error("请选择配置文件"));
      }
      return callback();
    },
    //选择文件信息
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
                  console.log( this.pluginObj)
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
     * 确定按钮
     */
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/configureTemplate/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/configureTemplate/insert";
            message = "添加成功";
          }
          this.form.file_name=this.pluginObj.plugin
          this.$api.postServerAction(path, this.form).then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success(message);
                  this.pluginObj.plugin=""
                  this.lodaing();
                }else{
                  this.$message.error(res.info);
                }
              },
              function () {
                // errorFunc(error, self.$message);
              }
          );
        } else {
          return false;
        }
      });
    },
    //列表分页查询
    lodaing() {
      this.$emit("page");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
