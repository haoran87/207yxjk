<template>
  <div>
    <tis-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')" width="650px"
                :modal-append-to-body='false'
                :close-on-click-modal='false'
                @close="close"
                :close-on-press-escape=' false'>
      <tis-form :model="form" ref="form" label-width="80px">
        <tis-form-item label="字典名称" prop="name"
                       :rules="[
          { required: true, message: '请输入字典名称', trigger: 'change' },
        ]">
          <tis-input v-model.trim="form.name" placeholder="请输入字典名称" maxlength="50"
                     show-word-limit/>
        </tis-form-item>
        <tis-form-item label="字典编码" prop="value" :rules="[
          { required: true,  validator: validateCode, trigger: 'change' },
        ]">
          <tis-input v-model.trim="form.value" placeholder="请输入字典编码" maxlength="50"
                     show-word-limit/>
        </tis-form-item>
        <tis-form-item label="描述" prop="description">
          <tis-input type="textarea" v-model="form.description" :autosize="{ minRows: 3, maxRows: 6 }"
                     maxlength="200"
                     show-word-limit
                     placeholder="请输入字典描述" clearable/>
        </tis-form-item>
      </tis-form>
      <div slot="footer" class="dialog-footer">
        <tis-button @click="close">取 消</tis-button>
        <tis-button type="primary" @click="saveForm">保 存</tis-button>
      </div>
    </tis-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
  watch: {
    edit(val) {
      if (val) {
        if (this.$refs['form'] !== undefined) {
          // 清除表单内容和清除表单验证消息
          this.$refs['form'].resetFields();
        }
      }

    }
  },
  props: {
    form: {},//表单信息
    edit: Boolean//字典信息显示关闭
  },
  methods: {
    validateCode(rule, value, callback) {
      if (value == "" || value == undefined) {
        callback(new Error("请输入字典编码"));
      }
      var a = /[^a-zA-Z_-]/g
      if (a.test(value)) {
        callback(new Error("只可输入英文字母和 '-' '_'字符"));
      }
      callback();
    },
    /**
     * 关闭
     * */
    close() {
      this.$emit('close')
    },
    /**
     * 保存
     */
    saveForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/dict/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/dict/insert";
            message = "添加成功";
          }
          this.$yqLoading.hide();
          this.$api.postServerAction(path, this.form).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success(message);
              this.$emit("page")
              this.close()
            } else {
              this.$message.error(res.info);
            }

          })
        }
      })
    },
  },

}
</script>
<style lang="scss" scoped>
</style>
