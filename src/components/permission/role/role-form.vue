<template>
  <div>
    <tis-form
        ref="form"
        :model="form"
        label-width="100px"
        style="margin-top: 10px"
    >
      <tis-form-item
          label="角色名称"
          prop="name"
          :rules="[
          { required: true, message: '请输入角色名称', trigger: 'change' },
        ]"
      >
        <tis-input
            v-model.trim="form.name"
            placeholder="请输入角色名称"
            maxlength="50"
            show-word-limit
        ></tis-input>
      </tis-form-item>
      <tis-form-item
          label="角色编码"
          prop="code"
          :rules="[
            { required: true, validator: validateCode, trigger: 'change' },
          ]"
      >
        <tis-input maxlength="50" show-word-limit v-model.trim="form.code" placeholder="请输入角色编码"
                   v-if="form.id == undefined"></tis-input>
        <tis-input maxlength="50" show-word-limit v-model.trim="form.code" placeholder="请输入角色编码" v-else
                   :disabled="true"></tis-input>
      </tis-form-item>
      <tis-form-item
          label="描述"
          prop="description"
      >
        <tis-input
            placeholder="请输入描述"
            type="textarea"
            :rows="8"
            maxlength="200"
            show-word-limit
            v-model="form.description"
        ></tis-input>
      </tis-form-item>

    </tis-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {},//表单信息
    showPop: Boolean,
  },
  updated() {
    if (!this.showPop && this.form.id != undefined) {
      this.$emit("page");
    }
  },
  watch: {
    showPop(val) {
      if (val) {
        if (this.$refs['form'] !== undefined) {
          // 清除表单内容和清除表单验证消息
          this.$refs['form'].resetFields();
        }
      }

    }
  },
  methods: {
    validateCode(rule, value, callback) {
      if (value == "" || value == undefined) {
        callback(new Error("请输入角色编码"));
      }
      var a = /[^a-zA-Z_-]/g
      if (a.test(value)) {
        callback(new Error("只可输入英文字母和 '-' '_'字符"));
      }
      callback();
    },
    /**
     * 确定按钮
     */
    submit() {

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/role/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/role/insert";
            message = "添加成功";
          }
          this.$api.postServerAction(path, this.form).then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success(message);
                  this.lodaing();
                }
              }
          );
        } else {
          return false;
        }
      });
    },
    //分页加载
    lodaing() {
      this.$emit("page");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
