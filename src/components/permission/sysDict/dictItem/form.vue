<template>
  <div>
    <tis-dialog :visible.sync="edit" :title="(form.id?'编辑':'添加')" width="650px"
                :close-on-click-modal='false'
                :modal-append-to-body='false'
                :close-on-press-escape=' false'>
      <tis-form :model="form" ref="form" label-width="80px">
        <tis-form-item label="名称" prop="name"
                       :rules="[
          { required: true, message: '请输入名称', trigger: 'change' },
        ]">
          <tis-input v-model.trim="form.name" placeholder="请输入名称"  maxlength="50"
                     show-word-limit/>
        </tis-form-item>
        <tis-form-item label="数据值" prop="value" :rules="[
          { required: true, message: '请输入数据值', trigger: 'change' },
        ]">
          <tis-input v-model.trim="form.value" placeholder="请输入数据值"  maxlength="50"
                     show-word-limit/>
        </tis-form-item>
        <tis-form-item label="排序" prop="sort" >
<!--          <tis-input v-model="form.sort" placeholder="请输入字典排序" clearable/>-->
          <tis-input-number style="float: left" v-model="form.sort" controls-position="right" :min="1" ></tis-input-number>
        </tis-form-item>
        <tis-form-item label="是否可用" prop="status">
          <tis-switch v-model="form.status" active-text="是" inactive-text="否" active-value="1" style="float: left;margin-top: 10px"
                     inactive-value="0"/>
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
  props: {
    form: Object,//表单信息
    dictId: String,//字典配置ID
    edit: Boolean//添加编辑是否展示
  },
  watch:{
    edit(val){
      if (val){
        if (this.$refs['form']!==undefined) {
          // 清除表单内容和清除表单验证消息
          this.$refs['form'].resetFields();
        }
      }

    }
  },
  methods: {
    //返回
    close() {
      this.$emit('close')
    },
    //保存表单
    saveForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/dictItem/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/dictItem/insert";
            message = "添加成功";
          }
          this.form.dict_id=this.dictId
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
