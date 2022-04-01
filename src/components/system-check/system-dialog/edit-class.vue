<template>
  <div>
    <!-- 左侧编辑分类 -->
    <tis-dialog
      append-to-body
      title="编辑分类"
      :visible.sync="editClass"
      width="60%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="flex">
        <tis-button type="primary" @click="addTab()">添 加 </tis-button>
      </div>
      <div>
        <div class="device-collapse">
          <div
            class="device-collapse-item"
            v-for="(t, k) in classData"
            :key="k"
          >
            <div class="device-collapse-item-title flex-between">
              <div class="right">{{ t.name }}</div>
              <div class="left flex">
                <tis-button type="text" @click.stop="update(t)">
                  编辑
                </tis-button>
                <tis-button type="text" @click.stop="remove(t)">
                  删除
                </tis-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </tis-dialog>
    <!--    分类基本信息-->
    <tis-dialog
      append-to-body
      title="分类信息"
      :visible.sync="showInfo"
      :style="$store.state.yqInfo.dialogBg"
      width="50%"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <tis-form
        ref="form"
        :model="form"
        label-width="100px"
        style="margin-top: 10px"
      >
        <tis-form-item
          label="分类名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'change' },
          ]"
        >
          <tis-input
            v-model.trim="form.name"
            placeholder="请输入分类名称"
            maxlength="15"
            show-word-limit
          ></tis-input>
        </tis-form-item>
        <tis-form-item label="分类描述" prop="describe">
          <tis-input
            placeholder="请输入描述"
            type="textarea"
            :rows="8"
            maxlength="100"
            show-word-limit
            v-model="form.describe"
          ></tis-input>
        </tis-form-item>
      </tis-form>
      <span slot="footer" class="dialog-footer">
        <tis-button @click="closeClass">取 消</tis-button>
        <tis-button type="primary" @click="submit">确 定</tis-button>
      </span>
    </tis-dialog>
  </div>
</template>

<script>
export default {
  props: ["classData"],
  data() {
    return {
      showInfo: false,//分类基本信息弹框
      editClass: false,//分类弹框
      //分类信息
      form: {
        id: "",
      },
    };
  },
  methods: {
    //分类添加
    addTab() {
      this.form = {
        id: "",
      };
      if (this.$refs["form"] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs["form"].resetFields();
      }
      this.showInfo = true;
    },
    //分类关闭
    closeClass() {
      this.showInfo = false;
    },
    //分类添加修改
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/systemCheckClass/update";
          let message = "修改成功";
          if (this.form.id == "") {
            path = "/insight/systemCheckClass/insert";
            message = "添加成功";
          }
          this.$api.postServerAction(path, this.form).then((res) => {
            this.$yqLoading.hide();
            if (res.code == 200) {
              this.$message.success(message);
              this.showInfo = false;
              this.$parent.page();
            } else {
              this.$message.error(res.info);
            }
          });
        } else {
          return false;
        }
      });
    },
    //分类修改
    update(item) {
      if (this.$refs["form"] !== undefined) {
        // 清除表单内容和清除表单验证消息
        this.$refs["form"].resetFields();
      }
      this.form = JSON.parse(JSON.stringify(item));
      this.showInfo = true;
    },
    //分类删除
    remove(row) {
      this.$yqAlert({
        content: "确认删除？",
        hideCancel: false,
        suc: () => {
          this.$yqLoading.show();
          this.$api
            .getServerAction("/insight/systemCheckClass/delete", {
              id: row.id,
            })
            .then((res) => {
              this.$yqLoading.hide();
              if (res.code == 200) {
                this.$message.success("删除成功！");
                this.$parent.page();
              } else {
                this.$message.warning("删除失败！");
              }
            });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.device-collapse{
    height: 50vh;
    overflow-y: scroll;
}
.device-collapse-item {
    padding: 8px;
    margin-top: 16px;
    border-radius: 3px;
   border: var(--status-bar-tools-border);
}
</style>
