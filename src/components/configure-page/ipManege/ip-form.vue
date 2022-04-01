<template>
  <div>
    <tis-form
        ref="form"
        :model="form"
        label-width="100px"
        style="margin-top: 10px"
    >
      <tis-form-item
          label="IP名称"
          prop="name"
          :rules="[
          { required: true, message: '请输入IP名称', trigger: 'change' },
        ]"
      >
        <tis-input
            v-model.trim="form.name"
            placeholder="请输入IP名称"
            maxlength="50"
            show-word-limit
        ></tis-input>
      </tis-form-item>
      <tis-form-item
          v-for="(domain, index) in form.urlList"
          label="IP地址"
          :key="domain.key"
          :prop="'urlList.' + index"
          :rules="[{ required: true, validator: validateIp, trigger: 'change' }]"

      >
        <div class="flex">
          <tis-input
              @input="change($event)"
              placeholder="请输入IP地址" style="margin-right: 10px" v-model.trim="domain.value">
          </tis-input>
          <tis-button v-if="index==0" @click="addDomain" type="primary" style="margin-left: 5px">新增</tis-button>
          <tis-button v-if="index!=0" @click.prevent="removeDomain(domain)" type="danger" style="margin-left: 5px">删除
          </tis-button>
        </div>
      </tis-form-item>
      <!--      <tis-form-item
                label="配置地址"
                prop="address"
                :rules="[
                  { required: true, validator:validateUrl, trigger: 'change' },
                ]"
            >
              <tis-input v-model="form.address" placeholder="请输入配置地址"></tis-input>
            </tis-form-item>-->
      <tis-form-item
          label="IP描述"
          prop="describe"
      >
        <tis-input
            placeholder="请输入描述"
            type="textarea"
            maxlength="200"
            show-word-limit
            :rows="8"
            v-model="form.describe"
        ></tis-input>
      </tis-form-item>

    </tis-form>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      urlList: [{
        value: ''
      }],
    },
    pluginList: {},
    alarmRuleList: [],
    showPop: Boolean,
    disabled: Boolean,
  },
  data() {
    return {};
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
  updated() {
    if (!this.showPop && this.form.id != undefined) {
      this.$emit("page");
    }
  },
  methods: {
    change() {
      this.$forceUpdate()
    },
    //IP校验
    validateIp(rule, value, callback) {
      console.log(value)
      if (value.value == "" || value.value == undefined) {
        return callback(new Error("IP地址不能为空"));
      }
      var reg =
          /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/;
      var re = new RegExp(reg);
      var ip = value.value;
      if (!re.test(ip) && ip != "" && ip != undefined) {
        return callback(new Error("请填写有效的IP地址"));
      }
      if (this.checkRepeat(this.form.urlList)) {
        return callback(new Error("IP地址不能重复"));
      }
      return callback();
    },
    //配置地址校验
    validateUrl(rule, value, callback) {
      console.log(
          value
      )
      if (value == "" || value == undefined) {
        return callback(new Error("配置地址不能为空"));
      }
      var a = /^\/.+$/;

      if (!a.test(value) || value.substr(value.length - 1, 1) == '/') {
        return callback(new Error("请输入正确格式。例如:/a/a"));
      }
      return callback();
    },
    //检测是否有重复
    checkRepeat(ary) {
      const ids = ary.map(a => a.value)
      const idsSet = new Set(ids)
      if (idsSet.size == ids.length) {
        return false
      } else {
        return true
      }
    },
    //删除
    removeDomain(item) {
      this.$forceUpdate()
      var index = this.form.urlList.indexOf(item)
      if (index !== -1) {
        this.form.urlList.splice(index, 1)
      }
    },
    //新增
    addDomain() {
      this.$forceUpdate()
      this.form.urlList.push({
        value: ''
      });
    },
    /**
     * 确定按钮
     *
     * */
    submit() {

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$yqLoading.show();
          let path = "/insight/ipManage/update";
          let message = "修改成功";
          if (this.form.id == undefined) {
            path = "/insight/ipManage/insert";
            message = "添加成功";
          }
          let ids = ""
          this.form.urlList.forEach((item, index) => {
            if ((index + 1) == this.form.urlList.length) {
              ids += item.value
            } else {
              ids += item.value + ","
            }
          })
          this.form.url = ids
          console.log(this.form)
          this.$api.postServerAction(path, this.form).then(
              (res) => {
                this.$yqLoading.hide();
                if (res.code == 200) {
                  this.$message.success(message);
                  this.lodaing();
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
    //分页查询
    lodaing() {
      this.$emit("page");
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
