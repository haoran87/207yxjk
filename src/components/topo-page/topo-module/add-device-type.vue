<template>
  <tis-dialog
    title="添加设备分类"
    width="50%"
     :style="$store.state.yqInfo.dialogBg"
    :close-on-click-modal="false"
    :visible.sync="visibleShow"
    :show-close="false"
    append-to-body
  >
    <tis-form :model="deviceForm" :rules="rules" ref="addForm" >
      <tis-form-item label="设备名称" :label-width="formLabelWidth" prop="name" >
        <tis-input
          v-model.trim="deviceForm.name"
          maxlength="50" show-word-limit
          autocomplete="off"
        ></tis-input>
      </tis-form-item>
      <tis-form-item label="设备类型" :label-width="formLabelWidth" prop="code" :rules="[{ required: true, validator: validateCode, trigger: 'change' }]">
        <tis-input
          v-model.trim="deviceForm.code"
          maxlength="50" show-word-limit
          autocomplete="off"
        ></tis-input>
      </tis-form-item>
      <tis-form-item label="设备说明" :label-width="formLabelWidth">
        <tis-input
          v-model="deviceForm.description"
          maxlength="200" show-word-limit
          autocomplete="off"
        ></tis-input>
      </tis-form-item>
    </tis-form>
    <div slot="footer" class="dialog-footer">
      <tis-button @click="hideForm">取 消</tis-button>
      <tis-button type="primary" @click="addDeviceType">确 定</tis-button>
    </div>
  </tis-dialog>
</template>
<script>
export default {
  data() {
    return {
      formLabelWidth: "120px",
      deviceForm: {
        name: "",
        code: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "请填写设备名称", trigger: "change" },
        ],
      },
      visibleShow: false,
    };

  },
  watch:{
    visibleShow(val){
      if (val&&this.$refs['addForm'] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs['addForm'].resetFields();
      }
    }
  },
  methods: {
     validateCode(rule, value, callback){
      if (value == "" || value == undefined) {
        callback(new Error("请填写设备类型"));
      }
      var a=/[^a-zA-Z_-]/g
      if (a.test(value)) {
        callback(new Error("只可输入英文字母和 '-' '_'字符"));
      }
      callback();
    },
    initForm() {
      this.deviceForm = {
        name: "",
        code: "",
        description: "",
      };
    },
    hideForm() {
      this.visibleShow = false;
    },
    addDeviceType() {
      // if (!this.deviceForm.name) {
      //   this.$message.warning("请填写分类名称！");
      //   return;
      // }
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          let path = "/insight/topoDevice/insert";
          if (this.deviceForm.ID) {
            path = "/insight/topoDevice/update";
          }
          this.hideForm();
          this.$yqLoading.show();
          this.$api.postServerAction(path, this.deviceForm).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$parent.getDeviceType();
              this.$message.success("添加设备分类成功");
            }else{
              this.$message.error(res.info)
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
<style lang="scss" scoped>
</style>
